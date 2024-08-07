import { dbInstance } from "../db";

import * as schema from "../db/schema";

const seed = async () => {
  try {
    console.log("Seeding starts.");

    const db = dbInstance.getDbInstance();

    await db.delete(schema.orderItemsSchema);
    await db.delete(schema.esimsSchema);
    await db.delete(schema.countriesSchema);
    await db.delete(schema.ordersSchema);
    await db.delete(schema.usersSchema);
    await db.delete(schema.sessionSchema);

    await db.insert(schema.usersSchema).values([
      {
        id: 1,
        username: "Oka",
        email: "okaa.wibawa@gmail.com",
        password: "$2b$10$69xzUgrXTIS4cCt1fQF//eQONGwVVg6be9oYW4A4yGDCVjTZkHYfy", // for this seed example, the password is "Oka$111$Oka"
      },
      {
        id: 2,
        username: "Oka Wirawan",
        email: "okaawirawan@gmail.com",
        password: "$2b$10$42H2G3Ld8KPwEmD9PDWGPeCmQTpE9M7s0W/S6KiE2PxBMPnM5Nz.q", // for this seed example, the password is "Oka$222$Oka"
      },
    ]);
    await db.insert(schema.countriesSchema).values([
      { code: "JP", name: "Japan" },
      { code: "US", name: "United States" },
      { code: "AP_13", name: "13 Asian Countries" },
      { code: "US_CA", name: "United States/Canada" },
    ]);
    await db.insert(schema.esimsSchema).values([
      {
        id: 1,
        countryCode: "JP",
        dataUnit: "gb",
        dataAmount: 8,
        durationInDays: 8,
        plan: "unlimited",
        priceInUsd: "8",
        type: "roaming",
      },
      {
        id: 2,
        countryCode: "JP",
        dataUnit: "gb",
        dataAmount: 8,
        durationInDays: 10,
        plan: "quota",
        priceInUsd: "10",
        type: "local",
      },
      {
        id: 3,
        countryCode: "US",
        dataUnit: "gb",
        dataAmount: 8,
        durationInDays: 12,
        plan: "unlimited",
        priceInUsd: "12",
        type: "roaming",
      },
    ]);
    await db.insert(schema.ordersSchema).values([
      { id: 1, userId: 1 },
      { id: 2, userId: 1 },
      { id: 3, userId: 2 },
    ]);
    await db.insert(schema.orderItemsSchema).values([
      { orderId: 1, esimId: 1, quantity: 1 },
      { orderId: 2, esimId: 1, quantity: 1 },
      { orderId: 3, esimId: 3, quantity: 1 },
    ]);

    console.log("Seeding done.");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
