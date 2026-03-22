import type { CharacterId, EventId, EventParticipant } from "@campaign-platform/domain";

export interface EventParticipantRepository {
  create(participant: EventParticipant): Promise<void>;
  createMany(participants: EventParticipant[]): Promise<void>;
  deleteByEventId(eventId: EventId): Promise<void>;
  listByEventId(eventId: EventId): Promise<EventParticipant[]>;
  listByCharacterId(characterId: CharacterId): Promise<EventParticipant[]>;
}
