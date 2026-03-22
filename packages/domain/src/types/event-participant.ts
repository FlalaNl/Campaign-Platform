import type { EventParticipantRole } from "../enums";
import type { CharacterId, EventId, EventParticipantId } from "../ids";

export interface EventParticipant {
  id: EventParticipantId;
  eventId: EventId;
  characterId: CharacterId;
  role: EventParticipantRole;
  notes: string | null;
  isPrimary: boolean;
  createdAt: string;
}
