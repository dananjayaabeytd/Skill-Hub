package com.paf.skillhub.Follow.repositories;


import com.paf.skillhub.Follow.models.Follower;
import com.paf.skillhub.User.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowerRepository extends JpaRepository<Follower, Long> {

  Optional<Follower> findByUserAndFollowerUser(User user, User followerUser);

  long countByUser(User user);

  List<Follower> findByUser(User user);

  List<Follower> findByFollowerUser(User followerUser);

  @Query("SELECT COUNT(f) > 0 FROM Follower f WHERE f.user.userId = :userId AND f.followerUser.userId = :followerUserId")
  boolean existsByUserIdAndFollowerUserId(Long userId, Long followerUserId);

  long countByFollowerUser(User followerUser);

  // Delete all followers where the follower_user_id matches the given user ID
  void deleteByFollowerUser_UserId(Long followerUserId);

  // Delete all followers where the user_id matches the given user ID
  void deleteByUser_UserId(Long userId);
}