package com.paf.skillhub.Post.repositories;


import com.paf.skillhub.Post.models.Post;
import com.paf.skillhub.Post.models.PostMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PostMediaRepository extends JpaRepository<PostMedia, Long> {

  List<PostMedia> findByPost(Post post);
}
