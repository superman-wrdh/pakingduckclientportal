-- Create designs table for storing project designs
CREATE TABLE public.designs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.designs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for designs
CREATE POLICY "Users can view their own designs" 
ON public.designs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own designs" 
ON public.designs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own designs" 
ON public.designs 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own designs" 
ON public.designs 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_designs_updated_at
BEFORE UPDATE ON public.designs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();