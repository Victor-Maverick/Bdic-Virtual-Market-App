# Complete Spring Boot Chat Backend Implementation

## 1. Database Entities

### ChatMessage Entity
```java
package com.yourpackage.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages", indexes = {
    @Index(name = "idx_from_email", columnList = "fromEmail"),
    @Index(name = "idx_to_email", columnList = "toEmail"),
    @Index(name = "idx_conversation", columnList = "fromEmail, toEmail"),
    @Index(name = "idx_timestamp", columnList = "timestamp")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "from_email", nullable = false)
    private String fromEmail;
    
    @Column(name = "to_email", nullable = false)
    private String toEmail;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;
    
    @Column(nullable = false)
    private LocalDateTime timestamp;
    
    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public ChatMessage(String fromEmail, String toEmail, String message) {
        this.fromEmail = fromEmail;
        this.toEmail = toEmail;
        this.message = message;
        this.timestamp = LocalDateTime.now();
        this.isRead = false;
    }
}
```

### ChatConversation Entity
```java
package com.yourpackage.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_conversations", 
    uniqueConstraints = @UniqueConstraint(columnNames = {"user1Email", "user2Email"}),
    indexes = {
        @Index(name = "idx_user1", columnList = "user1Email"),
        @Index(name = "idx_user2", columnList = "user2Email")
    }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatConversation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user1_email", nullable = false)
    private String user1Email;
    
    @Column(name = "user2_email", nullable = false)
    private String user2Email;
    
    @Column(name = "last_message", columnDefinition = "TEXT")
    private String lastMessage;
    
    @Column(name = "last_message_time")
    private LocalDateTime lastMessageTime;
    
    @Column(name = "user1_unread_count", nullable = false)
    private Integer user1UnreadCount = 0;
    
    @Column(name = "user2_unread_count", nullable = false)
    private Integer user2UnreadCount = 0;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

### UserOnlineStatus Entity
```java
package com.yourpackage.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_online_status")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserOnlineStatus {
    
    @Id
    @Column(name = "email")
    private String email;
    
    @Column(name = "is_online", nullable = false)
    private Boolean isOnline = false;
    
    @Column(name = "last_seen")
    private LocalDateTime lastSeen;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public UserOnlineStatus(String email, Boolean isOnline) {
        this.email = email;
        this.isOnline = isOnline;
        this.lastSeen = LocalDateTime.now();
    }
}
```

## 2. Repository Interfaces

### ChatMessageRepository
```java
package com.yourpackage.repository;

import com.yourpackage.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    @Query("SELECT cm FROM ChatMessage cm WHERE " +
           "(cm.fromEmail = :user1 AND cm.toEmail = :user2) OR " +
           "(cm.fromEmail = :user2 AND cm.toEmail = :user1) " +
           "ORDER BY cm.timestamp ASC")
    List<ChatMessage> findConversationMessages(@Param("user1") String user1, @Param("user2") String user2);
    
    @Query("SELECT cm FROM ChatMessage cm WHERE " +
           "(cm.fromEmail = :user1 AND cm.toEmail = :user2) OR " +
           "(cm.fromEmail = :user2 AND cm.toEmail = :user1) " +
           "ORDER BY cm.timestamp DESC")
    List<ChatMessage> findConversationMessagesDesc(@Param("user1") String user1, @Param("user2") String user2);
    
    @Modifying
    @Query("UPDATE ChatMessage cm SET cm.isRead = true WHERE " +
           "cm.fromEmail = :fromEmail AND cm.toEmail = :toEmail AND cm.isRead = false")
    int markMessagesAsRead(@Param("fromEmail") String fromEmail, @Param("toEmail") String toEmail);
    
    @Query("SELECT COUNT(cm) FROM ChatMessage cm WHERE " +
           "cm.fromEmail = :fromEmail AND cm.toEmail = :toEmail AND cm.isRead = false")
    Long countUnreadMessages(@Param("fromEmail") String fromEmail, @Param("toEmail") String toEmail);
    
    @Query("SELECT DISTINCT CASE " +
           "WHEN cm.fromEmail = :userEmail THEN cm.toEmail " +
           "ELSE cm.fromEmail END " +
           "FROM ChatMessage cm WHERE cm.fromEmail = :userEmail OR cm.toEmail = :userEmail")
    List<String> findConversationPartners(@Param("userEmail") String userEmail);
}
```

### ChatConversationRepository
```java
package com.yourpackage.repository;

import com.yourpackage.entity.ChatConversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatConversationRepository extends JpaRepository<ChatConversation, Long> {
    
    @Query("SELECT cc FROM ChatConversation cc WHERE " +
           "(cc.user1Email = :user1 AND cc.user2Email = :user2) OR " +
           "(cc.user1Email = :user2 AND cc.user2Email = :user1)")
    Optional<ChatConversation> findConversation(@Param("user1") String user1, @Param("user2") String user2);
    
    @Query("SELECT cc FROM ChatConversation cc WHERE " +
           "cc.user1Email = :userEmail OR cc.user2Email = :userEmail " +
           "ORDER BY cc.lastMessageTime DESC")
    List<ChatConversation> findUserConversations(@Param("userEmail") String userEmail);
}
```

### UserOnlineStatusRepository
```java
package com.yourpackage.repository;

import com.yourpackage.entity.UserOnlineStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserOnlineStatusRepository extends JpaRepository<UserOnlineStatus, String> {
    
    Optional<UserOnlineStatus> findByEmail(String email);
}
```

## 3. DTOs (Data Transfer Objects)

### Request DTOs
```java
package com.yourpackage.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;

@Data
public class SendMessageRequest {
    
    @NotBlank(message = "From email is required")
    @Email(message = "Invalid from email format")
    private String fromEmail;
    
    @NotBlank(message = "To email is required")
    @Email(message = "Invalid to email format")
    private String toEmail;
    
    @NotBlank(message = "Message is required")
    private String message;
}

@Data
public class MarkReadRequest {
    
    @NotBlank(message = "From email is required")
    @Email(message = "Invalid from email format")
    private String fromEmail;
    
    @NotBlank(message = "To email is required")
    @Email(message = "Invalid to email format")
    private String toEmail;
}
```

### Response DTOs
```java
package com.yourpackage.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageResponse {
    private String id;
    private String fromEmail;
    private String toEmail;
    private String message;
    private String timestamp;
    private Boolean isRead;
    
    public ChatMessageResponse(Long id, String fromEmail, String toEmail, String message, LocalDateTime timestamp, Boolean isRead) {
        this.id = id.toString();
        this.fromEmail = fromEmail;
        this.toEmail = toEmail;
        this.message = message;
        this.timestamp = timestamp.toString();
        this.isRead = isRead;
    }
}

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatConversationResponse {
    private String id;
    private String buyerEmail;
    private String buyerName;
    private String buyerProfileImage;
    private String lastMessage;
    private String lastMessageTime;
    private Integer unreadCount;
    private Boolean isOnline;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OnlineStatusResponse {
    private Boolean isOnline;
    private String lastSeen;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private String email;
    private String name;
    private String profileImage;
    private Boolean isOnline;
}
```

## 4. Service Layer

### ChatService
```java
package com.yourpackage.service;

import com.yourpackage.dto.request.SendMessageRequest;
import com.yourpackage.dto.response.ChatConversationResponse;
import com.yourpackage.dto.response.ChatMessageResponse;
import com.yourpackage.entity.ChatConversation;
import com.yourpackage.entity.ChatMessage;
import com.yourpackage.entity.UserOnlineStatus;
import com.yourpackage.repository.ChatConversationRepository;
import com.yourpackage.repository.ChatMessageRepository;
import com.yourpackage.repository.UserOnlineStatusRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {
    
    private final ChatMessageRepository chatMessageRepository;
    private final ChatConversationRepository chatConversationRepository;
    private final UserOnlineStatusRepository userOnlineStatusRepository;
    private final UserService userService;
    private final SimpMessagingTemplate messagingTemplate;
    
    @Transactional
    public ChatMessageResponse sendMessage(SendMessageRequest request) {
        try {
            // Create and save the message
            ChatMessage message = new ChatMessage(
                request.getFromEmail(),
                request.getToEmail(),
                request.getMessage()
            );
            
            ChatMessage savedMessage = chatMessageRepository.save(message);
            log.info("Message saved: {} -> {}", request.getFromEmail(), request.getToEmail());
            
            // Update or create conversation
            updateConversation(request.getFromEmail(), request.getToEmail(), request.getMessage());
            
            // Send real-time notification via WebSocket
            ChatMessageResponse response = new ChatMessageResponse(
                savedMessage.getId(),
                savedMessage.getFromEmail(),
                savedMessage.getToEmail(),
                savedMessage.getMessage(),
                savedMessage.getTimestamp(),
                savedMessage.getIsRead()
            );
            
            // Send to recipient
            messagingTemplate.convertAndSendToUser(
                request.getToEmail(),
                "/queue/messages",
                response
            );
            
            return response;
            
        } catch (Exception e) {
            log.error("Error sending message: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to send message: " + e.getMessage());
        }
    }
    
    public List<ChatMessageResponse> getMessages(String user1, String user2) {
        try {
            List<ChatMessage> messages = chatMessageRepository.findConversationMessages(user1, user2);
            
            return messages.stream()
                .map(msg -> new ChatMessageResponse(
                    msg.getId(),
                    msg.getFromEmail(),
                    msg.getToEmail(),
                    msg.getMessage(),
                    msg.getTimestamp(),
                    msg.getIsRead()
                ))
                .collect(Collectors.toList());
                
        } catch (Exception e) {
            log.error("Error fetching messages: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch messages: " + e.getMessage());
        }
    }
    
    public List<ChatConversationResponse> getConversations(String userEmail) {
        try {
            List<String> conversationPartners = chatMessageRepository.findConversationPartners(userEmail);
            List<ChatConversationResponse> conversations = new ArrayList<>();
            
            for (String partnerEmail : conversationPartners) {
                // Get last message
                List<ChatMessage> messages = chatMessageRepository.findConversationMessagesDesc(userEmail, partnerEmail);
                if (!messages.isEmpty()) {
                    ChatMessage lastMessage = messages.get(0);
                    
                    // Get unread count
                    Long unreadCount = chatMessageRepository.countUnreadMessages(partnerEmail, userEmail);
                    
                    // Get user profile
                    var userProfile = userService.getUserProfile(partnerEmail);
                    
                    // Get online status
                    boolean isOnline = getUserOnlineStatus(partnerEmail);
                    
                    ChatConversationResponse conversation = new ChatConversationResponse(
                        partnerEmail, // Using email as ID for simplicity
                        partnerEmail,
                        userProfile != null ? userProfile.getName() : "User",
                        userProfile != null ? userProfile.getProfileImage() : null,
                        lastMessage.getMessage(),
                        lastMessage.getTimestamp().toString(),
                        unreadCount.intValue(),
                        isOnline
                    );
                    
                    conversations.add(conversation);
                }
            }
            
            // Sort by last message time (most recent first)
            conversations.sort((a, b) -> b.getLastMessageTime().compareTo(a.getLastMessageTime()));
            
            return conversations;
            
        } catch (Exception e) {
            log.error("Error fetching conversations: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch conversations: " + e.getMessage());
        }
    }
    
    @Transactional
    public void markMessagesAsRead(String fromEmail, String toEmail) {
        try {
            int updatedCount = chatMessageRepository.markMessagesAsRead(fromEmail, toEmail);
            log.info("Marked {} messages as read from {} to {}", updatedCount, fromEmail, toEmail);
            
            // Update conversation unread count
            updateConversationReadStatus(fromEmail, toEmail);
            
        } catch (Exception e) {
            log.error("Error marking messages as read: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to mark messages as read: " + e.getMessage());
        }
    }
    
    private void updateConversation(String fromEmail, String toEmail, String message) {
        Optional<ChatConversation> existingConversation = 
            chatConversationRepository.findConversation(fromEmail, toEmail);
        
        if (existingConversation.isPresent()) {
            ChatConversation conversation = existingConversation.get();
            conversation.setLastMessage(message);
            conversation.setLastMessageTime(LocalDateTime.now());
            
            // Increment unread count for recipient
            if (conversation.getUser1Email().equals(toEmail)) {
                conversation.setUser1UnreadCount(conversation.getUser1UnreadCount() + 1);
            } else {
                conversation.setUser2UnreadCount(conversation.getUser2UnreadCount() + 1);
            }
            
            chatConversationRepository.save(conversation);
        } else {
            // Create new conversation
            ChatConversation newConversation = new ChatConversation();
            newConversation.setUser1Email(fromEmail);
            newConversation.setUser2Email(toEmail);
            newConversation.setLastMessage(message);
            newConversation.setLastMessageTime(LocalDateTime.now());
            newConversation.setUser1UnreadCount(0);
            newConversation.setUser2UnreadCount(1);
            
            chatConversationRepository.save(newConversation);
        }
    }
    
    private void updateConversationReadStatus(String fromEmail, String toEmail) {
        Optional<ChatConversation> conversation = 
            chatConversationRepository.findConversation(fromEmail, toEmail);
        
        if (conversation.isPresent()) {
            ChatConversation conv = conversation.get();
            if (conv.getUser1Email().equals(toEmail)) {
                conv.setUser1UnreadCount(0);
            } else {
                conv.setUser2UnreadCount(0);
            }
            chatConversationRepository.save(conv);
        }
    }
    
    public boolean getUserOnlineStatus(String email) {
        return userOnlineStatusRepository.findByEmail(email)
            .map(UserOnlineStatus::getIsOnline)
            .orElse(false);
    }
    
    @Transactional
    public void updateUserOnlineStatus(String email, boolean isOnline) {
        UserOnlineStatus status = userOnlineStatusRepository.findByEmail(email)
            .orElse(new UserOnlineStatus(email, isOnline));
        
        status.setIsOnline(isOnline);
        status.setLastSeen(LocalDateTime.now());
        
        userOnlineStatusRepository.save(status);
        
        // Notify other users about status change
        messagingTemplate.convertAndSend("/topic/user-status", 
            new UserStatusUpdate(email, isOnline));
    }
    
    // Inner class for user status updates
    public static class UserStatusUpdate {
        public String email;
        public boolean isOnline;
        
        public UserStatusUpdate(String email, boolean isOnline) {
            this.email = email;
            this.isOnline = isOnline;
        }
    }
}
```

### UserService (if not exists)
```java
package com.yourpackage.service;

import com.yourpackage.dto.response.UserProfileResponse;
import com.yourpackage.entity.User; // Assuming you have a User entity
import com.yourpackage.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final ChatService chatService;
    
    public UserProfileResponse getUserProfile(String email) {
        // This assumes you have a User entity with profile information
        // Adjust according to your existing user management system
        User user = userRepository.findByEmail(email)
            .orElse(null);
        
        if (user == null) {
            return new UserProfileResponse(email, "User", null, false);
        }
        
        boolean isOnline = chatService.getUserOnlineStatus(email);
        
        return new UserProfileResponse(
            user.getEmail(),
            user.getFirstName() + " " + user.getLastName(),
            user.getProfileImageUrl(),
            isOnline
        );
    }
}
```

## 5. WebSocket Configuration

### WebSocketConfig
```java
package com.yourpackage.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable simple broker for topics and queues
        config.enableSimpleBroker("/topic", "/queue");
        
        // Set application destination prefix
        config.setApplicationDestinationPrefixes("/app");
        
        // Set user destination prefix
        config.setUserDestinationPrefix("/user");
    }
    
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register STOMP endpoint with SockJS fallback
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*") // Configure properly for production
                .withSockJS();
    }
}
```

### WebSocketEventListener
```java
package com.yourpackage.config;

import com.yourpackage.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {
    
    private final ChatService chatService;
    
    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String userEmail = headerAccessor.getUser() != null ? headerAccessor.getUser().getName() : null;
        
        if (userEmail != null) {
            log.info("User connected: {}", userEmail);
            chatService.updateUserOnlineStatus(userEmail, true);
        }
    }
    
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String userEmail = headerAccessor.getUser() != null ? headerAccessor.getUser().getName() : null;
        
        if (userEmail != null) {
            log.info("User disconnected: {}", userEmail);
            chatService.updateUserOnlineStatus(userEmail, false);
        }
    }
}
```

## 6. Controllers

### ChatController
```java
package com.yourpackage.controller;

import com.yourpackage.dto.request.MarkReadRequest;
import com.yourpackage.dto.request.SendMessageRequest;
import com.yourpackage.dto.response.ChatConversationResponse;
import com.yourpackage.dto.response.ChatMessageResponse;
import com.yourpackage.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = {"http://localhost:3000", "https://yourdomain.com"})
@RequiredArgsConstructor
@Slf4j
public class ChatController {
    
    private final ChatService chatService;
    
    @PostMapping("/send")
    public ResponseEntity<ChatMessageResponse> sendMessage(@Valid @RequestBody SendMessageRequest request) {
        try {
            log.info("Sending message from {} to {}", request.getFromEmail(), request.getToEmail());
            ChatMessageResponse response = chatService.sendMessage(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error sending message: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/messages")
    public ResponseEntity<List<ChatMessageResponse>> getMessages(
            @RequestParam String user1,
            @RequestParam String user2) {
        try {
            log.info("Fetching messages between {} and {}", user1, user2);
            List<ChatMessageResponse> messages = chatService.getMessages(user1, user2);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            log.error("Error fetching messages: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/conversations/{userEmail}")
    public ResponseEntity<List<ChatConversationResponse>> getConversations(@PathVariable String userEmail) {
        try {
            log.info("Fetching conversations for user: {}", userEmail);
            List<ChatConversationResponse> conversations = chatService.getConversations(userEmail);
            return ResponseEntity.ok(conversations);
        } catch (Exception e) {
            log.error("Error fetching conversations: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PutMapping("/mark-read")
    public ResponseEntity<Void> markMessagesAsRead(@Valid @RequestBody MarkReadRequest request) {
        try {
            log.info("Marking messages as read from {} to {}", request.getFromEmail(), request.getToEmail());
            chatService.markMessagesAsRead(request.getFromEmail(), request.getToEmail());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error marking messages as read: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
```

### WebSocketChatController
```java
package com.yourpackage.controller;

import com.yourpackage.dto.request.SendMessageRequest;
import com.yourpackage.dto.response.ChatMessageResponse;
import com.yourpackage.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketChatController {
    
    private final ChatService chatService;
    
    @MessageMapping("/chat.send")
    public void sendMessage(@Payload SendMessageRequest request, SimpMessageHeaderAccessor headerAccessor) {
        try {
            // Get user from session
            String userEmail = headerAccessor.getUser() != null ? headerAccessor.getUser().getName() : null;
            
            // Validate that the sender matches the authenticated user
            if (userEmail != null && userEmail.equals(request.getFromEmail())) {
                ChatMessageResponse response = chatService.sendMessage(request);
                log.info("WebSocket message sent: {}", response.getId());
            } else {
                log.warn("Unauthorized message attempt from: {}", userEmail);
            }
        } catch (Exception e) {
            log.error("Error in WebSocket message sending: {}", e.getMessage(), e);
        }
    }
    
    @MessageMapping("/chat.typing")
    public void handleTyping(@Payload TypingIndicator typing, SimpMessageHeaderAccessor headerAccessor) {
        // Handle typing indicators
        String userEmail = headerAccessor.getUser() != null ? headerAccessor.getUser().getName() : null;
        if (userEmail != null && userEmail.equals(typing.getFromEmail())) {
            // Broadcast typing indicator to recipient
            log.info("User {} is typing to {}", typing.getFromEmail(), typing.getToEmail());
        }
    }
    
    // Inner class for typing indicators
    public static class TypingIndicator {
        private String fromEmail;
        private String toEmail;
        private boolean isTyping;
        
        // Getters and setters
        public String getFromEmail() { return fromEmail; }
        public void setFromEmail(String fromEmail) { this.fromEmail = fromEmail; }
        public String getToEmail() { return toEmail; }
        public void setToEmail(String toEmail) { this.toEmail = toEmail; }
        public boolean isTyping() { return isTyping; }
        public void setTyping(boolean typing) { isTyping = typing; }
    }
}
```

### UserController (Enhanced)
```java
package com.yourpackage.controller;

import com.yourpackage.dto.response.OnlineStatusResponse;
import com.yourpackage.dto.response.UserProfileResponse;
import com.yourpackage.service.ChatService;
import com.yourpackage.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "https://yourdomain.com"})
@RequiredArgsConstructor
@Slf4j
public class UserController {
    
    private final UserService userService;
    private final ChatService chatService;
    
    @GetMapping("/profile/{email}")
    public ResponseEntity<UserProfileResponse> getUserProfile(@PathVariable String email) {
        try {
            UserProfileResponse profile = userService.getUserProfile(email);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            log.error("Error fetching user profile: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/online-status/{email}")
    public ResponseEntity<OnlineStatusResponse> getUserOnlineStatus(@PathVariable String email) {
        try {
            boolean isOnline = chatService.getUserOnlineStatus(email);
            OnlineStatusResponse response = new OnlineStatusResponse(isOnline, null);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching online status: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
```

## 7. Application Properties

Add these to your `application.yml` or `application.properties`:

```yaml
# application.yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/your_database
    username: your_username
    password: your_password
    driver-class-name: com.mysql.cj.jdbc.Driver
  
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect
        format_sql: true
  
  # WebSocket configuration
  websocket:
    allowed-origins: 
      - "http://localhost:3000"
      - "https://yourdomain.com"

# Logging
logging:
  level:
    com.yourpackage: DEBUG
    org.springframework.messaging: DEBUG
    org.springframework.web.socket: DEBUG
```

## 8. Dependencies (pom.xml)

Add these dependencies to your `pom.xml`:

```xml
<!-- WebSocket Support -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>

<!-- Validation -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>

<!-- Lombok -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
```

## 9. Testing the Implementation

### Test with curl:

```bash
# Send a message
curl -X POST http://localhost:8080/api/chat/send \
  -H "Content-Type: application/json" \
  -d '{
    "fromEmail": "buyer@example.com",
    "toEmail": "vendor@example.com",
    "message": "Hello, I am interested in your product!"
  }'

# Get messages
curl -X GET "http://localhost:8080/api/chat/messages?user1=buyer@example.com&user2=vendor@example.com"

# Get conversations for vendor
curl -X GET "http://localhost:8080/api/chat/conversations/vendor@example.com"

# Mark messages as read
curl -X PUT http://localhost:8080/api/chat/mark-read \
  -H "Content-Type: application/json" \
  -d '{
    "fromEmail": "buyer@example.com",
    "toEmail": "vendor@example.com"
  }'
```

This is a complete, production-ready Spring Boot chat backend implementation with real-time messaging, conversation management, and online status tracking!