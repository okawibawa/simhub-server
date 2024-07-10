import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { esimService } from "./services";

import { idSchema } from "./cores/common";
import { countryCodeSchema } from "./cores/validation";

import { formatZodErrors } from "./utils";

const app = new Hono();

app.get(
  "/:code",
  zValidator("param", countryCodeSchema, (result, c) => {
    if (!result.success) {
      const formattedErrors = formatZodErrors(result.error.issues);
      return c.json({ ok: false, message: formattedErrors }, 400);
    }
  }),
  async (c) => {
    try {
      const countryCode = c.req.valid("param");

      const esimPlans = await esimService.getEsimPlans(countryCode);

      return c.json({ ok: true, message: "Data successfully fetched!", data: esimPlans.rows });
    } catch (error) {
      throw error;
    }
  }
);

app.get(
  "/plan-details/:id",
  zValidator("param", idSchema, (result, c) => {
    if (!result.success) {
      const formattedErrors = formatZodErrors(result.error.issues);
      return c.json({ ok: false, message: formattedErrors }, 400);
    }
  }),
  async (c) => {
    try {
      const { id } = c.req.valid("param");

      const esimPlans = await esimService.getEsimPlansById(id);

      return c.json({ ok: true, message: "Data successfully fetched!", data: esimPlans.rows });
    } catch (error) {
      throw error;
    }
  }
);

export default app;
