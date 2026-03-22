export type CalendarType = "custom" | "gregorian" | "forgotten_realms";

export type CharacterKind = "pc" | "npc";

export type CharacterStatus =
  | "active"
  | "inactive"
  | "dead"
  | "retired"
  | "unknown";

export type EventTemporalState =
  | "planned"
  | "ongoing"
  | "resolved"
  | "cancelled";

export type EventVisibility = "public" | "dm_only";

export type EventParticipantRole =
  | "participant"
  | "subject"
  | "instigator"
  | "witness"
  | "target"
  | "mentioned";
