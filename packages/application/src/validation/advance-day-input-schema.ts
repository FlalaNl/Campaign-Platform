import { z } from "zod";

export const advanceDayInputSchema = z.object({
  campaignId: z.string().trim().min(1, "campaignId is required"),
});
