-- Add passport_photo_url column to membership_applications table
alter table membership_applications add column passport_photo_url text;



-- Set up storage policy for passport photos bucket
drop policy if exists "Authenticated users can upload passport photos" on storage.objects;
create policy "Authenticated users can upload passport photos"
on storage.objects for insert
to authenticated
with check (
    bucket_id = 'passport-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Users can view their own passport photos" on storage.objects;
create policy "Users can view their own passport photos"
on storage.objects for select
to authenticated
using (
    bucket_id = 'passport-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Users can update their own passport photos" on storage.objects;
create policy "Users can update their own passport photos"
on storage.objects for update
to authenticated
using (
    bucket_id = 'passport-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Users can delete their own passport photos" on storage.objects;
create policy "Users can delete their own passport photos"
on storage.objects for delete
to authenticated
using (
    bucket_id = 'passport-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
);