import type { CampaignId, SessionId } from "../ids";

export interface Session {
  id: SessionId;
  campaignId: CampaignId;
  title: string;
  realWorldDate: string | null;
  startDayIndex: number | null;
  endDayIndex: number | null;
}
