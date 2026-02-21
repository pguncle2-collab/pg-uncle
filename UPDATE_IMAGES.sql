-- ============================================
-- Update Property Images to Use Unsplash (Free & Working)
-- Run this in Supabase SQL Editor to fix image loading errors
-- ============================================

-- Update all properties with working Unsplash images
UPDATE properties
SET 
  image = CASE 
    WHEN name = 'Sunshine PG' THEN 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'
    WHEN name = 'Green Valley PG' THEN 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80'
    WHEN name = 'Royal Residency' THEN 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'
    WHEN name = 'City Center PG' THEN 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'
    WHEN name = 'Student Hub PG' THEN 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80'
    WHEN name = 'Comfort Stay PG' THEN 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80'
    ELSE 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'
  END,
  images = CASE 
    WHEN name = 'Sunshine PG' THEN '[
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"
    ]'::jsonb
    WHEN name = 'Green Valley PG' THEN '[
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"
    ]'::jsonb
    WHEN name = 'Royal Residency' THEN '[
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"
    ]'::jsonb
    WHEN name = 'City Center PG' THEN '[
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80"
    ]'::jsonb
    WHEN name = 'Student Hub PG' THEN '[
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"
    ]'::jsonb
    WHEN name = 'Comfort Stay PG' THEN '[
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"
    ]'::jsonb
    ELSE '[
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"
    ]'::jsonb
  END;

-- Verify the update
SELECT name, image, images FROM properties;
