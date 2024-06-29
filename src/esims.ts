import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { esimService } from "./services";

import { esimPlansParamsSchema, esimPlanDetailsParamsSchema } from "./entities";

const app = new Hono();

app.get(
  "/:code",
  zValidator("param", esimPlansParamsSchema, (result, c) => {
    if (!result.success) {
      return c.json({ ok: false, message: result.error.errors }, 400);
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
  zValidator("param", esimPlanDetailsParamsSchema, (result, c) => {
    if (!result.success) {
      return c.json({ ok: false, message: result.error.errors }, 400);
    }
  }),
  async (c) => {
    try {
      const id = c.req.valid("param");

      const esimPlans = await esimService.getEsimPlansById(id);

      return c.json({ ok: true, message: "Data successfully fetched!", data: esimPlans.rows });
    } catch (error) {
      throw error;
    }
  }
);

export default app;
