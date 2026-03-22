import type { CampaignId } from "@campaign-platform/domain";

export interface SetCurrentDayInput {
  campaignId: CampaignId;
  dayIndex: number;
}
