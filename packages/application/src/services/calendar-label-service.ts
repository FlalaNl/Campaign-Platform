import type { Calendar } from "@campaign-platform/domain";

export interface CalendarLabelService {
  getDisplayLabel(calendar: Calendar, dayIndex: number): string;
}
