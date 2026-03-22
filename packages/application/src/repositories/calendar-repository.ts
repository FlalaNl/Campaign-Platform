import type { Calendar, CalendarId } from "@campaign-platform/domain";

export interface CalendarRepository {
  getById(id: CalendarId): Promise<Calendar | null>;
  create(calendar: Calendar): Promise<void>;
}
