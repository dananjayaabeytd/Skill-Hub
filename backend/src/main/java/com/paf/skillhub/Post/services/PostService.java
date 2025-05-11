package com.paf.skillhub.Post.services;

import com.paf.skillhub.Follow.repositories.FollowerRepository;
import com.paf.skillhub.Notification.Enums.NotificationType;
import com.paf.skillhub.Notification.services.NotificationService;
import com.paf.skillhub.Post.dto.PostDTO;
import com.paf.skillhub.Post.dto.PostMediaDTO;
import com.paf.skillhub.Post.dto.PostResponseDTO;
import com.paf.skillhub.Post.models.MediaType;
import com.paf.skillhub.Post.models.Post;
import com.paf.skillhub.Post.models.PostLike;
import com.paf.skillhub.Post.models.PostMedia;
import com.paf.skillhub.Post.repositories.CommentRepository;
import com.paf.skillhub.Post.repositories.PostLikeRepository;
import com.paf.skillhub.Post.repositories.PostMediaRepository;
import com.paf.skillhub.Post.repositories.PostRepository;
import com.paf.skillhub.Skill.models.Skill;
import com.paf.skillhub.Skill.repositories.SkillRepository;
import com.paf.skillhub.User.models.User;
import com.paf.skillhub.User.repositories.UserRepository;
import com.paf.skillhub.utils.GCSUtils.GCSService;
import com.paf.skillhub.utils.fileUpload.FileUploadService;
import com.paf.skillhub.utils.fileUpload.Res;
import java.io.File;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class PostService {

  @Autowired
  private PostRepository postRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private CommentRepository commentRepository;

  @Autowired
  private PostLikeRepository postLikeRepository;

  @Autowired
  private PostMediaRepository postMediaRepository;

  @Autowired
  private SkillRepository skillRepository;

  @Autowired
  private FollowerRepository followerRepository;

  @Autowired
  private NotificationService notificationService;

  @Autowired
  private GCSService gcsService;

  public PostResponseDTO getPostById(Long postId, Long viewerId) {
    Post post = postRepository.findById(postId)
        .orElseThrow(() -> new IllegalArgumentException("Post not found with id: " + postId));

    // Check if post is public or if the viewer is the post owner
    if (Boolean.TRUE.equals(post.getIsPublic()) ||
        (viewerId != null && viewerId.equals(post.getUser().getUserId()))) {
      return mapToPostResponseDTO(post);
    }

    throw new IllegalArgumentException("You don't have permission to view this post");
  }

  // Overload for public access check only
  public PostResponseDTO getPostById(Long postId) {
    Post post = postRepository.findById(postId)
        .orElseThrow(() -> new IllegalArgumentException("Post not found with id: " + postId));
      return mapToPostResponseDTO(post);
  }

  public Post addPost(PostDTO postDTO, List<MultipartFile> files)
      throws IOException, GeneralSecurityException {
    // Get skill if skillId is provided
    Skill skill = null;
    if (postDTO.getSkillId() != null) {
      skill = skillRepository.getSkillBySkillId(postDTO.getSkillId());
    }

    // Get user
    User user = userRepository.getByUserId(postDTO.getUserId());

    // Create new post
    Post newPost = new Post();
    newPost.setDescription(postDTO.getDescription());
    newPost.setSkill(skill);
    newPost.setCreatedAt(LocalDateTime.now());
    newPost.setIsPublic(postDTO.getIsPublic() != null ? postDTO.getIsPublic() : true); // Set default to true if not specified
    newPost.setUser(user);

    Post savedPost = postRepository.save(newPost);

    // Handle file uploads
    List<PostMedia> mediaList = new ArrayList<>();
    for (MultipartFile file : files) {
      if (!file.isEmpty()) {
        File tempFile = File.createTempFile("temp", null);
        file.transferTo(tempFile);

        // Use GCSService to upload the file
        Res res = gcsService.uploadFileToGCS(tempFile.toPath(), file.getContentType());

        PostMedia media = new PostMedia();
        media.setPost(savedPost);
        media.setCreatedAt(LocalDateTime.now());
        media.setMediaUrl(res.getUrl());
        media.setMediaType(
            file.getContentType().startsWith("image") ? MediaType.PHOTO : MediaType.VIDEO);
        mediaList.add(media);

        // Delete the temporary file
        tempFile.delete();
      }
    }

    User postUser = userRepository.getByUserId(postDTO.getUserId());
    List<Long> userIdsToSendNotification = followerRepository.findFollowerUserIdsByUserId(postDTO.getUserId());
    String message = postUser.getUserName() + " added new post";
    notificationService.createNotificationsForMultipleUsers(userIdsToSendNotification,postDTO.getUserId(), NotificationType.POST,message);

    postMediaRepository.saveAll(mediaList);
    return savedPost;
  }

  public List<PostResponseDTO> getPostsByUser(Long userId) {
    List<Post> posts = postRepository.findByUserUserId(userId);
    return posts.stream()
        .map(this::mapToPostResponseDTO)
        .collect(Collectors.toList());
  }

  public PostResponseDTO mapToPostResponseDTO(Post post) {
    PostResponseDTO responseDTO = new PostResponseDTO();
    responseDTO.setPostId(post.getPostId());
    responseDTO.setUserId(post.getUser().getUserId());
    responseDTO.setDescription(post.getDescription());
    responseDTO.setCreatedAt(post.getCreatedAt());
    responseDTO.setUpdatedAt(post.getUpdatedAt());
    responseDTO.setSkillName(post.getSkill() != null ? post.getSkill().getSkillName() : null);
    responseDTO.setIsPublic(post.getIsPublic());

    // Map all PostMedia to PostMediaDTO
    List<PostMediaDTO> mediaDTOs = post.getPostMedia().stream()
        .map(media -> new PostMediaDTO(
            media.getMediaType().toString(),
            media.getMediaUrl()
        ))
        .collect(Collectors.toList());
    responseDTO.setMedia(mediaDTOs);

    return responseDTO;
  }
  public List<Post> getPostsBySkill(Long skillId) {
    Skill skill = skillRepository.getSkillBySkillId((skillId));
    return postRepository.findBySkill(skill);
  }

  public Post updatePost(Post post) {
    return postRepository.save(post);
  }

  @Transactional
  public void deletePost(Long postId) {
    // First check if post exists
    Post post = postRepository.findById(postId)
        .orElseThrow(() -> new IllegalArgumentException("Post not found"));

    // Delete post likes manually
    postLikeRepository.deleteByPostPostId(postId);



    // Now delete the post (cascades to comments and media)
    postRepository.deleteById(postId);
  }

  public Post updatePostById(Long postId, PostDTO postDTO) {
    Post existingPost = postRepository.findById(postId)
        .orElseThrow(() -> new IllegalArgumentException("Post not found"));

    // Update description if provided
    if (postDTO.getDescription() != null) {
      existingPost.setDescription(postDTO.getDescription());
    }

    // Update skill if skillId is provided
    if (postDTO.getSkillId() != null) {
      Skill skill = skillRepository.getSkillBySkillId(postDTO.getSkillId());
      existingPost.setSkill(skill);
    }

    // Update privacy setting if provided
    if (postDTO.getIsPublic() != null) {
      existingPost.setIsPublic(postDTO.getIsPublic());
    }

    existingPost.setUpdatedAt(LocalDateTime.now());
    return postRepository.save(existingPost);
  }


  public PostLike addLikeToPost(Long postId, Long userId) {
    Post post = postRepository.findById(postId)
        .orElseThrow(() -> new IllegalArgumentException("Post not found"));
//    User user = new User(userId); // Assuming user exists
    User user = userRepository.getByUserId(userId); // Assuming user exists
    PostLike like = new PostLike();
    like.setPost(post);
    like.setUser(user);
    like.setCreatedAt(LocalDateTime.now());
    return postLikeRepository.save(like);
  }
}
