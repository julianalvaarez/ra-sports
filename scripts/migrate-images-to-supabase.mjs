import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Cargar variables de .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
dotenv.config({ path: path.join(rootDir, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jahlhzfvntekwroabxag.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('❌ Falta la clave de Supabase en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

const BUCKET_NAME = 'players-rasports';

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.webp': return 'image/webp';
    case '.svg': return 'image/svg+xml';
    case '.gif': return 'image/gif';
    case '.avif': return 'image/avif';
    default: return 'application/octet-stream';
  }
}

async function verificarBucket() {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) {
    console.warn('⚠️ No se pudieron listar los buckets (requiere permisos de admin). Verificando existencia directa...');
  }
  const existe = buckets?.some(b => b.name === BUCKET_NAME);
  if (existe) {
    console.log(`✅ El bucket "${BUCKET_NAME}" existe en Supabase Storage.`);
    return true;
  }
  return false;
}

async function migrar() {
  console.log('🚀 Iniciando proceso de migración de imágenes a Supabase Storage...');
  console.log(`📡 URL de Supabase: ${supabaseUrl}`);
  console.log(`🔑 Usando clave: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? 'service_role (Admin)' : 'anon/publishable'}`);

  await verificarBucket();

  // 1. MIGRAR ESCUDOS DE CLUBES
  console.log('\n--- 1. Migrando Escudos de Clubes ---');
  const { data: clubes, error: clubesErr } = await supabase
    .from('clubes')
    .select('id, nombre, escudo_url')
    .like('escudo_url', '/uploads/%');

  if (clubesErr) {
    console.error('❌ Error al consultar la tabla clubes:', clubesErr);
    return;
  }

  console.log(`Se encontraron ${clubes.length} clubes con imágenes locales en /uploads/.`);
  let clubesMigrados = 0;

  for (const club of clubes) {
    const localRelPath = club.escudo_url.startsWith('/') ? club.escudo_url.slice(1) : club.escudo_url;
    const localFullPath = path.join(rootDir, 'public', localRelPath);

    if (!fs.existsSync(localFullPath)) {
      console.warn(`⚠️ Archivo local no encontrado para club "${club.nombre}": ${localFullPath}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(localFullPath);
    const fileName = path.basename(localFullPath);
    const storagePath = `escudos/${fileName}`;
    const mimeType = getMimeType(localFullPath);

    const { error: uploadErr } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, fileBuffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (uploadErr) {
      console.error(`❌ Error al subir escudo de "${club.nombre}":`, uploadErr.message);
      continue;
    }

    const { data: publicData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(storagePath);

    const nuevaUrl = publicData.publicUrl;

    const { error: updateErr } = await supabase
      .from('clubes')
      .update({ escudo_url: nuevaUrl })
      .eq('id', club.id);

    if (updateErr) {
      console.error(`❌ Error al actualizar club ID ${club.id} en la base de datos:`, updateErr.message);
    } else {
      clubesMigrados++;
      console.log(`  ✓ [${clubesMigrados}/${clubes.length}] Club "${club.nombre}" actualizado -> ${nuevaUrl}`);
    }
  }

  // 2. MIGRAR FOTOS DE JUGADORES
  console.log('\n--- 2. Migrando Fotos de Jugadores ---');
  const { data: imagenes, error: imgErr } = await supabase
    .from('imagenes_jugador')
    .select('id, jugador_id, url')
    .like('url', '/uploads/%');

  if (imgErr) {
    console.error('❌ Error al consultar la tabla imagenes_jugador:', imgErr);
    return;
  }

  console.log(`Se encontraron ${imagenes.length} fotos de jugadores con imágenes locales en /uploads/.`);
  let fotosMigradas = 0;

  for (const img of imagenes) {
    const localRelPath = img.url.startsWith('/') ? img.url.slice(1) : img.url;
    const localFullPath = path.join(rootDir, 'public', localRelPath);

    if (!fs.existsSync(localFullPath)) {
      console.warn(`⚠️ Archivo local no encontrado para foto ID ${img.id}: ${localFullPath}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(localFullPath);
    const fileName = path.basename(localFullPath);
    const storagePath = `jugadores/${fileName}`;
    const mimeType = getMimeType(localFullPath);

    const { error: uploadErr } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, fileBuffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (uploadErr) {
      console.error(`❌ Error al subir foto ID ${img.id}:`, uploadErr.message);
      continue;
    }

    const { data: publicData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(storagePath);

    const nuevaUrl = publicData.publicUrl;

    const { error: updateErr } = await supabase
      .from('imagenes_jugador')
      .update({ url: nuevaUrl })
      .eq('id', img.id);

    if (updateErr) {
      console.error(`❌ Error al actualizar imagen ID ${img.id} en la base de datos:`, updateErr.message);
    } else {
      fotosMigradas++;
      console.log(`  ✓ [${fotosMigradas}/${imagenes.length}] Foto ID ${img.id} actualizada -> ${nuevaUrl}`);
    }
  }

  console.log('\n========================================');
  console.log('🎉 RESUMEN DE LA MIGRACIÓN:');
  console.log(`- Escudos de clubes migrados: ${clubesMigrados} de ${clubes.length}`);
  console.log(`- Fotos de jugadores migradas: ${fotosMigradas} de ${imagenes.length}`);
  console.log('========================================\n');
}

migrar().catch(console.error);

