import type { CampaignId, Day, DayId } from "@campaign-platform/domain";

export interface DayRepository {
  getById(id: DayId): Promise<Day | null>;
  getByCampaignAndDayIndex(campaignId: CampaignId, dayIndex: number): Promise<Day | null>;
  create(day: Day): Promise<void>;
  update(day: Day): Promise<void>;
  getOrCreate(campaignId: CampaignId, dayIndex: number, displayLabel?: string | null): Promise<Day>;
}
