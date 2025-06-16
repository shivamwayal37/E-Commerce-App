package com.ecommerce.common.kafka.encryption;

import com.ecommerce.common.kafka.event.KafkaEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.util.Base64;

@Component
@Slf4j
@RequiredArgsConstructor
public class MessageEncryptor {
    private static final String ALGORITHM = "AES";
    private static final String TRANSFORMATION = "AES/ECB/PKCS5Padding";
    private final String secretKey = "your-32-byte-secret-key"; // In production, use secure key management

    public String encrypt(KafkaEvent event) {
        try {
            Key key = new SecretKeySpec(secretKey.getBytes(), ALGORITHM);
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            cipher.init(Cipher.ENCRYPT_MODE, key);
            
            String json = new JsonSerializer().serialize(event);
            byte[] encrypted = cipher.doFinal(json.getBytes());
            
            return Base64.getEncoder().encodeToString(encrypted);
        } catch (Exception e) {
            log.error("Error encrypting message", e);
            throw new RuntimeException("Failed to encrypt message", e);
        }
    }

    public KafkaEvent decrypt(String encryptedMessage) {
        try {
            Key key = new SecretKeySpec(secretKey.getBytes(), ALGORITHM);
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            cipher.init(Cipher.DECRYPT_MODE, key);
            
            byte[] decoded = Base64.getDecoder().decode(encryptedMessage);
            byte[] decrypted = cipher.doFinal(decoded);
            
            return new JsonSerializer().deserialize(new String(decrypted));
        } catch (Exception e) {
            log.error("Error decrypting message", e);
            throw new RuntimeException("Failed to decrypt message", e);
        }
    }

    @Component
    public static class JsonSerializer {
        public String serialize(Object obj) {
            // Implement JSON serialization
            return "{" + obj.toString() + "}";
        }

        public <T> T deserialize(String json) {
            // Implement JSON deserialization
            return (T) json;
        }
    }
}
