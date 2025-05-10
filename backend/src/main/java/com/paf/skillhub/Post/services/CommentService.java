package com.paf.skillhub.Post.services;

import com.paf.skillhub.Post.dto.CommentDTO;
import com.paf.skillhub.Post.models.Comment;
import com.paf.skillhub.Post.models.Post;
import com.paf.skillhub.Post.repositories.CommentRepository;
import com.paf.skillhub.Post.repositories.PostRepository;
import com.paf.skillhub.User.models.User;
import com.paf.skillhub.User.repositories.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CommentService {

  @Autowired
  private CommentRepository commentRepository;

  @Autowired
  private PostRepository postRepository;

  @Autowired
  private UserRepository userRepository;

  public CommentDTO addComment(Long postId, Long userId, String commentText) {
    Post post = postRepository.findById(postId)
        .orElseThrow(() -> new RuntimeException("Post not found"));

    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));

    Comment comment = new Comment();
    comment.setPost(post);
    comment.setUser(user);
    comment.setCommentText(commentText);
    comment.setCreatedAt(LocalDateTime.now());

    Comment savedComment = commentRepository.save(comment);
    return convertToDTO(savedComment);
  }

  public List<CommentDTO> getCommentsByPost(Long postId) {
    return commentRepository.findByPostPostId(postId).stream()
        .map(this::convertToDTO)
        .collect(Collectors.toList());
  }

  public CommentDTO updateComment(Long commentId, Long userId, String newCommentText) {
    Comment comment = commentRepository.findById(commentId)
        .orElseThrow(() -> new RuntimeException("Comment not found"));

    if (!comment.getUser().getUserId().equals(userId)) {
      throw new RuntimeException("User not authorized to update this comment");
    }

    comment.setCommentText(newCommentText);
    comment.setUpdatedAt(LocalDateTime.now());

    Comment updatedComment = commentRepository.save(comment);
    return convertToDTO(updatedComment);
  }

  public void deleteComment(Long commentId, Long userId) {
    Comment comment = commentRepository.findById(commentId)
        .orElseThrow(() -> new RuntimeException("Comment not found"));

    if (!comment.getUser().getUserId().equals(userId)) {
      throw new RuntimeException("User not authorized to delete this comment");
    }

    commentRepository.delete(comment);
  }

  private CommentDTO convertToDTO(Comment comment) {
    CommentDTO dto = new CommentDTO();
    dto.setCommentId(comment.getCommentId());
    dto.setPostId(comment.getPost().getPostId());
    dto.setUserId(comment.getUser().getUserId());
    dto.setCommentText(comment.getCommentText());
    dto.setCommentedUserName(comment.getUser().getUserName());
    dto.setCreatedAt(comment.getCreatedAt());
    dto.setUpdatedAt(comment.getUpdatedAt());
    return dto;
  }
}
