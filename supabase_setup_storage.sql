-- ========================================================
-- CONFIGURACIÓN DE STORAGE EN SUPABASE PARA R.A. SPORTS
-- Ejecuta este script en el SQL Editor de tu proyecto Supabase:
-- https://supabase.com/dashboard/project/jahlhzfvntekwroabxag/sql
-- ========================================================

-- 1. Crear el bucket 'players-rasports' como PÚBLICO
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'players-rasports',
    'players-rasports',
    true,
    52428800, -- 50 MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    file_size_limit = 52428800,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'image/avif'];

-- 2. Habilitar RLS en storage.objects (por si no está habilitado)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Políticas para acceso de lectura público a las imágenes del bucket
DROP POLICY IF EXISTS "Permitir lectura publica en players-rasports" ON storage.objects;
CREATE POLICY "Permitir lectura publica en players-rasports"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'players-rasports');

-- 4. Políticas para permitir subidas desde el cliente/servidor (con anon key o autenticado)
DROP POLICY IF EXISTS "Permitir subida a players-rasports" ON storage.objects;
CREATE POLICY "Permitir subida a players-rasports"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'players-rasports');

-- 5. Políticas para permitir actualización/sobreescritura
DROP POLICY IF EXISTS "Permitir actualizacion en players-rasports" ON storage.objects;
CREATE POLICY "Permitir actualizacion en players-rasports"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'players-rasports');

-- 6. Políticas para permitir borrado si fuera necesario
DROP POLICY IF EXISTS "Permitir borrado en players-rasports" ON storage.objects;
CREATE POLICY "Permitir borrado en players-rasports"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'players-rasports');

