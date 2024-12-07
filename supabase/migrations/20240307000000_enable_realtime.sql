ALTER TABLE user_progress REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE user_progress;