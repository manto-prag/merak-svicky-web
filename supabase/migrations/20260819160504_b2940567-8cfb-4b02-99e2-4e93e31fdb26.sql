GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

DROP POLICY "public read active scents" ON public.scents;
DROP POLICY "public read active colors" ON public.colors;
DROP POLICY "public read active packagings" ON public.packagings;
DROP POLICY "public read pickup points" ON public.pickup_points;

CREATE POLICY "public read active scents" ON public.scents FOR SELECT TO anon, authenticated USING (active);
CREATE POLICY "public read active colors" ON public.colors FOR SELECT TO anon, authenticated USING (active);
CREATE POLICY "public read active packagings" ON public.packagings FOR SELECT TO anon, authenticated USING (active);
CREATE POLICY "public read pickup points" ON public.pickup_points FOR SELECT TO anon, authenticated USING (active);