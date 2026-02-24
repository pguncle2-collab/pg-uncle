# Maintenance Quick Start Guide

## 🚀 Quick Access

**Maintenance Dashboard**: `/admin/maintenance`

Click "🔧 Maintenance" in the admin header.

## ✅ What's Automatic

### Image Cleanup on Delete
When you delete a property, all images are automatically removed:
- ✅ Property images
- ✅ Room images
- ✅ No manual cleanup needed

**How it works:**
1. Admin clicks "Delete" on a property
2. Property is removed from database
3. All associated images are deleted from storage
4. Storage space is freed up

## 🔧 Manual Maintenance Tasks

### Weekly: Clean Orphaned Images (5 minutes)

1. Go to `/admin/maintenance`
2. Click "🔍 Scan for Orphaned Images"
3. Wait for scan to complete
4. Review the list of orphaned files
5. Click "🗑️ Delete Orphaned Images"
6. Done!

**What are orphaned images?**
Images in storage that aren't linked to any property. These can accumulate from:
- Failed uploads
- Interrupted deletions
- Manual database edits

### Monthly: Database Cleanup (10 minutes)

1. **Clean Old Bookings**
   ```sql
   -- In Supabase SQL Editor
   DELETE FROM bookings
   WHERE status = 'cancelled'
     AND created_at < NOW() - INTERVAL '6 months';
   ```

2. **Clean Failed Payments**
   ```sql
   DELETE FROM payments
   WHERE status = 'failed'
     AND created_at < NOW() - INTERVAL '3 months';
   ```

3. **Optimize Database**
   ```sql
   VACUUM ANALYZE properties;
   VACUUM ANALYZE bookings;
   VACUUM ANALYZE payments;
   ```

## 📊 Monitoring

### Check Storage Usage

**Via Maintenance Page:**
- Visit `/admin/maintenance`
- View "Storage Statistics" section
- See total files, folders, and usage

**Via Supabase Dashboard:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to Storage → property-images
4. Check bucket size

### Check Database Size

```sql
-- Run in Supabase SQL Editor
SELECT 
  pg_size_pretty(pg_database_size(current_database())) as database_size;
```

## ⚠️ Limits to Watch

### Free Tier Limits
- **Database**: 500 MB
- **Storage**: 1 GB
- **Bandwidth**: 5 GB/month (DB) + 2 GB/month (Storage)

### When to Worry
- Database > 400 MB (80%)
- Storage > 800 MB (80%)
- Frequent timeout errors

### What to Do
1. Run orphaned image cleanup
2. Delete old bookings/payments
3. Run VACUUM to reclaim space
4. Consider upgrading to Pro ($25/month)

## 🆘 Emergency Procedures

### Storage Full

**Immediate Actions:**
1. Go to `/admin/maintenance`
2. Scan for orphaned images
3. Delete all orphaned images
4. Delete unused properties

**If Still Full:**
- Upgrade to Pro plan (100 GB storage)
- Contact support

### Database Full

**Immediate Actions:**
```sql
-- Delete old cancelled bookings
DELETE FROM bookings 
WHERE status = 'cancelled' 
  AND created_at < NOW() - INTERVAL '3 months';

-- Delete old failed payments
DELETE FROM payments 
WHERE status = 'failed' 
  AND created_at < NOW() - INTERVAL '1 month';

-- Reclaim space
VACUUM FULL;
```

**If Still Full:**
- Upgrade to Pro plan (8 GB database)
- Archive old data

## 📋 Maintenance Checklist

### Weekly ✅
- [ ] Scan for orphaned images
- [ ] Check storage statistics
- [ ] Review error logs

### Monthly ✅
- [ ] Clean old cancelled bookings
- [ ] Clean old failed payments
- [ ] Run VACUUM ANALYZE
- [ ] Check database size
- [ ] Review storage usage

### Quarterly ✅
- [ ] Full database backup
- [ ] Review growth trends
- [ ] Optimize queries
- [ ] Plan for scaling

## 🎯 Best Practices

1. **Delete Unused Properties**
   - Images are automatically cleaned up
   - Frees database and storage space

2. **Run Weekly Scans**
   - Catches orphaned images early
   - Prevents storage buildup

3. **Monitor Usage**
   - Check stats weekly
   - Plan upgrades before hitting limits

4. **Regular Backups**
   - Supabase auto-backups daily (Pro)
   - Manual backups monthly (Free)

5. **Optimize Images**
   - Use WebP format when possible
   - Compress before upload
   - Max 50 MB per file

## 📚 Resources

- **Full Guide**: `DATABASE_MAINTENANCE_GUIDE.md`
- **SQL Scripts**: `scripts/database-maintenance.sql`
- **Code**: `lib/imageCleanup.ts`
- **Dashboard**: `/admin/maintenance`

## 🔑 Key Features

### Automatic ✅
- Image deletion on property removal
- Cache invalidation
- Error logging

### Manual 🔧
- Orphaned image cleanup
- Database optimization
- Storage monitoring
- Statistics dashboard

### Monitoring 📊
- Real-time storage stats
- File count by folder
- Database size tracking
- Usage alerts

## 💡 Tips

1. **Before Deleting Properties**
   - No special action needed
   - Images are auto-deleted

2. **After Bulk Operations**
   - Run orphaned image scan
   - Run VACUUM ANALYZE

3. **Before Hitting Limits**
   - Clean up at 80% usage
   - Plan upgrade path

4. **Regular Maintenance**
   - Set calendar reminders
   - Weekly: 5 minutes
   - Monthly: 10 minutes

## ✨ Summary

**Automatic Features:**
- ✅ Images deleted with properties
- ✅ Cache management
- ✅ Error handling

**Your Tasks:**
- 🔍 Weekly orphaned image scan (5 min)
- 🗑️ Monthly database cleanup (10 min)
- 📊 Monitor usage regularly

**Tools Available:**
- 🔧 Maintenance dashboard
- 📊 Storage statistics
- 🗑️ One-click cleanup
- 📝 SQL scripts

That's it! Keep your database clean and under limits with minimal effort.
