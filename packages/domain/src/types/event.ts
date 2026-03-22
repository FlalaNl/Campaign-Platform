import type { EventTemporalState, EventVisibility } from "../enums";
import type { CampaignId, EventId, LocationId, ThreadId } from "../ids";

export interface Event {
  id: EventId;
  campaignId: CampaignId;
  title: string;
  summary: string | null;
  description: string | null;
  eventType: string | null;
  startDayIndex: number;
  endDayIndex: number | null;
  temporalState: EventTemporalState;
  visibility: EventVisibility;
  locationId: LocationId | null;
  threadId: ThreadId | null;
  parentEventId: EventId | null;
  createdAt: string;
  updatedAt: string;
}
