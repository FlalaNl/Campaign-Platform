import { z } from "zod";

export const setCurrentDayInputSchema = z.object({
  campaignId: z.string().trim().min(1, "campaignId is required"),
  dayIndex: z.number().int().min(1, "dayIndex must be at least 1"),
});
