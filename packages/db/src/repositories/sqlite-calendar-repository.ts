import { eq } from "drizzle-orm";
import type { Calendar, CalendarId } from "@campaign-platform/domain";
import type { CalendarRepository } from "@campaign-platform/application";
import type { CampaignPlatformDatabase } from "../client/database";
import { calendarsTable } from "../schema";

export class SqliteCalendarRepository implements CalendarRepository {
  public constructor(private readonly db: CampaignPlatformDatabase) {}

  public async getById(id: CalendarId): Promise<Calendar | null> {
    const rows = await this.db.select().from(calendarsTable).where(eq(calendarsTable.id, id)).limit(1);
    return rows[0] ?? null;
  }

  public async create(calendar: Calendar): Promise<void> {
    this.db.insert(calendarsTable).values(calendar).run();
  }
}
