import type { EventTemporalState } from "../enums";
import type { Event } from "../types/event";

export const isEventActiveOnDay = (event: Event, dayIndex: number): boolean => {
  if (event.temporalState === "cancelled") {
    return false;
  }

  if (event.startDayIndex > dayIndex) {
    return false;
  }

  if (event.endDayIndex === null) {
    return true;
  }

  return event.endDayIndex >= dayIndex;
};

export const doesEventStartOnDay = (event: Event, dayIndex: number): boolean =>
  event.startDayIndex === dayIndex;

export const doesEventEndOnDay = (event: Event, dayIndex: number): boolean => {
  if (event.temporalState === "cancelled") {
    return false;
  }

  return event.endDayIndex === dayIndex;
};

export const validateEventTemporalShape = (input: {
  startDayIndex: number;
  endDayIndex: number | null;
  temporalState: EventTemporalState;
}): string[] => {
  const errors: string[] = [];

  if (!Number.isInteger(input.startDayIndex)) {
    errors.push("startDayIndex must be an integer");
  }

  if (input.endDayIndex !== null && !Number.isInteger(input.endDayIndex)) {
    errors.push("endDayIndex must be an integer when provided");
  }

  if (input.endDayIndex !== null && input.endDayIndex < input.startDayIndex) {
    errors.push("endDayIndex cannot be before startDayIndex");
  }

  if (input.temporalState === "ongoing" && input.endDayIndex !== null) {
    errors.push("ongoing events cannot have an endDayIndex");
  }

  return errors;
};
