import type { CalendarType } from "@campaign-platform/domain";

export interface CreateCampaignInput {
  name: string;
  calendar: {
    name: string;
    type: CalendarType;
    configJson?: string;
  };
  currentDayIndex?: number;
}
