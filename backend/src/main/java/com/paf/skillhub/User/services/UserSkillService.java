package com.paf.skillhub.User.services;

import com.paf.skillhub.Skill.DTOs.SkillDTO;
import com.paf.skillhub.Skill.models.Skill;
import com.paf.skillhub.Skill.repositories.SkillRepository;
import com.paf.skillhub.User.dtos.UserDTO;
import com.paf.skillhub.User.models.User;
import com.paf.skillhub.User.repositories.UserRepository;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserSkillService {

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private SkillRepository skillRepository;

  @Transactional
  public void addSkillsToUser(Long userId, List<Long> skillIds) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

    for (Long skillId : skillIds) {
      Skill skill = skillRepository.findById(skillId)
          .orElseThrow(() -> new RuntimeException("Skill not found with id: " + skillId));
      user.getSkills().add(skill);
    }

    userRepository.save(user);
  }

  @Transactional
  public void addSkillToUser(Long userId, Long skillId) {

      try{
          User user = userRepository.findById(userId)
              .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

          Skill skill = skillRepository.findById(skillId)
              .orElseThrow(() -> new RuntimeException("Skill not found with id: " + skillId));

          user.getSkills().add(skill);
          userRepository.save(user);
      }
      catch (Exception e){
          System.out.println(e.getMessage());
      }
  }

  @Transactional
  public void removeSkillFromUser(Long userId, Long skillId) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

    Skill skill = skillRepository.findById(skillId)
        .orElseThrow(() -> new RuntimeException("Skill not found with id: " + skillId));

    user.getSkills().remove(skill);
    userRepository.save(user);
  }

  public List<SkillDTO> getSkillsByUserId(Long userId) {
    if (!userRepository.existsById(userId)) {
      throw new RuntimeException("User not found with id: " + userId);
    }

    return skillRepository.findSkillsByUserId(userId).stream()
        .map(this::convertToSkillDto)
        .collect(Collectors.toList());
  }

  public List<UserDTO> getUsersBySkillId(Long skillId) {
    if (!skillRepository.existsById(skillId)) {
      throw new RuntimeException("Skill not found with id: " + skillId);
    }

    return userRepository.findUsersBySkillId(skillId).stream()
        .map(this::convertToUserDto)
        .collect(Collectors.toList());
  }

  private SkillDTO convertToSkillDto(Skill skill) {
    SkillDTO dto = new SkillDTO();
    dto.setSkillId(skill.getSkillId());
    dto.setSkillName(skill.getSkillName());
    dto.setDescription(skill.getDescription());
    return dto;
  }

  private UserDTO convertToUserDto(User user) {
    UserDTO dto = new UserDTO();
    dto.setUserId(user.getUserId());
    dto.setUserName(user.getUserName());
    dto.setEmail(user.getEmail());
    // Don't include password or other sensitive information
    return dto;
  }
}