import { Hono } from "hono";

import { countryService } from "./services";

import { queriesEntity, queriesSchema } from "./entities";

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

export default app;
