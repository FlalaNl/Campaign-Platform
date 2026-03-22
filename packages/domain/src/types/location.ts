import type { CampaignId, LocationId } from "../ids";

export interface Location {
  id: LocationId;
  campaignId: CampaignId;
  name: string;
}
