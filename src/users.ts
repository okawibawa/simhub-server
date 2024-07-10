import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { authService } from "./services";
import { userService } from "./services";

import { idSchema } from "./cores/common";
import { userUsernameSchema, userSchema } from "./cores/validation";

const app = new Hono();

app.put(
  "/:id",
  zValidator("param", idSchema, (result, c) => {
    if (!result.success) {
      return c.json({ ok: false, message: result.error.errors }, 400);
    }
  }),
  zValidator("form", userSchema, (result, c) => {
    if (!result.success) {
      return c.json({ ok: false, message: result.error.errors }, 400);
    }
  }),
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      const body = c.req.valid("form");

      const updatedUser = await userService.updateUser(id, body);

      return c.json({ ok: true, message: "Data successfully updated!", data: updatedUser });
    } catch (error) {
      throw error;
    }
  }
);

export default app;
