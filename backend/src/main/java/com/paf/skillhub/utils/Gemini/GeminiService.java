package com.paf.skillhub.utils.Gemini;

import com.paf.skillhub.Skill.models.Skill;
import com.paf.skillhub.Skill.repositories.SkillRepository;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class GeminiService {

  @Value("${gemini.api.key}")
  private String geminiApiKey;

  @Value("${gemini.api.url}")
  private String geminiApiUrl;

  private String contextData;

  @Autowired
  private SkillRepository skillRepository;

  @Autowired
  private EntityManager entityManager;

  private final RestTemplate restTemplate;

  public GeminiService(RestTemplate restTemplate) {
    this.restTemplate = restTemplate;
  }

  @PostConstruct
  public void initializeContext() {
    updateContext();
  }

  public String processUserQuery(String userQuery) {
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);

    Map<String, Object> requestBody = new HashMap<>();
    requestBody.put("contents", createContentsObject(userQuery));

    HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

    // Call Gemini API and return response
    try {
      Map<String, Object> response = restTemplate.postForObject(
          geminiApiUrl + "?key=" + geminiApiKey,
          request,
          Map.class
      );

      return extractResponseText(response);
    } catch (Exception e) {
      e.printStackTrace();
      return "Sorry, I couldn't process your request.";
    }
  }

  private Object createContentsObject(String userQuery) {
    Map<String, Object> userMessage = new HashMap<>();
    userMessage.put("role", "user");

    Map<String, String> part = new HashMap<>();
    part.put("text", "Context about the skill database: " +
        (contextData != null ? contextData : "No context available yet") +
        "\n\nUser question: " + userQuery);

    userMessage.put("parts", List.of(part));

    return List.of(userMessage);
  }

  private String extractResponseText(Map<String, Object> response) {
    try {
      if (response == null) {
        return "No response received";
      }

      // Navigate through the response structure to extract text
      // Structure for Gemini 2.0 response format
      @SuppressWarnings("unchecked")
      List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");

      if (candidates != null && !candidates.isEmpty()) {
        Map<String, Object> firstCandidate = candidates.get(0);

        @SuppressWarnings("unchecked")
        Map<String, Object> content = (Map<String, Object>) firstCandidate.get("content");

        if (content != null) {
          @SuppressWarnings("unchecked")
          List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");

          if (parts != null && !parts.isEmpty()) {
            return (String) parts.get(0).get("text");
          }
        }
      }

      return "No answer generated";
    } catch (Exception e) {
      e.printStackTrace();
      return "Error parsing response: " + e.getMessage();
    }
  }

  @Scheduled(cron = "0 0 0 ? * MON") // Run at midnight every Monday
  public void updateContext() {
    // Query your database to fetch the latest data for context
    contextData = fetchDataFromDatabase();
  }

  private String fetchDataFromDatabase() {
    StringBuilder contextBuilder = new StringBuilder();

    try {
      // Basic skills count
      long skillCount = skillRepository.count();
      contextBuilder.append("=== SKILLS DATABASE SUMMARY ===\n\n");
      contextBuilder.append("Total skills in database: ").append(skillCount).append("\n\n");

      // Use ONLY the native query for popular skills to avoid LazyInitializationException
      contextBuilder.append("MOST POPULAR SKILLS:\n");
      List<Object[]> topSkillsData = skillRepository.findMostPopularSkillsNative(5);
      if (topSkillsData != null && !topSkillsData.isEmpty()) {
        int rank = 1;
        for (Object[] skillData : topSkillsData) {
          String skillName = (String) skillData[1];
          Long userCount = ((Number) skillData[2]).longValue(); // Handle potential type differences
          contextBuilder.append(rank++).append(". ")
              .append(skillName)
              .append(" (").append(userCount).append(" users)\n");
        }
      } else {
        contextBuilder.append("No skills with users found.\n");
      }
      contextBuilder.append("\n");

      // Skill details without accessing users collection
      contextBuilder.append("SKILL DETAILS:\n");
      List<Skill> allSkills = skillRepository.findAll();
      for (Skill skill : allSkills) {
        String desc = skill.getDescription();
        contextBuilder.append("- ").append(skill.getSkillName()).append(": ")
            .append(desc != null && !desc.isEmpty() ?
                desc.substring(0, Math.min(50, desc.length())) + (desc.length() > 50 ? "..." : "") :
                "No description")
            .append("\n");
      }
      contextBuilder.append("\n");

      // Add user information using a safe query
      contextBuilder.append("USER INFORMATION:\n");
      contextBuilder.append("Due to security and privacy concerns, individual user details cannot be provided directly.\n");
      contextBuilder.append("To get information about specific users, please use the appropriate API endpoints with proper authentication.\n");
      contextBuilder.append("The system contains user information including username, email, and their associated skills.\n\n");

      // Add table structure information
      contextBuilder.append("DATABASE REFERENCE:\n");
      contextBuilder.append("The 'users' table has these columns: user_id (PK), username, email, password (hashed), etc.\n");
      contextBuilder.append("The 'skill' table has these columns: skill_id (PK), skill_name, description\n");
      contextBuilder.append("Skills and Users are linked through a user_skills join table with columns: user_id, skill_id\n");
      contextBuilder.append("The system also tracks followers and followed relationships between users.\n");

      // Add available operations hint
      contextBuilder.append("\nAVAILABLE OPERATIONS:\n");
      contextBuilder.append("- Query skills by name, description, or popularity\n");
      contextBuilder.append("- Find users with specific skills (requires proper authentication)\n");
      contextBuilder.append("- Get statistics about skill usage and distribution\n");
      contextBuilder.append("- Find skills for a specific user (requires user identification)\n");

    } catch (Exception e) {
      contextBuilder.append("Error generating statistics: ").append(e.getMessage()).append("\n");
      e.printStackTrace();
    }

    return contextBuilder.toString();
  }
}