import type { CalendarType } from "../enums";
import type { CalendarId } from "../ids";

export interface Calendar {
  id: CalendarId;
  name: string;
  type: CalendarType;
  configJson: string;
  createdAt: string;
  updatedAt: string;
}
