#!/bin/bash

# Configuration
BACKUP_DIR="/path/to/backup/folder"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_USER="root"
DB_PASSWORD="root"
DB_NAME="ecommerce"
S3_BUCKET="your-s3-bucket-name"
KEEP_DAYS=30

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# MySQL Dump
mysqldump -u$DB_USER -p$DB_PASSWORD $DB_NAME > "$BACKUP_DIR/db_backup_$TIMESTAMP.sql"

# Backup important files
tar -czf "$BACKUP_DIR/app_backup_$TIMESTAMP.tar.gz" /path/to/important/files

# Upload to S3 (requires AWS CLI configured)
aws s3 cp "$BACKUP_DIR/db_backup_$TIMESTAMP.sql" "s3://$S3_BUCKET/db/"
aws s3 cp "$BACKUP_DIR/app_backup_$TIMESTAMP.tar.gz" "s3://$S3_BUCKET/app/"

# Clean up old backups (local)
find "$BACKUP_DIR" -type f -mtime +$KEEP_DAYS -delete

# Clean up old backups in S3 (optional)
# aws s3 ls "s3://$S3_BUCKET/db/" | while read -r line; do
#   createDate=$(echo $line|awk {'print $1" "$2'})
#   createDate=$(date -d"$createDate" +%s)
#   olderThan=$(date -d"$KEEP_DAYS days ago" +%s)
#   if [[ $createDate -lt $olderThan ]]; then
#     fileName=$(echo $line|awk {'print $4'})
#     if [[ $fileName != "" ]]; then
#       aws s3 rm "s3://$S3_BUCKET/db/$fileName"
#     fi
#   fi
# done

echo "Backup completed: $TIMESTAMP" >> "$BACKUP_DIR/backup.log"
