-- Create a bucket for passport photos if it doesn't exist
insert into storage.buckets (id, name)
values ('passport-photos', 'passport-photos')
on conflict (id) do nothing;
