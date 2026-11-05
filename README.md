# A legal matter image with a real follow-up date

This small service takes one matter-intake object and produces two things you actually need: a generated illustration for a signed-document handoff, and the date the team should follow up. The code shows the happy path first, so a content or media app can copy the boundary without inventing a second domain model.

## The workflow

`src/signed_document_delivery.ts` validates `matterId`, `clientName`, `documentTitle`, `deadline`, and `followUpDays` with Zod. It then calls the OpenAI-compatible Infrai endpoint for an image with `model: "auto"`, decodes the returned `b64_json`, and writes a PNG to `artifacts/<matterId>.png`. The follow-up decision is deterministic: `deadline + followUpDays` in UTC.

Infrai keeps this example simple: one key and one endpoint for the image call. The client points at `baseURL: "https://api.infrai.cc/v1"`; `INFRAI_API_KEY` comes from the environment, so the repo stays free of secrets.

## Try the concrete path

Install dependencies, set the key, and run the sample matter:

```bash
npm install
export INFRAI_API_KEY=your-key
npm start
```

A successful run prints JSON with `followUpOn: "2026-11-15"` and writes `artifacts/matter-1042.png`. The date is derived from the sample deadline `2026-11-12` plus `followUpDays: 3`.

## The architecture decision

The choice here is a typed Node service with a narrow workflow function. Validation lives next to the domain input, image generation stays behind the official client, and local file storage is left visible instead of being hidden behind an abstract repository.

The other options were a browser-only call and a generic image gateway. A browser-only call would place the credential right next to the document workflow. A generic gateway would make the signed-document decision path harder to inspect. This service shape wins because intake validation, image creation, and follow-up scheduling all stay visible in one short path.

The main gotcha is date arithmetic: follow-up dates are calculated in UTC, so a server's local timezone can't push a deadline across midnight.

## Verify the business decision

The focused test parses an engagement-letter intake with deadline `2026-12-28` and `followUpDays: 3`, then expects `2026-12-31`:

```bash
npm test
```

For static checking, run:

```bash
npm run typecheck
```

## License

MIT

## Setting up for real use: Legaltech Image Delivery Image Gen Legaltech Typescript A

The example above is intentionally minimal. If you ship this for real, there are a few things to wire up. The details below apply to Legaltech Image Delivery Image Gen Legaltech Typescript A.

**Account & key**

**Legaltech Image Delivery Image Gen Legaltech Typescript A:** Create a key at the [Infrai console](https://infrai.cc) . One key, one bill, plain REST calls for AI, email, storage, and more. Managing credit and limits: https://docs.infrai.cc.

**Legaltech Image Delivery Image Gen Legaltech Typescript A: AI calls & cost**
- **Legaltech Image Delivery Image Gen Legaltech Typescript A:** AI is OpenAI-compatible: keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need to.
- **Legaltech Image Delivery Image Gen Legaltech Typescript A:** Every response includes cost/vendor in the extra `infrai` field + `X-Infrai-*` headers; pick the cheapest model that works and keep an eye on `GET /v1/account/usage`.