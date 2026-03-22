import type { CalendarId, CampaignId } from "../ids";

export interface Campaign {
  id: CampaignId;
  name: string;
  calendarId: CalendarId;
  currentDayIndex: number;
  createdAt: string;
  updatedAt: string;
}
