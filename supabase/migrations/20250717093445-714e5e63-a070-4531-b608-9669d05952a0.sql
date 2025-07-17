-- Create project_attachments table for storing attachment metadata
CREATE TABLE public.project_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.project_attachments ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own project attachments" 
ON public.project_attachments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own project attachments" 
ON public.project_attachments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own project attachments" 
ON public.project_attachments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own project attachments" 
ON public.project_attachments 
FOR DELETE 
USING (auth.uid() = user_id);