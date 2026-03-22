import type { Campaign, CampaignId } from "@campaign-platform/domain";

export interface CampaignRepository {
  getById(id: CampaignId): Promise<Campaign | null>;
  create(campaign: Campaign): Promise<void>;
  update(campaign: Campaign): Promise<void>;
  setCurrentDay(campaignId: CampaignId, dayIndex: number, updatedAt: string): Promise<void>;
}
