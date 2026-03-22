import type { CampaignId, Character, CharacterId } from "@campaign-platform/domain";

export interface CharacterRepository {
  getById(id: CharacterId): Promise<Character | null>;
  listByCampaign(campaignId: CampaignId): Promise<Character[]>;
  create(character: Character): Promise<void>;
  update(character: Character): Promise<void>;
}
