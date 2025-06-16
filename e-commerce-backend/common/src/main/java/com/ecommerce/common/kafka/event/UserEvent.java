package com.ecommerce.common.kafka.event;

import lombok.Data;
import java.util.Set;

@Data
public class UserEvent extends KafkaEvent {
    private String userId;
    private String email;
    private String firstName;
    private String lastName;
    private Set<String> roles;
    private boolean active;
    
    public enum EventType {
        USER_CREATED,
        USER_UPDATED,
        USER_DELETED,
        USER_ROLE_UPDATED,
        USER_STATUS_CHANGED
    }
}
