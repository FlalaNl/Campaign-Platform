import { eq } from "drizzle-orm";
import type { Campaign, CampaignId } from "@campaign-platform/domain";
import type { CampaignRepository } from "@campaign-platform/application";
import type { CampaignPlatformDatabase } from "../client/database";
import { campaignsTable } from "../schema";

export class SqliteCampaignRepository implements CampaignRepository {
  public constructor(private readonly db: CampaignPlatformDatabase) {}

  public async getById(id: CampaignId): Promise<Campaign | null> {
    const rows = await this.db.select().from(campaignsTable).where(eq(campaignsTable.id, id)).limit(1);
    return rows[0] ?? null;
  }

  public async create(campaign: Campaign): Promise<void> {
    this.db.insert(campaignsTable).values(campaign).run();
  }

  public async update(campaign: Campaign): Promise<void> {
    this.db.update(campaignsTable).set(campaign).where(eq(campaignsTable.id, campaign.id)).run();
  }

  public async setCurrentDay(campaignId: CampaignId, dayIndex: number, updatedAt: string): Promise<void> {
    this.db
      .update(campaignsTable)
      .set({ currentDayIndex: dayIndex, updatedAt })
      .where(eq(campaignsTable.id, campaignId))
      .run();
  }
}
