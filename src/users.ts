import { Hono } from "hono";

import { userService } from "./services";

const app = new Hono();

app.put("/", async (c) => {
  try {
    const user = await c.req.json();

    const updatedUser = await userService.updateUser(user.id);

    return c.json({ ok: true, message: "Data successfully updated!", data: updatedUser });
  } catch (error) {
    throw error;
  }
});

export default app;
