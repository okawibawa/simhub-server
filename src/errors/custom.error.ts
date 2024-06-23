import { StatusCode } from "hono/utils/http-status";
import * as pg from "pg";

interface CustomError extends Error {
  name: string;
  code: StatusCode;
}

const createCustomError =
  (name: string) =>
  (message: string, code: StatusCode): Error => {
    const error = new Error(message) as CustomError;
    error.name = name;
    error.code = code;

    return error;
  };

export const DatabaseError = createCustomError("DatabaseError");
export const NotFoundError = createCustomError("NotFoundError");
export const ValidationError = createCustomError("ValidationError");
export const BadRequestError = createCustomError("BadRequestError");

export const isDatabaseError = (error: unknown): error is CustomError =>
  error instanceof Error && error.name === "DatabaseError";
export const isNotFoundError = (error: unknown): error is CustomError =>
  error instanceof Error && error.name === "NotFoundError";
export const isValidationError = (error: unknown): error is CustomError =>
  error instanceof Error && error.name === "ValidationError";
export const isBadRequestError = (error: unknown): error is CustomError =>
  error instanceof Error && error.name === "BadRequestError";
export const isPgDatabaseError = (error: unknown): error is pg.DatabaseError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error &&
    "severity" in error
  );
};
