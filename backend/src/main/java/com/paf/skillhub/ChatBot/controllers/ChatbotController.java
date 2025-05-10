package com.paf.skillhub.ChatBot.controllers;

import com.paf.skillhub.ChatBot.dto.ChatRequest;
import com.paf.skillhub.ChatBot.dto.ChatResponse;
import com.paf.skillhub.utils.Gemini.GeminiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

  private final GeminiService geminiService;

  public ChatbotController(GeminiService geminiService) {
    this.geminiService = geminiService;
  }

  @PostMapping("/query")
  public ResponseEntity<ChatResponse> processQuery(@RequestBody ChatRequest request) {
    String response = geminiService.processUserQuery(request.getQuery());
    return ResponseEntity.ok(new ChatResponse(response));
  }
}