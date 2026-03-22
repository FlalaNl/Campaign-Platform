import { z } from "zod";

export const createCampaignInputSchema = z.object({
  name: z.string().trim().min(1, "Campaign name is required"),
  calendar: z.object({
    name: z.string().trim().min(1, "Calendar name is required"),
    type: z.enum(["custom", "gregorian", "forgotten_realms"]),
    configJson: z.string().optional(),
  }),
  currentDayIndex: z.number().int().min(1).optional(),
});
