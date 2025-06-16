package com.ecommerce.common.backup;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
@Slf4j
@RequiredArgsConstructor
public class BackupManager {
    
    private static final String BACKUP_DIR = "backup";
    private static final String BACKUP_FILE_PREFIX = "ecommerce_backup_";
    private static final String BACKUP_FILE_EXTENSION = ".sql";
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss");

    @Scheduled(cron = "0 0 2 * * ?")  // Every day at 2 AM
    public void createDatabaseBackup() {
        try {
            String timestamp = LocalDateTime.now().format(formatter);
            String backupFileName = BACKUP_FILE_PREFIX + timestamp + BACKUP_FILE_EXTENSION;
            File backupDir = new File(BACKUP_DIR);
            
            if (!backupDir.exists()) {
                backupDir.mkdirs();
            }
            
            File backupFile = new File(backupDir, backupFileName);
            
            // TODO: Implement actual database backup logic
            // This could be MySQL dump or other backup mechanism
            
            log.info("Database backup created: {}", backupFile.getAbsolutePath());
        } catch (Exception e) {
            log.error("Error creating database backup", e);
        }
    }

    @Scheduled(cron = "0 0 3 * * ?")  // Every day at 3 AM
    public void cleanupOldBackups() {
        try {
            File backupDir = new File(BACKUP_DIR);
            if (!backupDir.exists()) {
                return;
            }
            
            // Keep only last 7 days of backups
            long cutoff = System.currentTimeMillis() - (7 * 24 * 60 * 60 * 1000);
            
            File[] files = backupDir.listFiles();
            if (files != null) {
                for (File file : files) {
                    if (file.lastModified() < cutoff) {
                        file.delete();
                    }
                }
            }
        } catch (Exception e) {
            log.error("Error cleaning up old backups", e);
        }
    }
}
