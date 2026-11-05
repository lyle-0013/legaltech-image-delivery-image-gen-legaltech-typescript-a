import test from "node:test";
import assert from "node:assert/strict";
import { followUpDate, matterIntakeSchema } from "./signed_document_delivery.ts";

test("a signed-document deadline schedules the requested follow-up date", () => {
  const matter = matterIntakeSchema.parse({
    matterId: "matter-7",
    clientName: "Acme Counsel",
    documentTitle: "Engagement letter",
    deadline: "2026-12-28",
    followUpDays: 3
  });
  assert.equal(followUpDate(matter), "2026-12-31");
});
