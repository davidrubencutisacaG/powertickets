-- Migration: Add organizerStatus column to users table
-- Created: 2024-12-19
-- Description: Adds OrganizerStatus enum and organizerStatus field to users table with default value PENDING

-- Step 1: Create the enum type if it doesn't exist
DO $$ BEGIN
  CREATE TYPE "organizer_status_enum" AS ENUM('Pending', 'Approved', 'Rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Step 2: Add the organizerStatus column to users table
ALTER TABLE "users" 
ADD COLUMN "organizerStatus" organizer_status_enum NOT NULL DEFAULT 'Pending';

-- Rollback script (if needed):
-- ALTER TABLE "users" DROP COLUMN "organizerStatus";
-- DROP TYPE IF EXISTS "organizer_status_enum";


