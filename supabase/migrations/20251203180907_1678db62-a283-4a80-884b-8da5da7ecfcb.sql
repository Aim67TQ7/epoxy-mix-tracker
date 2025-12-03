-- Add UPDATE policy for EpoxyMix table
CREATE POLICY "Allow public update" 
ON public."EpoxyMix" 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Add DELETE policy for EpoxyMix table
CREATE POLICY "Allow public delete" 
ON public."EpoxyMix" 
FOR DELETE 
USING (true);