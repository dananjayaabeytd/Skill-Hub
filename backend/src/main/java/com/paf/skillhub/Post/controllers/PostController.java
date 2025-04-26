package com.paf.skillhub.Post.controllers;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.paf.skillhub.Post.dto.PostDTO;
import com.paf.skillhub.Post.dto.PostResponseDTO;
import com.paf.skillhub.Post.models.Post;
import com.paf.skillhub.Post.models.PostLike;
import com.paf.skillhub.Post.models.PostMedia;
import com.paf.skillhub.Post.services.PostService;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.ArrayList;
import java.util.Arrays;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/posts")
public class PostController {

  @Autowired
  private PostService postService;

  @PostMapping("/addPost")
  public ResponseEntity<Post> addPost(
      @RequestParam("postData") String postDataString,
      @RequestParam(value = "image", required = false) MultipartFile[] images,
      @RequestParam(value = "video", required = false) MultipartFile[] videos) throws IOException, GeneralSecurityException {

    // Convert JSON string to PostDTO object
    ObjectMapper objectMapper = new ObjectMapper();
    PostDTO postDTO = objectMapper.readValue(postDataString, PostDTO.class);

    List<MultipartFile> files = new ArrayList<>();
    if (images != null) {
      files.addAll(Arrays.asList(images));
    }
    if (videos != null) {
      files.addAll(Arrays.asList(videos));
    }

    if (files.size() > 3) {
      return ResponseEntity.badRequest().body(null);
    }

    return ResponseEntity.ok(postService.addPost(postDTO, files));
  }

  // Get posts by user
  @GetMapping("/user/{userId}")
  public ResponseEntity<List<PostResponseDTO>> getPostsByUser(@PathVariable Long userId) {
    return ResponseEntity.ok(postService.getPostsByUser(userId));
  }

  // Get posts by skill
  @GetMapping("/skill/{skillId}")
  public ResponseEntity<List<Post>> getPostsBySkill(@PathVariable Long skillId) {
    return ResponseEntity.ok(postService.getPostsBySkill(skillId));
  }

  @PutMapping("/update/{postId}")
  public ResponseEntity<PostResponseDTO> updatePostById(@PathVariable Long postId,
      @RequestBody PostDTO postDTO) {
    Post updatedPost = postService.updatePostById(postId, postDTO);
    return ResponseEntity.ok(postService.mapToPostResponseDTO(updatedPost));
  }

  // Delete a post
  @DeleteMapping("/{postId}")
  public ResponseEntity<Void> deletePost(@PathVariable Long postId) {
    postService.deletePost(postId);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/{postId}/like")
  public ResponseEntity<PostLike> addLikeToPost(@PathVariable Long postId,
      @RequestParam Long userId) {
    return ResponseEntity.ok(postService.addLikeToPost(postId, userId));
  }

  @GetMapping("/{postId}")
  public ResponseEntity<PostResponseDTO> getPostById(
      @PathVariable Long postId) {
        return ResponseEntity.ok(postService.getPostById(postId));
  }
}

