import type { CharacterKind, CharacterStatus } from "../enums";
import type { CampaignId, CharacterId } from "../ids";

export interface Character {
  id: CharacterId;
  campaignId: CampaignId;
  name: string;
  kind: CharacterKind;
  status: CharacterStatus;
  description: string | null;
  factionId: string | null;
  metadataJson: string | null;
  createdAt: string;
  updatedAt: string;
}
