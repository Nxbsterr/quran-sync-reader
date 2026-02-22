import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Check if file already exists
    const { data: existingFiles } = await supabase.storage
      .from('quran')
      .list('', { search: 'quran.pdf' });

    if (existingFiles && existingFiles.length > 0) {
      const { data: urlData } = supabase.storage
        .from('quran')
        .getPublicUrl('quran.pdf');
      
      return new Response(
        JSON.stringify({ url: urlData.publicUrl, status: 'exists' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Download from Google Drive
    const fileId = '1Gim4R2qkvPpYfwl3RXwdQjQyg4Gr6vXw';
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`;
    
    console.log('Downloading PDF from Google Drive...');
    const response = await fetch(downloadUrl, { redirect: 'follow' });
    
    if (!response.ok) {
      throw new Error(`Failed to download: ${response.status}`);
    }

    const pdfBuffer = await response.arrayBuffer();
    console.log(`Downloaded ${pdfBuffer.byteLength} bytes`);

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('quran')
      .upload('quran.pdf', pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    const { data: urlData } = supabase.storage
      .from('quran')
      .getPublicUrl('quran.pdf');

    return new Response(
      JSON.stringify({ url: urlData.publicUrl, status: 'uploaded' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
