-- Database Maintenance Scripts for PG Uncle
-- Run these periodically to keep your database clean and optimized

-- ============================================
-- 1. CHECK DATABASE SIZE
-- ============================================
-- Check total database size
SELECT 
  pg_size_pretty(pg_database_size(current_database())) as database_size;

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
  pg_total_relation_size(schemaname||'.'||tablename) AS size_bytes
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY size_bytes DESC;

-- ============================================
-- 2. FIND INACTIVE PROPERTIES
-- ============================================
-- Properties that have been inactive for more than 30 days
SELECT 
  id,
  name,
  city,
  is_active,
  created_at,
  updated_at,
  EXTRACT(DAY FROM (NOW() - updated_at)) as days_since_update
FROM properties
WHERE is_active = false
  AND updated_at < NOW() - INTERVAL '30 days'
ORDER BY updated_at ASC;

-- ============================================
-- 3. FIND PROPERTIES WITH NO IMAGES
-- ============================================
SELECT 
  id,
  name,
  city,
  images,
  is_active
FROM properties
WHERE images IS NULL 
   OR images = '[]'::jsonb 
   OR jsonb_array_length(images) = 0;

-- ============================================
-- 4. FIND PROPERTIES WITH BROKEN IMAGE URLS
-- ============================================
-- Properties with images that don't contain 'supabase' or 'unsplash'
SELECT 
  id,
  name,
  images
FROM properties
WHERE images IS NOT NULL
  AND images::text NOT LIKE '%supabase%'
  AND images::text NOT LIKE '%unsplash%';

-- ============================================
-- 5. CLEAN UP OLD BOOKINGS
-- ============================================
-- Find bookings older than 6 months with status 'cancelled' or 'pending'
SELECT 
  id,
  user_id,
  property_id,
  status,
  created_at,
  EXTRACT(DAY FROM (NOW() - created_at)) as days_old
FROM bookings
WHERE status IN ('cancelled', 'pending')
  AND created_at < NOW() - INTERVAL '6 months'
ORDER BY created_at ASC;

-- Delete old cancelled/pending bookings (CAREFUL!)
-- Uncomment to execute:
-- DELETE FROM bookings
-- WHERE status IN ('cancelled', 'pending')
--   AND created_at < NOW() - INTERVAL '6 months';

-- ============================================
-- 6. CLEAN UP OLD PAYMENTS
-- ============================================
-- Find failed payments older than 3 months
SELECT 
  id,
  user_id,
  property_id,
  status,
  amount,
  created_at,
  EXTRACT(DAY FROM (NOW() - created_at)) as days_old
FROM payments
WHERE status = 'failed'
  AND created_at < NOW() - INTERVAL '3 months'
ORDER BY created_at ASC;

-- Delete old failed payments (CAREFUL!)
-- Uncomment to execute:
-- DELETE FROM payments
-- WHERE status = 'failed'
--   AND created_at < NOW() - INTERVAL '3 months';

-- ============================================
-- 7. VACUUM AND ANALYZE
-- ============================================
-- Reclaim storage and update statistics
-- Run these periodically (weekly recommended)

-- Vacuum all tables (reclaim storage)
VACUUM ANALYZE properties;
VACUUM ANALYZE bookings;
VACUUM ANALYZE payments;
VACUUM ANALYZE users;

-- ============================================
-- 8. CHECK FOR DUPLICATE PROPERTIES
-- ============================================
-- Find properties with same name and address
SELECT 
  name,
  address,
  COUNT(*) as count,
  array_agg(id) as property_ids
FROM properties
GROUP BY name, address
HAVING COUNT(*) > 1;

-- ============================================
-- 9. PROPERTY STATISTICS
-- ============================================
-- Get overview of property data
SELECT 
  COUNT(*) as total_properties,
  COUNT(*) FILTER (WHERE is_active = true) as active_properties,
  COUNT(*) FILTER (WHERE is_active = false) as inactive_properties,
  COUNT(*) FILTER (WHERE images IS NULL OR jsonb_array_length(images) = 0) as properties_without_images,
  AVG(rating) as average_rating,
  SUM(reviews) as total_reviews
FROM properties;

-- Properties by city
SELECT 
  city,
  COUNT(*) as property_count,
  COUNT(*) FILTER (WHERE is_active = true) as active_count,
  AVG(rating) as avg_rating
FROM properties
GROUP BY city
ORDER BY property_count DESC;

-- ============================================
-- 10. BOOKING STATISTICS
-- ============================================
SELECT 
  COUNT(*) as total_bookings,
  COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed,
  COUNT(*) FILTER (WHERE status = 'pending') as pending,
  COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
  SUM(total_amount) FILTER (WHERE status = 'confirmed') as total_revenue
FROM bookings;

-- ============================================
-- 11. STORAGE OPTIMIZATION
-- ============================================
-- Find properties with large image arrays
SELECT 
  id,
  name,
  jsonb_array_length(images) as image_count,
  jsonb_array_length(room_types) as room_type_count,
  pg_column_size(images) as images_size_bytes,
  pg_size_pretty(pg_column_size(images)) as images_size
FROM properties
WHERE images IS NOT NULL
ORDER BY pg_column_size(images) DESC
LIMIT 20;

-- ============================================
-- 12. REINDEX TABLES
-- ============================================
-- Rebuild indexes for better performance
-- Run these monthly or when performance degrades

REINDEX TABLE properties;
REINDEX TABLE bookings;
REINDEX TABLE payments;
REINDEX TABLE users;

-- ============================================
-- 13. CHECK FOR ORPHANED RECORDS
-- ============================================
-- Bookings without valid property
SELECT b.*
FROM bookings b
LEFT JOIN properties p ON b.property_id = p.id
WHERE p.id IS NULL;

-- Payments without valid booking
SELECT p.*
FROM payments p
LEFT JOIN bookings b ON p.booking_id = b.id
WHERE p.booking_id IS NOT NULL
  AND b.id IS NULL;

-- ============================================
-- 14. BACKUP RECOMMENDATIONS
-- ============================================
-- Before running any DELETE operations:
-- 1. Create a backup in Supabase Dashboard
-- 2. Test queries with SELECT first
-- 3. Run DELETE in small batches
-- 4. Monitor database size after cleanup

-- ============================================
-- MAINTENANCE SCHEDULE RECOMMENDATIONS
-- ============================================
-- Daily:
--   - Check database size
--   - Monitor active properties
--
-- Weekly:
--   - Run VACUUM ANALYZE
--   - Check for orphaned images
--   - Review booking statistics
--
-- Monthly:
--   - REINDEX tables
--   - Clean up old cancelled bookings
--   - Clean up old failed payments
--   - Review and optimize queries
--
-- Quarterly:
--   - Full database backup
--   - Review storage usage
--   - Optimize image storage
--   - Archive old data if needed
