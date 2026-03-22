import type { ClockService } from "./clock-service";

export class SystemClockService implements ClockService {
  public nowIso(): string {
    return new Date().toISOString();
  }
}
