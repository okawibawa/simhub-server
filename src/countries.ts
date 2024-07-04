import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { countryService } from "./services";

import { countriesSearchSchema, queriesEntity, queriesSchema } from "./entities";

const app = new Hono();

app.get("/", async (c) => {
  try {
    const query = c.req.query();

    const schemasValidation = queriesSchema.partial().pick({
      limit: true,
    });

    const validatedQueries = schemasValidation.parse(query);

    const queries: Required<Pick<queriesEntity, "limit">> = {
      limit: validatedQueries.limit ?? 12,
    };

    const countries = await countryService.getCountries(queries);

    return c.json({ ok: true, message: "Data successfully fetched!", data: countries });
  } catch (error) {
    throw error;
  }
});

app.post(
  "/search",
  zValidator("form", countriesSearchSchema, (result, c) => {
    if (!result.success) {
      return c.json({ ok: false, message: result.error.errors }, 400);
    }
  }),
  async (c) => {
    try {
      const countryName = c.req.valid("form");

      const countries = await countryService.getCountriesBySearch(countryName);

      return c.json({ ok: true, message: "Data successfully fetched!", data: countries.rows });
    } catch (error) {
      throw error;
    }
  }
);

export default app;
