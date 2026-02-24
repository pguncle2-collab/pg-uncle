# Database Maintenance Guide

## Overview
This guide covers database and storage maintenance for PG Uncle to prevent hitting Supabase limits and keep the system running efficiently.

## Supabase Free Tier Limits

### Database
- **Storage**: 500 MB
- **Bandwidth**: 5 GB/month
- **Rows**: Unlimited (but storage limited)

### Storage (Files)
- **Storage**: 1 GB
- **Bandwidth**: 2 GB/month
- **File uploads**: 50 MB per file

## Automatic Cleanup Features

### 1. Image Cleanup on Property Deletion ✅
When a property is deleted, all associated images are automatically removed:
- Property images
- Room images
- Prevents orphaned files in storage

**How it works:**
```typescript
// In hooks/useProperties.ts
const deleteProperty = async (id: string) => {
  // 1. Delete from database
  const propertyData = await propertyOperations.delete(id);
  
  // 2. Delete images in background
  deletePropertyImages(propertyData);
};
```

### 2. Orphaned Image Detection ✅
The maintenance page can scan for and remove orphaned images:
- Images in storage but not in database
- Left over from failed uploads
- From deleted properties (if cleanup failed)

## Maintenance Dashboard

### Access
Navigate to: `/admin/maintenance`

Or click "🔧 Maintenance" in the admin header.

### Features

#### 1. Storage Statistics
- Total files in storage
- Active properties count
- Files by folder breakdown
- Real-time refresh

#### 2. Orphaned Image Scanner
- Scans all storage files
- Compares with database references
- Lists orphaned files
- One-click cleanup

#### 3. Cleanup Results
- Shows success/failure counts
- Updates storage stats
- Logs all operations

## Manual Maintenance Tasks

### Weekly Tasks

#### 1. Scan for Orphaned Images
```
1. Go to /admin/maintenance
2. Click "Scan for Orphaned Images"
3. Review the list
4. Click "Delete Orphaned Images"
```

#### 2. Check Storage Usage
```sql
-- Run in Supabase SQL Editor
SELECT 
  pg_size_pretty(pg_database_size(current_database())) as database_size;
```

#### 3. Vacuum Database
```sql
-- Reclaim storage space
VACUUM ANALYZE properties;
VACUUM ANALYZE bookings;
VACUUM ANALYZE payments;
```

### Monthly Tasks

#### 1. Clean Up Old Bookings
```sql
-- Find old cancelled/pending bookings
SELECT id, status, created_at
FROM bookings
WHERE status IN ('cancelled', 'pending')
  AND created_at < NOW() - INTERVAL '6 months';

-- Delete them (after review)
DELETE FROM bookings
WHERE status IN ('cancelled', 'pending')
  AND created_at < NOW() - INTERVAL '6 months';
```

#### 2. Clean Up Failed Payments
```sql
-- Find old failed payments
SELECT id, status, created_at
FROM payments
WHERE status = 'failed'
  AND created_at < NOW() - INTERVAL '3 months';

-- Delete them (after review)
DELETE FROM payments
WHERE status = 'failed'
  AND created_at < NOW() - INTERVAL '3 months';
```

#### 3. Reindex Tables
```sql
-- Rebuild indexes for performance
REINDEX TABLE properties;
REINDEX TABLE bookings;
REINDEX TABLE payments;
```

### Quarterly Tasks

#### 1. Full Database Backup
```
1. Go to Supabase Dashboard
2. Navigate to Database → Backups
3. Create manual backup
4. Download backup file
5. Store securely
```

#### 2. Review Storage Usage
```
1. Check database size
2. Check storage bucket size
3. Review growth trends
4. Plan for upgrades if needed
```

#### 3. Archive Old Data
If approaching limits, consider:
- Archiving old bookings to external storage
- Removing very old cancelled bookings
- Compressing old payment records

## Monitoring & Alerts

### Database Size Monitoring

#### Check Current Size
```sql
SELECT 
  pg_size_pretty(pg_database_size(current_database())) as database_size,
  pg_database_size(current_database()) as size_bytes;
```

#### Check Table Sizes
```sql
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size('public.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size('public.'||tablename) DESC;
```

### Storage Monitoring

#### Via Maintenance Page
- Visit `/admin/maintenance`
- Check "Storage Statistics" section
- Monitor file count and folder distribution

#### Via Supabase Dashboard
1. Go to Storage → property-images
2. Check bucket size
3. Review file list

## Optimization Tips

### 1. Image Optimization
- Images are automatically optimized on upload
- Max size: 50 MB per file
- Supported formats: JPEG, PNG, WebP
- Consider using WebP for smaller file sizes

### 2. Database Optimization
- Use indexes on frequently queried columns
- Regularly run VACUUM ANALYZE
- Archive old data
- Delete unnecessary records

### 3. Query Optimization
- Use caching for frequently accessed data
- Limit result sets with pagination
- Use specific column selection (not SELECT *)
- Add indexes for slow queries

## Troubleshooting

### Issue: Storage Limit Reached

**Symptoms:**
- Upload errors
- "Storage limit exceeded" messages

**Solutions:**
1. Run orphaned image cleanup
2. Delete old/unused properties
3. Compress or remove large images
4. Upgrade to Supabase Pro ($25/month for 8GB)

### Issue: Database Limit Reached

**Symptoms:**
- Insert/update errors
- "Database storage limit exceeded"

**Solutions:**
1. Clean up old bookings
2. Clean up failed payments
3. Run VACUUM to reclaim space
4. Archive old data
5. Upgrade to Supabase Pro

### Issue: Slow Queries

**Symptoms:**
- Long load times
- Timeout errors

**Solutions:**
1. Run REINDEX on tables
2. Run VACUUM ANALYZE
3. Check for missing indexes
4. Optimize queries
5. Enable caching

## Upgrade Considerations

### When to Upgrade to Pro

Consider upgrading when:
- Database size > 400 MB (80% of limit)
- Storage size > 800 MB (80% of limit)
- Frequent timeout errors
- Need better performance
- Need more bandwidth

### Pro Plan Benefits
- **Database**: 8 GB storage
- **Storage**: 100 GB
- **Bandwidth**: 50 GB/month
- **Better performance**
- **Daily backups**
- **Point-in-time recovery**

## Automation Scripts

### Automated Cleanup Script
Create a cron job or scheduled function:

```typescript
// Run weekly
async function weeklyMaintenance() {
  // 1. Scan for orphaned images
  const orphaned = await findOrphanedImages(properties);
  
  // 2. Clean up if found
  if (orphaned.length > 0) {
    await cleanupOrphanedImages(orphaned);
  }
  
  // 3. Log results
  console.log(`Cleaned up ${orphaned.length} orphaned images`);
}
```

### Database Cleanup Script
```sql
-- Save as weekly-cleanup.sql
-- Run via cron or scheduled job

-- Clean old cancelled bookings
DELETE FROM bookings
WHERE status = 'cancelled'
  AND created_at < NOW() - INTERVAL '6 months';

-- Clean old failed payments
DELETE FROM payments
WHERE status = 'failed'
  AND created_at < NOW() - INTERVAL '3 months';

-- Vacuum tables
VACUUM ANALYZE properties;
VACUUM ANALYZE bookings;
VACUUM ANALYZE payments;
```

## Best Practices

### 1. Regular Maintenance
- Run orphaned image scan weekly
- Check storage stats weekly
- Clean up old records monthly
- Reindex tables monthly
- Full backup quarterly

### 2. Proactive Monitoring
- Set up alerts for 80% storage usage
- Monitor query performance
- Track database growth trends
- Review error logs regularly

### 3. Data Retention Policy
- Keep active bookings indefinitely
- Keep confirmed bookings for 1 year
- Delete cancelled bookings after 6 months
- Delete failed payments after 3 months
- Archive old data before deletion

### 4. Image Management
- Delete images when properties are deleted
- Run orphaned image cleanup regularly
- Optimize images before upload
- Use appropriate image formats
- Consider CDN for frequently accessed images

## Emergency Procedures

### If Database is Full

1. **Immediate Actions:**
   ```sql
   -- Find largest tables
   SELECT tablename, pg_size_pretty(pg_total_relation_size('public.'||tablename))
   FROM pg_tables WHERE schemaname = 'public'
   ORDER BY pg_total_relation_size('public.'||tablename) DESC;
   
   -- Delete old records
   DELETE FROM bookings WHERE status = 'cancelled' AND created_at < NOW() - INTERVAL '3 months';
   DELETE FROM payments WHERE status = 'failed' AND created_at < NOW() - INTERVAL '1 month';
   
   -- Vacuum to reclaim space
   VACUUM FULL;
   ```

2. **Follow-up:**
   - Upgrade to Pro plan
   - Implement automated cleanup
   - Review data retention policy

### If Storage is Full

1. **Immediate Actions:**
   - Go to `/admin/maintenance`
   - Run orphaned image scan
   - Delete all orphaned images
   - Delete old/unused properties

2. **Follow-up:**
   - Upgrade to Pro plan
   - Implement image optimization
   - Review image retention policy

## Support & Resources

- **Supabase Documentation**: https://supabase.com/docs
- **Maintenance Page**: `/admin/maintenance`
- **SQL Scripts**: `scripts/database-maintenance.sql`
- **Image Cleanup**: `lib/imageCleanup.ts`

## Summary

✅ **Automatic Features:**
- Images deleted when properties are removed
- Orphaned image detection and cleanup
- Storage statistics tracking

📋 **Manual Tasks:**
- Weekly: Scan for orphaned images
- Monthly: Clean old bookings/payments, reindex
- Quarterly: Full backup, review usage

🔧 **Tools Available:**
- Maintenance dashboard at `/admin/maintenance`
- SQL maintenance scripts
- Image cleanup utilities

⚠️ **Monitor:**
- Database size (limit: 500 MB)
- Storage size (limit: 1 GB)
- Query performance
- Error logs
