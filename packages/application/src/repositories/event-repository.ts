import type { CampaignId, CharacterId, Event, EventId } from "@campaign-platform/domain";

export interface EventRepository {
  getById(id: EventId): Promise<Event | null>;
  create(event: Event): Promise<void>;
  update(event: Event): Promise<void>;
  delete(eventId: EventId): Promise<void>;
  listByCampaign(campaignId: CampaignId): Promise<Event[]>;
  listStartingOnDay(campaignId: CampaignId, dayIndex: number): Promise<Event[]>;
  listEndingOnDay(campaignId: CampaignId, dayIndex: number): Promise<Event[]>;
  listActiveOnDay(campaignId: CampaignId, dayIndex: number): Promise<Event[]>;
  listByCharacter(campaignId: CampaignId, characterId: CharacterId): Promise<Event[]>;
}
