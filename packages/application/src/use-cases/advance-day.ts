import type { Day } from "@campaign-platform/domain";
import { NotFoundError, ValidationError } from "../errors/app-errors";
import type { AdvanceDayInput } from "../dto/advance-day-input";
import type { CalendarRepository } from "../repositories/calendar-repository";
import type { CampaignRepository } from "../repositories/campaign-repository";
import type { DayRepository } from "../repositories/day-repository";
import type { CalendarLabelService } from "../services/calendar-label-service";
import type { ClockService } from "../services/clock-service";
import type { UnitOfWork } from "../services/unit-of-work";
import { advanceDayInputSchema } from "../validation/advance-day-input-schema";

export interface AdvanceDayUseCase {
  execute(input: AdvanceDayInput): Promise<{ day: Day; currentDayIndex: number }>;
}

export class AdvanceDayService implements AdvanceDayUseCase {
  public constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly calendarRepository: CalendarRepository,
    private readonly dayRepository: DayRepository,
    private readonly clockService: ClockService,
    private readonly calendarLabelService: CalendarLabelService,
    private readonly unitOfWork: UnitOfWork,
  ) {}

  public async execute(input: AdvanceDayInput): Promise<{ day: Day; currentDayIndex: number }> {
    const parsedInput = advanceDayInputSchema.safeParse(input);

    if (!parsedInput.success) {
      throw new ValidationError(
        "Invalid advance day input",
        parsedInput.error.issues.map((issue) => issue.message),
      );
    }

    return this.unitOfWork.runInTransaction(async () => {
      const campaign = await this.campaignRepository.getById(parsedInput.data.campaignId);
      if (campaign === null) {
        throw new NotFoundError(`Campaign ${parsedInput.data.campaignId} was not found`);
      }

      const calendar = await this.calendarRepository.getById(campaign.calendarId);
      if (calendar === null) {
        throw new NotFoundError(`Calendar ${campaign.calendarId} was not found`);
      }

      const nextDayIndex = campaign.currentDayIndex + 1;
      const displayLabel = this.calendarLabelService.getDisplayLabel(calendar, nextDayIndex);
      const day = await this.dayRepository.getOrCreate(parsedInput.data.campaignId, nextDayIndex, displayLabel);

      await this.campaignRepository.setCurrentDay(
        parsedInput.data.campaignId,
        nextDayIndex,
        this.clockService.nowIso(),
      );

      return {
        day,
        currentDayIndex: nextDayIndex,
      };
    });
  }
}
