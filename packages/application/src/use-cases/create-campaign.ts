import type { Campaign, Calendar, Day } from "@campaign-platform/domain";
import { ConflictError, ValidationError } from "../errors/app-errors";
import type { CreateCampaignInput } from "../dto/create-campaign-input";
import type { CalendarRepository } from "../repositories/calendar-repository";
import type { CampaignRepository } from "../repositories/campaign-repository";
import type { DayRepository } from "../repositories/day-repository";
import type { CalendarLabelService } from "../services/calendar-label-service";
import type { ClockService } from "../services/clock-service";
import type { IdService } from "../services/id-service";
import type { UnitOfWork } from "../services/unit-of-work";
import { createCampaignInputSchema } from "../validation/create-campaign-input-schema";

export interface CreateCampaignUseCase {
  execute(input: CreateCampaignInput): Promise<{ campaignId: string }>;
}

export class CreateCampaignService implements CreateCampaignUseCase {
  public constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly calendarRepository: CalendarRepository,
    private readonly dayRepository: DayRepository,
    private readonly idService: IdService,
    private readonly clockService: ClockService,
    private readonly calendarLabelService: CalendarLabelService,
    private readonly unitOfWork: UnitOfWork,
  ) {}

  public async execute(input: CreateCampaignInput): Promise<{ campaignId: string }> {
    const parsedInput = createCampaignInputSchema.safeParse(input);

    if (!parsedInput.success) {
      throw new ValidationError(
        "Invalid create campaign input",
        parsedInput.error.issues.map((issue) => issue.message),
      );
    }

    return this.unitOfWork.runInTransaction(async () => {
      const currentDayIndex = parsedInput.data.currentDayIndex ?? 1;
      const timestamp = this.clockService.nowIso();
      const calendarId = this.idService.newCalendarId();
      const campaignId = this.idService.newCampaignId();
      const dayId = this.idService.newDayId();

      const calendar: Calendar = {
        id: calendarId,
        name: parsedInput.data.calendar.name,
        type: parsedInput.data.calendar.type,
        configJson: parsedInput.data.calendar.configJson ?? "{}",
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      const campaign: Campaign = {
        id: campaignId,
        name: parsedInput.data.name,
        calendarId,
        currentDayIndex,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      const day: Day = {
        id: dayId,
        campaignId,
        dayIndex: currentDayIndex,
        displayLabel: this.calendarLabelService.getDisplayLabel(calendar, currentDayIndex),
        summary: null,
        notes: null,
        sessionId: null,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      const existingCampaign = await this.campaignRepository.getById(campaignId);
      if (existingCampaign !== null) {
        throw new ConflictError(`Campaign ${campaignId} already exists`);
      }

      await this.calendarRepository.create(calendar);
      await this.campaignRepository.create(campaign);
      await this.dayRepository.create(day);

      return { campaignId };
    });
  }
}
