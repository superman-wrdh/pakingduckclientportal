-- Add number_of_projects column to client_profiles table
ALTER TABLE public.client_profiles 
ADD COLUMN number_of_projects integer NOT NULL DEFAULT 0;