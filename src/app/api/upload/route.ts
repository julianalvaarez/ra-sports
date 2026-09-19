import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import fs from 'fs/promises';
import path from 'path';

// Buckets a probar en Supabase
const BUCKETS_SUPABASE = ['players-rasports', 'jugadores'];

async function subirASupabase(
    bucketName: string,
    filename: string,
    buffer: Buffer,
    mimeType: string
): Promise<string | null> {
    try {
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(filename, buffer, {
                contentType: mimeType,
                upsert: true,
            });

        if (error || !data) {
            return null;
        }

        const { data: publicUrlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(data.path);

        return publicUrlData.publicUrl;
    } catch {
        return null;
    }
}

async function guardarEnDiscoLocal(
    folder: string,
    filename: string,
    buffer: Buffer
): Promise<string> {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', folder);
    await fs.mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, filename);
    await fs.writeFile(filePath, buffer);

    return `/uploads/${folder}/${filename}`;
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const files = formData.getAll('files') as File[];
        const folder = (formData.get('folder') as string) || 'general';

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No se enviaron archivos' }, { status: 400 });
        }

        const uploadedUrls: string[] = [];

        for (const item of files) {
            const file = item as unknown as { name?: string; type?: string; arrayBuffer?: () => Promise<ArrayBuffer> };
            if (!file || typeof file.arrayBuffer !== 'function') continue;

            const buffer = Buffer.from(await file.arrayBuffer());
            const fileName = file.name || 'archivo.jpg';
            const extension = fileName.includes('.') ? fileName.split('.').pop() : 'jpg';
            const cleanBaseName = fileName
                .replace(/[^a-zA-Z0-9._-]/g, '_')
                .toLowerCase();
            const uniqueFilename = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${cleanBaseName}.${extension}`;
            const supabasePath = `${folder}/${uniqueFilename}`;

            let publicUrl: string | null = null;

            // 1. Intentar subir a Supabase Storage (players-rasports / jugadores)
            for (const bucketName of BUCKETS_SUPABASE) {
                publicUrl = await subirASupabase(
                    bucketName,
                    supabasePath,
                    buffer,
                    file.type || 'image/jpeg'
                );
                if (publicUrl) break;
            }

            // 2. Si Supabase Storage no está configurado o falla, guardar localmente en public/uploads
            if (!publicUrl) {
                publicUrl = await guardarEnDiscoLocal(folder, uniqueFilename, buffer);
            }

            uploadedUrls.push(publicUrl);
        }

        return NextResponse.json({ urls: uploadedUrls });
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Error interno al procesar las imágenes';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
