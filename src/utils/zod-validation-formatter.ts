import { z } from "zod";

export const formatZodErrors = (errors: z.ZodIssue[]) => {
  const errorMap: Record<string, string[]> = {};

  errors.forEach((error) => {
    const path = error.path.join(".");
    if (!errorMap[path]) {
      errorMap[path] = [];
    }
    errorMap[path].push(error.message);
  });

  return errorMap;
};
