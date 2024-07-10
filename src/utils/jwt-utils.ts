import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

import { environment } from "../config";

interface jwtData {
  userId?: number;
  userEmail: string;
}

export const generateSesionId = () => {
  return uuid();
};

export const generateJwt = ({ userId, userEmail }: jwtData) => {
  return jwt.sign({ userId, userEmail }, environment.jwtSecret, { expiresIn: "1h" });
};

export const verifyJwt = (token: string): jwtData | null => {
  try {
    const decoded = jwt.verify(token, environment.jwtSecret) as jwtData;

    return decoded;
  } catch (error) {
    return null;
  }
};
