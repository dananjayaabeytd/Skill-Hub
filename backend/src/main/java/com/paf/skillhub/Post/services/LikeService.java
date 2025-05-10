package com.paf.skillhub.Post.services;


import com.paf.skillhub.Notification.Enums.NotificationType;
import com.paf.skillhub.Notification.services.NotificationService;
import com.paf.skillhub.Post.models.Post;
import com.paf.skillhub.Post.models.PostLike;
import com.paf.skillhub.Post.repositories.PostLikeRepository;
import com.paf.skillhub.Post.repositories.PostRepository;
import com.paf.skillhub.User.models.User;
import com.paf.skillhub.User.repositories.UserRepository;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LikeService {

  @Autowired
  private PostLikeRepository likeRepository;

  @Autowired
  private PostRepository postRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private NotificationService notificationService;

  public void likePost(Long postId, Long userId) {

    Post post = postRepository.getPostByPostId(postId);
    User user = userRepository.getByUserId(userId);

    Optional<PostLike> existingLike = likeRepository.findByPostAndUser(post, user);
    if (existingLike.isEmpty()) {
      PostLike like = new PostLike();
      like.setPost(post);
      like.setUser(user);
      like.setCreatedAt(LocalDateTime.now());

      String message = user.getUserName() + " liked your post.";

      notificationService.createNotification(post.getUser().getUserId(),userId, NotificationType.LIKE,message);
      likeRepository.save(like);
    } else {
      throw new IllegalArgumentException("User has already liked this post.");
    }
  }

  @Transactional
  public void unlikePost(Long postId, Long userId) {
    Post post = postRepository.getPostByPostId(postId);
    User user = userRepository.getByUserId(userId);
    Optional<PostLike> existingLike = likeRepository.findByPostAndUser(post, user);
    existingLike.ifPresent(likeRepository::delete);
  }

  public long getLikesCount(Long postId) {
    Post post = postRepository.getPostByPostId(postId);
    return likeRepository.countByPost(post);
  }

  public boolean checkUserLike(Long postId, Long userId) {
    Post post = postRepository.getPostByPostId(postId);
    User user = userRepository.getByUserId(userId);
    return likeRepository.findByPostAndUser(post, user).isPresent();
  }
}
