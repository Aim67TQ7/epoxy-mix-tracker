-- Allow public INSERT (no auth required)
CREATE POLICY "Allow public insert" ON public."EpoxyMix"
FOR INSERT WITH CHECK (true);

-- Allow public SELECT (for viewing history)
CREATE POLICY "Allow public select" ON public."EpoxyMix"
FOR SELECT USING (true);