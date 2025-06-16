package com.ecommerce.common.kafka.validator;

import com.ecommerce.common.kafka.event.KafkaEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.validation.Validator;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
@RequiredArgsConstructor
public class KafkaMessageValidator implements Validator {

    private final Map<Class<? extends KafkaEvent>, EventValidator<?>> validators = new HashMap<>();

    @Override
    public boolean supports(Class<?> clazz) {
        return KafkaEvent.class.isAssignableFrom(clazz);
    }

    @Override
    public void validate(Object target, org.springframework.validation.Errors errors) {
        KafkaEvent event = (KafkaEvent) target;
        
        // Common validations
        if (event.getEventId() == null || event.getEventId().isEmpty()) {
            errors.rejectValue("eventId", "required", "Event ID is required");
        }
        
        if (event.getTimestamp() == null) {
            errors.rejectValue("timestamp", "required", "Timestamp is required");
        }
        
        if (event.getEventType() == null || event.getEventType().isEmpty()) {
            errors.rejectValue("eventType", "required", "Event type is required");
        }
        
        // Specific validations based on event type
        EventValidator<?> validator = validators.get(event.getClass());
        if (validator != null) {
            validator.validate(event, errors);
        }
    }

    public void registerValidator(Class<? extends KafkaEvent> eventType, EventValidator<?> validator) {
        validators.put(eventType, validator);
    }

    public interface EventValidator<T extends KafkaEvent> {
        void validate(T event, org.springframework.validation.Errors errors);
    }
}
