import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

// Configuration
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES_PER_REQUEST = 5;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  fileName?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with user's auth
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Verify the user's JWT
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Authentication failed:', authError?.message);
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing upload request for user: ${user.id}`);

    // Parse multipart form data
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No files provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (files.length > MAX_FILES_PER_REQUEST) {
      return new Response(
        JSON.stringify({ error: `Maximum ${MAX_FILES_PER_REQUEST} files allowed per request` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results: UploadResult[] = [];

    for (const file of files) {
      const result: UploadResult = { success: false, fileName: file.name };

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        result.error = `File exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`;
        results.push(result);
        console.warn(`File ${file.name} rejected: size ${file.size} exceeds limit`);
        continue;
      }

      // Validate MIME type
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        result.error = `Invalid file type: ${file.type}. Allowed: JPG, PNG, WebP`;
        results.push(result);
        console.warn(`File ${file.name} rejected: invalid type ${file.type}`);
        continue;
      }

      // Additional validation: check file signature (magic bytes)
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      
      if (!isValidImageSignature(bytes, file.type)) {
        result.error = 'File content does not match declared type';
        results.push(result);
        console.warn(`File ${file.name} rejected: signature mismatch`);
        continue;
      }

      // Generate unique filename with user folder
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const sanitizedExt = ['jpg', 'jpeg', 'png', 'webp'].includes(fileExt) ? fileExt : 'jpg';
      const fileName = `${user.id}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${sanitizedExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(fileName, bytes, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        result.error = 'Upload failed';
        console.error(`Upload failed for ${file.name}:`, uploadError.message);
        results.push(result);
        continue;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName);

      result.success = true;
      result.url = publicUrl;
      results.push(result);
      console.log(`Successfully uploaded: ${fileName}`);
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    console.log(`Upload complete: ${successCount} succeeded, ${failCount} failed`);

    return new Response(
      JSON.stringify({
        results,
        summary: {
          total: files.length,
          successful: successCount,
          failed: failCount,
        },
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

/**
 * Validates file magic bytes match the declared MIME type
 */
function isValidImageSignature(bytes: Uint8Array, mimeType: string): boolean {
  if (bytes.length < 12) return false;

  // JPEG: FF D8 FF
  if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
    return bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF;
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (mimeType === 'image/png') {
    return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47 &&
           bytes[4] === 0x0D && bytes[5] === 0x0A && bytes[6] === 0x1A && bytes[7] === 0x0A;
  }

  // WebP: RIFF....WEBP
  if (mimeType === 'image/webp') {
    return bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
           bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
  }

  return false;
}
