export type JournalEntry = {
  id: number;
  user_id: string;
  title: string;
  content: string;
  mood: string;
  mood_emoji: string;
  entry_type: "regular" | "special" | string; // extendable
  sentiment_label: "positive" | "neutral" | "negative" | string;
  sentiment_score: number;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
};
