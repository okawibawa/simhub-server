import { z } from "zod";

export const countryCodeSchema = z.object({
  code: z.string().trim().min(2, { message: "Minimum of 3 characters." }),
});

export const countryNameSearchSchema = z.object({
  name: z.string().trim(),
});

export type countryCodeParamsData = z.infer<typeof countryCodeSchema>;
export type countryNameSearchParamsData = z.infer<typeof countryNameSearchSchema>;
