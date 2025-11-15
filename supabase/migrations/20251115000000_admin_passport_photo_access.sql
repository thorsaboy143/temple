-- Add admin permission to view all passport photos
-- This allows admins to view member cards with passport photos

drop policy if exists "Admins can view all passport photos" on storage.objects;
create policy "Admins can view all passport photos"
on storage.objects for select
to authenticated
using (
    bucket_id = 'passport-photos' AND
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);
