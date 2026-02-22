-- Create storage bucket for Quran PDF
INSERT INTO storage.buckets (id, name, public) VALUES ('quran', 'quran', true);

-- Allow public read access
CREATE POLICY "Public read access for quran bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'quran');

-- Allow authenticated uploads (for admin)
CREATE POLICY "Allow uploads to quran bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'quran');