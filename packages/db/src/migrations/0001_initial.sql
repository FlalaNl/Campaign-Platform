CREATE TABLE calendars (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('custom', 'gregorian', 'forgotten_realms')),
  config_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE campaigns (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  calendar_id TEXT NOT NULL,
  current_day_index INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (calendar_id) REFERENCES calendars(id)
);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL,
  title TEXT NOT NULL,
  real_world_date TEXT,
  start_day_index INTEGER,
  end_day_index INTEGER,
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
);

CREATE TABLE days (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL,
  day_index INTEGER NOT NULL,
  display_label TEXT,
  summary TEXT,
  notes TEXT,
  session_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES sessions(id),
  UNIQUE (campaign_id, day_index)
);

CREATE TABLE characters (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL,
  name TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('pc', 'npc')),
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'dead', 'retired', 'unknown')),
  description TEXT,
  faction_id TEXT,
  metadata_json TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
);

CREATE TABLE locations (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL,
  name TEXT NOT NULL,
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
);

CREATE TABLE threads (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL,
  name TEXT NOT NULL,
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
);

CREATE TABLE events (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  description TEXT,
  event_type TEXT,
  start_day_index INTEGER NOT NULL,
  end_day_index INTEGER,
  temporal_state TEXT NOT NULL CHECK (temporal_state IN ('planned', 'ongoing', 'resolved', 'cancelled')),
  visibility TEXT NOT NULL CHECK (visibility IN ('public', 'dm_only')),
  location_id TEXT,
  thread_id TEXT,
  parent_event_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
  FOREIGN KEY (location_id) REFERENCES locations(id),
  FOREIGN KEY (thread_id) REFERENCES threads(id),
  FOREIGN KEY (parent_event_id) REFERENCES events(id),
  CHECK (end_day_index IS NULL OR end_day_index >= start_day_index),
  CHECK (NOT (temporal_state = 'ongoing' AND end_day_index IS NOT NULL))
);

CREATE TABLE event_participants (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  character_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('participant', 'subject', 'instigator', 'witness', 'target', 'mentioned')),
  notes TEXT,
  is_primary INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
);

CREATE INDEX idx_days_campaign_day_index
  ON days (campaign_id, day_index);

CREATE INDEX idx_events_campaign_start_day
  ON events (campaign_id, start_day_index);

CREATE INDEX idx_events_campaign_end_day
  ON events (campaign_id, end_day_index);

CREATE INDEX idx_events_campaign_temporal_state
  ON events (campaign_id, temporal_state);

CREATE INDEX idx_event_participants_event_id
  ON event_participants (event_id);

CREATE INDEX idx_event_participants_character_id
  ON event_participants (character_id);
