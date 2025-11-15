-- Seed initial temple events data
INSERT INTO public.temple_events (title, description, event_date, event_time, location, image_url, is_recurring, recurrence_pattern, status)
VALUES
  (
    'Annual Temple Festival',
    'Join us for our grand annual festival with special pujas, cultural programs, and prasad distribution. Experience the divine atmosphere with traditional ceremonies, music, and dance performances.',
    '2025-03-15',
    '6:00 AM - 9:00 PM',
    'Main Temple Premises',
    'https://images.unsplash.com/photo-1544980919-e17526d4ed0a?auto=format&fit=crop&q=80&w=800',
    false,
    NULL,
    'published'
  ),
  (
    'Weekly Bhajan Evening',
    'Devotional singing and spiritual discourse. All are welcome to participate and immerse themselves in divine melodies and bhajans. Prasad will be distributed after the session.',
    '2025-11-16',
    '7:00 PM - 9:00 PM',
    'Temple Hall',
    'https://images.unsplash.com/photo-1604608672516-f1b9b1362ca3?auto=format&fit=crop&q=80&w=800',
    true,
    'Every Saturday',
    'published'
  ),
  (
    'Spiritual Discourse',
    'Weekly spiritual discourse by learned scholars on ancient scriptures and modern life. Topics include Bhagavad Gita, Upanishads, and practical spirituality for daily living.',
    '2025-11-17',
    '10:00 AM - 12:00 PM',
    'Main Hall',
    'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&q=80&w=800',
    true,
    'Every Sunday',
    'published'
  ),
  (
    'Morning Aarti',
    'Daily morning aarti with traditional rituals and prayers. Start your day with divine blessings and peaceful meditation.',
    '2025-11-16',
    '6:00 AM - 7:00 AM',
    'Main Temple',
    'https://images.unsplash.com/photo-1580559367995-de97e6a783c6?auto=format&fit=crop&q=80&w=800',
    true,
    'Daily',
    'published'
  ),
  (
    'Diwali Celebration',
    'Grand Diwali celebration with special puja, lighting of lamps, and community gathering. Join us for this festival of lights with traditional sweets and prasad distribution.',
    '2025-10-31',
    '5:00 PM - 10:00 PM',
    'Temple Complex',
    'https://images.unsplash.com/photo-1605738513683-8ac67ba0515f?auto=format&fit=crop&q=80&w=800',
    false,
    NULL,
    'published'
  )
ON CONFLICT DO NOTHING;
