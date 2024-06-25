import { Hono } from "hono";

import { countryService } from "./services";

import { paramsEntity, paramsSchema } from "./entities/params.entity";

const app = new Hono();

app.get("/", async (c) => {
  try {
    const query = c.req.query();

    const schemasValidation = paramsSchema.partial().pick({
      limit: true,
    });

    const validatedQueries = schemasValidation.parse(query);

    const queries: Required<Pick<paramsEntity, "limit">> = {
      limit: validatedQueries.limit ?? 9,
    };

    const countries = await countryService.getCountries(queries);

    return c.json({ ok: true, message: "Data successfully fetched!", data: countries });
  } catch (error) {
    throw error;
  }
});

export default app;
