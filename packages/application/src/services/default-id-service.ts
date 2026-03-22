import { randomUUID } from "node:crypto";
import type {
  CalendarId,
  CampaignId,
  CharacterId,
  DayId,
  EventId,
  EventParticipantId,
} from "@campaign-platform/domain";
import type { IdService } from "./id-service";

const createPrefixedId = <T extends string>(prefix: string): T =>
  `${prefix}${randomUUID().replace(/-/g, "")}` as T;

export class DefaultIdService implements IdService {
  public newCampaignId(): CampaignId {
    return createPrefixedId<CampaignId>("cmp_");
  }

  public newCalendarId(): CalendarId {
    return createPrefixedId<CalendarId>("cal_");
  }

  public newDayId(): DayId {
    return createPrefixedId<DayId>("day_");
  }

  public newCharacterId(): CharacterId {
    return createPrefixedId<CharacterId>("chr_");
  }

  public newEventId(): EventId {
    return createPrefixedId<EventId>("evt_");
  }

  public newEventParticipantId(): EventParticipantId {
    return createPrefixedId<EventParticipantId>("evp_");
  }
}
