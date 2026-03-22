import { and, eq } from "drizzle-orm";
import type { CampaignId, Day, DayId } from "@campaign-platform/domain";
import type { DayRepository } from "@campaign-platform/application";
import type { CampaignPlatformDatabase } from "../client/database";
import { daysTable } from "../schema";

export type DayFactory = (input: {
  campaignId: CampaignId;
  dayIndex: number;
  displayLabel: string | null;
}) => Promise<Day>;

export class SqliteDayRepository implements DayRepository {
  public constructor(
    private readonly db: CampaignPlatformDatabase,
    private readonly dayFactory?: DayFactory,
  ) {}

  public async getById(id: DayId): Promise<Day | null> {
    const rows = await this.db.select().from(daysTable).where(eq(daysTable.id, id)).limit(1);
    return rows[0] ?? null;
  }

  public async getByCampaignAndDayIndex(campaignId: CampaignId, dayIndex: number): Promise<Day | null> {
    const rows = await this.db
      .select()
      .from(daysTable)
      .where(and(eq(daysTable.campaignId, campaignId), eq(daysTable.dayIndex, dayIndex)))
      .limit(1);

    return rows[0] ?? null;
  }

  public async create(day: Day): Promise<void> {
    this.db.insert(daysTable).values(day).run();
  }

  public async update(day: Day): Promise<void> {
    this.db.update(daysTable).set(day).where(eq(daysTable.id, day.id)).run();
  }

  public async getOrCreate(
    campaignId: CampaignId,
    dayIndex: number,
    displayLabel: string | null = null,
  ): Promise<Day> {
    const existingDay = await this.getByCampaignAndDayIndex(campaignId, dayIndex);
    if (existingDay !== null) {
      return existingDay;
    }

    if (!this.dayFactory) {
      throw new Error("SqliteDayRepository requires a dayFactory for getOrCreate");
    }

    const newDay = await this.dayFactory({
      campaignId,
      dayIndex,
      displayLabel,
    });

    await this.create(newDay);
    return newDay;
  }
}
