
-- Add design_id column to design_versions table
ALTER TABLE public.design_versions 
ADD COLUMN design_id UUID;

-- Add foreign key constraint to link design_versions to designs
ALTER TABLE public.design_versions 
ADD CONSTRAINT fk_design_versions_design_id 
FOREIGN KEY (design_id) REFERENCES public.designs(id) ON DELETE CASCADE;

-- Update existing design_versions to link them to designs based on project_id and name matching
UPDATE public.design_versions dv
SET design_id = d.id
FROM public.designs d
WHERE dv.project_id = d.project_id 
  AND dv.name = d.name 
  AND dv.user_id = d.user_id;
