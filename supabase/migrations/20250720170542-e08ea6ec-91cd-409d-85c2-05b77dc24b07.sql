-- Sync existing design_versions data to designs table
INSERT INTO public.designs (project_id, name, description, user_id, created_at, updated_at)
SELECT 
  project_id,
  name,
  description,
  user_id,
  created_at,
  updated_at
FROM public.design_versions
WHERE NOT EXISTS (
  SELECT 1 FROM public.designs 
  WHERE designs.project_id = design_versions.project_id 
  AND designs.name = design_versions.name 
  AND designs.user_id = design_versions.user_id
);