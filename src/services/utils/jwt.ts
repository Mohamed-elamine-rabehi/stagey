/** @format */

import jwt, { JwtPayload } from "jsonwebtoken";

export default class JWT {
  static generateToken(payload: any): string {
    return jwt.sign({ user: payload }, process.env.JWT_SECRET || "", {
      algorithm: "HS256",
      expiresIn: "7d",
    });
  }

  static verifyToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string, {
        algorithms: ["HS256"],
      });
      return decoded as JwtPayload;
    } catch (err) {
      return null;
    }
  }
}
