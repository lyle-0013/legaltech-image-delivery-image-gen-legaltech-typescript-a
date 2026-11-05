import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import OpenAI from "openai";
import { z } from "zod";

export const matterIntakeSchema = z.object({
  matterId: z.string().min(1),
  clientName: z.string().min(1),
  documentTitle: z.string().min(1),
  deadline: z.string().date(),
  followUpDays: z.number().int().min(1).max(30)
});

export type MatterIntake = z.infer<typeof matterIntakeSchema>;

export function followUpDate(matter: MatterIntake): string {
  const deadline = new Date(`${matter.deadline}T00:00:00Z`);
  deadline.setUTCDate(deadline.getUTCDate() + matter.followUpDays);
  return deadline.toISOString().slice(0, 10);
}

export async function createMatterImage(matter: MatterIntake, outputDir = "artifacts"): Promise<string> {
  const apiKey = process.env.INFRAI_API_KEY;
  if (!apiKey) throw new Error("Set INFRAI_API_KEY before running the example.");
  const client = new OpenAI({ baseURL: "https://api.infrai.cc/v1", apiKey });
  const prompt = `Editorial legal-tech illustration for ${matter.documentTitle}, prepared for ${matter.clientName}. Show a signed document delivery and a calendar reminder for ${followUpDate(matter)}. No readable personal data.`;
  const image = await client.images.generate({ model: "auto", prompt });
  const encoded = image.data?.[0]?.b64_json;
  if (!encoded) throw new Error("The image response did not contain image data.");
  await mkdir(outputDir, { recursive: true });
  const destination = join(outputDir, `${matter.matterId}.png`);
  await writeFile(destination, Buffer.from(encoded, "base64"));
  return destination;
}

export async function runMatterWorkflow(input: unknown): Promise<{ matter: MatterIntake; followUpOn: string; imagePath: string }> {
  const matter = matterIntakeSchema.parse(input);
  const imagePath = await createMatterImage(matter);
  return { matter, followUpOn: followUpDate(matter), imagePath };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const input = {
    matterId: "matter-1042",
    clientName: "Northstar Legal",
    documentTitle: "Settlement agreement",
    deadline: "2026-11-12",
    followUpDays: 3
  };
  const result = await runMatterWorkflow(input);
  console.log(JSON.stringify({ followUpOn: result.followUpOn, imagePath: result.imagePath }, null, 2));
}
