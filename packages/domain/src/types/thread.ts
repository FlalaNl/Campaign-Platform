import type { CampaignId, ThreadId } from "../ids";

export interface Thread {
  id: ThreadId;
  campaignId: CampaignId;
  name: string;
}
