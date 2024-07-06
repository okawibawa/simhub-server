import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { userService } from "./services";

import { idSchema } from "./cores/common";

const app = new Hono();

app.put(
  "/",
  zValidator("param", idSchema, (result, c) => {
    if (!result.success) {
      return c.json({ ok: false, message: result.error.errors }, 400);
    }
  }),
  async (c) => {
    try {
      const { id } = c.req.valid("param");

      console.log({ id });

      // const updatedUser = await userService.updateUser(id);

      return c.json({ ok: true, message: "Data successfully updated!", data: [] });
    } catch (error) {
      throw error;
    }
  }
);

export default app;
