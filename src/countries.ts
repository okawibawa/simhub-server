import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { countryService } from "./services";

import { countryNameSearchSchema } from "./cores/validation";

const app = new Hono();

app.get("/", async (c) => {
  try {
    const countries = await countryService.getCountries();

    return c.json({ ok: true, message: "Data successfully fetched!", data: countries });
  } catch (error) {
    throw error;
  }
});

app.post(
  "/search",
  zValidator("form", countryNameSearchSchema, (result, c) => {
    if (!result.success) {
      return c.json({ ok: false, message: result.error.errors }, 400);
    }
  }),
  async (c) => {
    try {
      const countryName = c.req.valid("form");

      const countries = await countryService.getCountriesBySearch({ name: countryName.name });

      return c.json({ ok: true, message: "Data successfully fetched!", data: countries.rows });
    } catch (error) {
      throw error;
    }
  }
);

export default app;
