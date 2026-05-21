-- PowNed Redactie Agent — Seed data
-- RSS feeds en bronnen

insert into sources (name, url, type, active) values
  ('NOS Nieuws Algemeen',   'https://feeds.nos.nl/nosnieuwsalgemeen',                  'rss', true),
  ('RTL Nieuws',            'https://www.rtlnieuws.nl/rss.xml',                        'rss', true),
  ('De Telegraaf',          'https://www.telegraaf.nl/rss',                            'rss', true),
  ('AD Nieuws',             'https://www.ad.nl/nieuws/rss.xml',                        'rss', true),
  ('Omroep Gelderland',     'https://www.omroepgelderland.nl/rss/nieuws',              'rss', true),
  ('RTV Utrecht',           'https://www.rtvutrecht.nl/rss/nieuws.rss',               'rss', true),
  ('Omroep Brabant',        'https://www.omroepbrabant.nl/rss',                       'rss', true),
  ('Reddit r/netherlands',  'https://www.reddit.com/r/netherlands/new/.rss',          'reddit', true),
  ('Reddit r/politiek',     'https://www.reddit.com/r/politiek/new/.rss',             'reddit', true)
on conflict (url) do nothing;
