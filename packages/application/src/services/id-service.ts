import type {
  CalendarId,
  CampaignId,
  CharacterId,
  DayId,
  EventId,
  EventParticipantId,
} from "@campaign-platform/domain";

export interface IdService {
  newCampaignId(): CampaignId;
  newCalendarId(): CalendarId;
  newDayId(): DayId;
  newCharacterId(): CharacterId;
  newEventId(): EventId;
  newEventParticipantId(): EventParticipantId;
}
