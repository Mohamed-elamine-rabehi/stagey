/** @format */

import { typeToFlattenedError } from "zod";

export default class ExpressError extends Error {
  status?: number;
  errors?: typeToFlattenedError<any, string>;

  constructor(
    message: string,
    status?: number,
    errors?: typeToFlattenedError<any, string>
  ) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.name = "ExpressError";
  }
}
