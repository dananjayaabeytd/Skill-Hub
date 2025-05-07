package com.paf.skillhub.Post.repositories;


import com.paf.skillhub.Post.models.Post;
import com.paf.skillhub.Post.models.PostLike;
import com.paf.skillhub.User.models.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {

  Long countByPost(Post post);
  void deleteByPostAndUser(Post post, User user);
  Optional<PostLike> findByPostAndUser(Post post, User user);
  void deleteByPostPostId(Long postId);
}