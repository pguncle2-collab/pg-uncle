# Requirements Document

## Introduction

This document specifies the requirements for migrating from Supabase Storage to Cloudinary for image management in a Next.js application. The migration will replace the current presigned URL upload flow with Cloudinary's upload API while maintaining existing functionality including client-side compression, multiple image uploads, and image optimization utilities.

## Glossary

- **Image_Upload_System**: The system responsible for uploading images from the client to cloud storage
- **Cloudinary_Service**: The Cloudinary cloud-based image management service
- **Upload_API**: The Next.js API route that handles image upload requests
- **Property_Form**: The React component that allows users to upload property and room images
- **Image_Compression**: Client-side image processing that reduces file size before upload
- **Image_Utils**: Utility functions for cache-busting and URL optimization
- **Cleanup_Service**: The system responsible for deleting unused images from storage
- **Environment_Config**: Application configuration stored in environment variables

## Requirements

### Requirement 1: Cloudinary SDK Integration

**User Story:** As a developer, I want to integrate the Cloudinary SDK, so that the application can upload images to Cloudinary instead of Supabase Storage.

#### Acceptance Criteria

1. THE Image_Upload_System SHALL install the cloudinary npm package as a dependency
2. THE Environment_Config SHALL include CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET variables
3. THE Upload_API SHALL initialize a Cloudinary client using the environment variables
4. WHEN environment variables are missing, THE Upload_API SHALL return an error indicating misconfiguration

### Requirement 2: Server-Side Upload Endpoint

**User Story:** As a developer, I want a server-side upload endpoint, so that images can be securely uploaded to Cloudinary without exposing API credentials to the client.

#### Acceptance Criteria

1. THE Upload_API SHALL accept POST requests with multipart/form-data containing image files
2. WHEN a valid image file is received, THE Upload_API SHALL upload it to Cloudinary_Service
3. THE Upload_API SHALL specify the folder parameter as "properties" or "properties/rooms" based on the request
4. WHEN upload succeeds, THE Upload_API SHALL return the Cloudinary secure_url in the response
5. WHEN upload fails, THE Upload_API SHALL return an error message with appropriate HTTP status code
6. THE Upload_API SHALL support uploading multiple images in a single request

### Requirement 3: Client-Side Image Compression

**User Story:** As a user, I want images to be compressed before upload, so that upload times are faster and storage costs are reduced.

#### Acceptance Criteria

1. THE Image_Upload_System SHALL maintain the existing client-side compression functionality
2. WHEN an image exceeds 1920px in width or height, THE Image_Compression SHALL resize it proportionally to a maximum of 1920px
3. THE Image_Compression SHALL compress images to 80% quality for JPEG format
4. THE Image_Compression SHALL compress images to 80% quality for PNG format
5. WHEN compression fails, THE Image_Upload_System SHALL upload the original uncompressed file

### Requirement 4: Upload Function Migration

**User Story:** As a developer, I want to update the upload functions, so that they use the new Cloudinary endpoint instead of Supabase presigned URLs.

#### Acceptance Criteria

1. THE Image_Upload_System SHALL replace the presigned URL flow with direct file upload to the Upload_API
2. WHEN uploadImage is called, THE Image_Upload_System SHALL send the compressed file to /api/upload via multipart/form-data
3. WHEN uploadMultipleImages is called, THE Image_Upload_System SHALL upload all files and return an array of Cloudinary URLs
4. THE Image_Upload_System SHALL maintain parallel upload behavior for multiple images
5. THE Image_Upload_System SHALL log upload progress for each image
6. WHEN any upload fails, THE Image_Upload_System SHALL throw an error with a descriptive message

### Requirement 5: Image Deletion Service

**User Story:** As a developer, I want to delete images from Cloudinary, so that unused images do not consume storage space.

#### Acceptance Criteria

1. THE Cleanup_Service SHALL extract the public_id from Cloudinary URLs
2. WHEN deleteImage is called with a Cloudinary URL, THE Cleanup_Service SHALL delete the image using the Cloudinary API
3. WHEN deleteMultipleImages is called, THE Cleanup_Service SHALL delete all specified images from Cloudinary
4. THE Cleanup_Service SHALL delete images from the "properties" folder in Cloudinary
5. WHEN deletion fails, THE Cleanup_Service SHALL log the error but not throw an exception
6. WHEN a non-Cloudinary URL is provided, THE Cleanup_Service SHALL skip deletion and log a warning

### Requirement 6: Image URL Utilities

**User Story:** As a developer, I want image URL utilities to work with Cloudinary URLs, so that cache-busting and optimization features continue to function.

#### Acceptance Criteria

1. THE Image_Utils SHALL continue to support cache-busting for Cloudinary URLs
2. THE Image_Utils SHALL add Cloudinary transformation parameters for image optimization
3. WHEN optimizeImageUrl is called with size "thumbnail", THE Image_Utils SHALL append w_400,q_75,f_auto transformation parameters
4. WHEN optimizeImageUrl is called with size "medium", THE Image_Utils SHALL append w_800,q_80,f_auto transformation parameters
5. WHEN optimizeImageUrl is called with size "large", THE Image_Utils SHALL append w_1200,q_85,f_auto transformation parameters
6. THE Image_Utils SHALL insert transformation parameters before the image filename in the Cloudinary URL path

### Requirement 7: Property Form Compatibility

**User Story:** As a user, I want the property form to work seamlessly with Cloudinary, so that I can upload property and room images without noticing any changes.

#### Acceptance Criteria

1. THE Property_Form SHALL continue to support multiple property image uploads
2. THE Property_Form SHALL continue to support multiple room image uploads per room type
3. THE Property_Form SHALL display image previews using blob URLs before upload
4. WHEN form is submitted, THE Property_Form SHALL upload all new images and receive Cloudinary URLs
5. THE Property_Form SHALL replace blob URLs with Cloudinary URLs in the final submission data
6. THE Property_Form SHALL maintain existing images (non-blob URLs) when editing properties
7. WHEN upload fails, THE Property_Form SHALL display an error message to the user

### Requirement 8: Environment Configuration

**User Story:** As a developer, I want clear environment configuration documentation, so that I can set up Cloudinary credentials correctly.

#### Acceptance Criteria

1. THE Environment_Config SHALL document CLOUDINARY_CLOUD_NAME in .env.local.example
2. THE Environment_Config SHALL document CLOUDINARY_API_KEY in .env.local.example
3. THE Environment_Config SHALL document CLOUDINARY_API_SECRET in .env.local.example
4. THE Environment_Config SHALL include comments explaining where to obtain Cloudinary credentials
5. THE Environment_Config SHALL mark Supabase Storage environment variables as deprecated

### Requirement 9: Backward Compatibility

**User Story:** As a developer, I want to handle existing Supabase URLs gracefully, so that previously uploaded images continue to display correctly.

#### Acceptance Criteria

1. WHEN an existing Supabase Storage URL is encountered, THE Image_Upload_System SHALL display it without modification
2. THE Cleanup_Service SHALL skip deletion attempts for Supabase Storage URLs
3. THE Image_Utils SHALL apply cache-busting to both Cloudinary and Supabase URLs
4. THE Property_Form SHALL accept and preserve both Cloudinary and Supabase URLs in image arrays

### Requirement 10: Error Handling and Validation

**User Story:** As a user, I want clear error messages when uploads fail, so that I understand what went wrong and how to fix it.

#### Acceptance Criteria

1. WHEN a file exceeds 50MB, THE Image_Upload_System SHALL reject it with a size limit error message
2. WHEN a file is not a valid image type, THE Image_Upload_System SHALL reject it with a file type error message
3. THE Image_Upload_System SHALL accept JPEG, PNG, and WebP image formats
4. WHEN Cloudinary API returns an error, THE Upload_API SHALL log the full error details server-side
5. WHEN Cloudinary API returns an error, THE Upload_API SHALL return a user-friendly error message to the client
6. WHEN network errors occur during upload, THE Image_Upload_System SHALL retry the upload once before failing

### Requirement 11: Upload Progress and Feedback

**User Story:** As a user, I want to see upload progress, so that I know the system is working when uploading large images.

#### Acceptance Criteria

1. THE Property_Form SHALL display an uploading state when images are being uploaded
2. THE Property_Form SHALL disable the submit button while uploads are in progress
3. THE Image_Upload_System SHALL log upload progress to the browser console
4. WHEN all uploads complete successfully, THE Property_Form SHALL proceed with form submission
5. WHEN uploads complete, THE Property_Form SHALL invalidate the cache to ensure fresh data

### Requirement 12: Supabase Storage Removal

**User Story:** As a developer, I want to remove Supabase Storage dependencies, so that the codebase is clean and maintainable.

#### Acceptance Criteria

1. THE Image_Upload_System SHALL remove all Supabase Storage client initialization code
2. THE Upload_API SHALL remove the createSignedUploadUrl functionality
3. THE Image_Upload_System SHALL remove imports of Supabase Storage modules from imageUpload.ts
4. THE Environment_Config SHALL remove SUPABASE_SERVICE_ROLE_KEY requirement for image uploads
5. THE Image_Upload_System SHALL update all comments and documentation referencing Supabase Storage
