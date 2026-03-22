import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  AdvanceDayService,
  CreateCampaignService,
  DefaultCalendarLabelService,
  DefaultIdService,
  SetCurrentDayService,
  SystemClockService,
  ValidationError,
} from "@campaign-platform/application";
import {
  createDatabaseClient,
  SqliteCalendarRepository,
  SqliteCampaignRepository,
  SqliteDayRepository,
  SqliteUnitOfWork,
} from "@campaign-platform/db";

const migrationPath = fileURLToPath(new URL("../migrations/0001_initial.sql", import.meta.url));
const migrationSql = readFileSync(migrationPath, "utf8");

const createFixture = async () => {
  const client = await createDatabaseClient();
  client.sqlite.run(migrationSql);

  const idService = new DefaultIdService();
  const clockService = new SystemClockService();
  const calendarLabelService = new DefaultCalendarLabelService();
  const dayRepository = new SqliteDayRepository(client.db, async ({ campaignId, dayIndex, displayLabel }) => {
    const timestamp = clockService.nowIso();

    return {
      id: idService.newDayId(),
      campaignId,
      dayIndex,
      displayLabel,
      summary: null,
      notes: null,
      sessionId: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  });

  return {
    client,
    createCampaign: new CreateCampaignService(
      new SqliteCampaignRepository(client.db),
      new SqliteCalendarRepository(client.db),
      dayRepository,
      idService,
      clockService,
      calendarLabelService,
      new SqliteUnitOfWork(client),
    ),
    setCurrentDay: new SetCurrentDayService(
      new SqliteCampaignRepository(client.db),
      new SqliteCalendarRepository(client.db),
      dayRepository,
      clockService,
      calendarLabelService,
      new SqliteUnitOfWork(client),
    ),
    advanceDay: new AdvanceDayService(
      new SqliteCampaignRepository(client.db),
      new SqliteCalendarRepository(client.db),
      dayRepository,
      clockService,
      calendarLabelService,
      new SqliteUnitOfWork(client),
    ),
    dayRepository,
    campaignRepository: new SqliteCampaignRepository(client.db),
  };
};

describe("Milestone 1 headless campaign/time core", () => {
  it("creates a campaign with a calendar and initial day record", async () => {
    const fixture = await createFixture();

    const result = await fixture.createCampaign.execute({
      name: "The Long Road",
      calendar: {
        name: "Default Calendar",
        type: "custom",
      },
      currentDayIndex: 1,
    });

    const campaign = await fixture.campaignRepository.getById(result.campaignId);
    const day = campaign
      ? await fixture.dayRepository.getByCampaignAndDayIndex(campaign.id, campaign.currentDayIndex)
      : null;

    expect(campaign).not.toBeNull();
    expect(campaign?.currentDayIndex).toBe(1);
    expect(campaign?.id.startsWith("cmp_")).toBe(true);
    expect(day?.displayLabel).toBe("Day 1");
  });

  it("sets the current day and creates a day record when missing", async () => {
    const fixture = await createFixture();
    const created = await fixture.createCampaign.execute({
      name: "The Long Road",
      calendar: {
        name: "Default Calendar",
        type: "custom",
      },
    });

    const updated = await fixture.setCurrentDay.execute({
      campaignId: created.campaignId,
      dayIndex: 7,
    });

    const campaign = await fixture.campaignRepository.getById(created.campaignId);
    const day = await fixture.dayRepository.getByCampaignAndDayIndex(created.campaignId, 7);

    expect(updated.currentDayIndex).toBe(7);
    expect(campaign?.currentDayIndex).toBe(7);
    expect(day?.displayLabel).toBe("Day 7");
  });

  it("advances the current day and creates the next day if needed", async () => {
    const fixture = await createFixture();
    const created = await fixture.createCampaign.execute({
      name: "The Long Road",
      calendar: {
        name: "Default Calendar",
        type: "custom",
      },
      currentDayIndex: 1,
    });

    const advanced = await fixture.advanceDay.execute({
      campaignId: created.campaignId,
    });

    const campaign = await fixture.campaignRepository.getById(created.campaignId);

    expect(advanced.currentDayIndex).toBe(2);
    expect(advanced.day.dayIndex).toBe(2);
    expect(advanced.day.displayLabel).toBe("Day 2");
    expect(campaign?.currentDayIndex).toBe(2);
  });

  it("rejects invalid create campaign input", async () => {
    const fixture = await createFixture();

    await expect(
      fixture.createCampaign.execute({
        name: "",
        calendar: {
          name: "Default Calendar",
          type: "custom",
        },
      }),
    ).rejects.toBeInstanceOf(ValidationError);
  });
});
