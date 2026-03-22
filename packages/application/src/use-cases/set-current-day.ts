import { NotFoundError, ValidationError } from "../errors/app-errors";
import type { SetCurrentDayInput } from "../dto/set-current-day-input";
import type { CalendarRepository } from "../repositories/calendar-repository";
import type { CampaignRepository } from "../repositories/campaign-repository";
import type { DayRepository } from "../repositories/day-repository";
import type { CalendarLabelService } from "../services/calendar-label-service";
import type { ClockService } from "../services/clock-service";
import type { UnitOfWork } from "../services/unit-of-work";
import { setCurrentDayInputSchema } from "../validation/set-current-day-input-schema";

export interface SetCurrentDayUseCase {
  execute(input: SetCurrentDayInput): Promise<{ currentDayIndex: number }>;
}

export class SetCurrentDayService implements SetCurrentDayUseCase {
  public constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly calendarRepository: CalendarRepository,
    private readonly dayRepository: DayRepository,
    private readonly clockService: ClockService,
    private readonly calendarLabelService: CalendarLabelService,
    private readonly unitOfWork: UnitOfWork,
  ) {}

  public async execute(input: SetCurrentDayInput): Promise<{ currentDayIndex: number }> {
    const parsedInput = setCurrentDayInputSchema.safeParse(input);

    if (!parsedInput.success) {
      throw new ValidationError(
        "Invalid set current day input",
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

      const displayLabel = this.calendarLabelService.getDisplayLabel(calendar, parsedInput.data.dayIndex);
      await this.dayRepository.getOrCreate(parsedInput.data.campaignId, parsedInput.data.dayIndex, displayLabel);
      await this.campaignRepository.setCurrentDay(
        parsedInput.data.campaignId,
        parsedInput.data.dayIndex,
        this.clockService.nowIso(),
      );

      return { currentDayIndex: parsedInput.data.dayIndex };
    });
  }
}
