
CREATE POLICY "Restrict audit_logs read to admins"
  ON public.audit_logs AS RESTRICTIVE FOR SELECT
  TO anon, authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Restrict email_campaign_logs read to admins"
  ON public.email_campaign_logs AS RESTRICTIVE FOR SELECT
  TO anon, authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Restrict email_logs read to admins"
  ON public.email_logs AS RESTRICTIVE FOR SELECT
  TO anon, authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Anyone can view resources" ON public.resources;
DROP POLICY IF EXISTS "Authenticated can view all resources" ON public.resources;

DROP POLICY IF EXISTS "Public can view schools" ON public.schools;
DROP POLICY IF EXISTS "Authenticated users can register a school" ON public.schools;

DROP VIEW IF EXISTS public.schools_public;
CREATE VIEW public.schools_public
WITH (security_invoker = on) AS
  SELECT id, name, code, type, city, region, logo_url, website, is_verified, student_count, created_at
  FROM public.schools
  WHERE is_active = true;

GRANT SELECT ON public.schools_public TO anon, authenticated;

CREATE POLICY "Users can register their own school"
  ON public.schools FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL AND admin_user_id = auth.uid());

CREATE POLICY "Authenticated can view schools"
  ON public.schools FOR SELECT
  TO authenticated
  USING (true);

ALTER PUBLICATION supabase_realtime DROP TABLE public.rate_limits;
