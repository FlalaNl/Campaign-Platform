import type { Calendar } from "@campaign-platform/domain";
import type { CalendarLabelService } from "./calendar-label-service";

export class DefaultCalendarLabelService implements CalendarLabelService {
  public getDisplayLabel(_calendar: Calendar, dayIndex: number): string {
    return `Day ${dayIndex}`;
  }
}
