package com.paf.skillhub.Post.repositories;


import com.paf.skillhub.Post.models.Comment;
import com.paf.skillhub.Post.models.Post;
import com.paf.skillhub.User.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Long> {

  List<Comment> findCommentsByPost(Post post);

  Optional<Comment> findByCommentIdAndUser(Long commentId, User user);

  void deleteByPostAndUser(Post post, User user);  // Delete comment by post owner
  void deleteByCommentIdAndUser(Long commentId, User user);

  // Add this new method
  List<Comment> findByPostPostId(Long postId);
}

