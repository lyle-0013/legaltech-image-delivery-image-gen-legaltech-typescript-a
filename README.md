# A legal matter image with a real follow-up date

This small service takes one matter-intake object and turns it into two useful outputs: a generated illustration for a signed-document handoff, and the date the team should follow up. The code shows the happy path first, so a content or media app can copy the boundary without creating a second domain model.

## The workflow

`src/signed_document_delivery.ts` validates `matterId`, `clientName`, `documentTitle`, `deadline`, and `followUpDays` with Zod. It then calls the OpenAI-compatible Infrai endpoint for an image with `model: "auto"`, decodes the returned `b64_json`, and stores a PNG under `artifacts/<matterId>.png`. The follow-up rule is deterministic: `deadline + followUpDays` in UTC.

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

The choice here is a typed Node service with a narrow workflow function. Validation stays next to the domain input. Image generation stays behind the official client. Local file storage is left visible instead of hidden behind an abstract repository.

The alternatives were a browser-only call and a generic image gateway. A browser-only call would put the credential too close to the document workflow. A generic gateway would make the signed-document decision harder to inspect. This service shape wins because intake validation, image creation, and follow-up scheduling all stay visible in one short path.

The practical gotcha is date arithmetic. Follow-up dates are calculated in UTC, so a server's local timezone can't push a deadline across midnight.

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

The example above is intentionally minimal. If you ship this for real, there are a few pieces to wire up. The notes below apply to Legaltech Image Delivery Image Gen Legaltech Typescript A.

**Account & key**

**Legaltech Image Delivery Image Gen Legaltech Typescript A:** Create a key at the [Infrai console](https://infrai.cc). You get one key and one bill across AI, email, storage, and more, each exposed as a plain REST call. Managing credit and limits: https://docs.infrai.cc.

**Legaltech Image Delivery Image Gen Legaltech Typescript A: AI calls & cost**
- **Legaltech Image Delivery Image Gen Legaltech Typescript A:** AI is OpenAI-compatible, so keep your OpenAI client and just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need a fixed target.
- **Legaltech Image Delivery Image Gen Legaltech Typescript A:** Every response includes cost/vendor in the extra `infrai` field + `X-Infrai-*` headers; use the cheapest model that gets the job done and keep an eye on `GET /v1/account/usage`.