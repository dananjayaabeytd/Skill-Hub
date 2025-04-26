package com.paf.skillhub.Post.repositories;


import com.paf.skillhub.Post.models.Post;
import com.paf.skillhub.Skill.models.Skill;
import com.paf.skillhub.User.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {

  List<Post> findByUser(User user);

  List<Post> findBySkill(Skill skill);

  Optional<Post> findByPostIdAndUser(Long postId, User user);

  Post getPostByPostId(Long postId);

  List<Post> findByUserUserId(Long userId);
}