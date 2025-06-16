package com.ecommerce.auth.repository;

import com.ecommerce.auth.entity.BiometricData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface BiometricDataRepository extends JpaRepository<BiometricData, String> {
    Optional<BiometricData> findByUserId(String userId);
    boolean existsByUserId(String userId);
}
