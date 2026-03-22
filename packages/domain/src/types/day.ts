import type { CampaignId, DayId, SessionId } from "../ids";

export interface Day {
  id: DayId;
  campaignId: CampaignId;
  dayIndex: number;
  displayLabel: string | null;
  summary: string | null;
  notes: string | null;
  sessionId: SessionId | null;
  createdAt: string;
  updatedAt: string;
}
