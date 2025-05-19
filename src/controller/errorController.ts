/** @format */

import { Request, Response, NextFunction } from "express";
import ExpressError from "../domain/Error";

export default class ErrorController {
    static errorMiddleware(
        err: any,
        req: Request,
        res: Response,
        next: NextFunction,
    ): void {
        const message = err.message || "Internal Server Error";
        console.error(err);

        if (err instanceof ExpressError) {
            const status = err.status || 500;
            const errors = err.errors;
            if (status === 500) {
                res.status(500).json({
                    status: "error",
                    message: "Internal Server Error",
                });
                return;
            }
            if (errors) {
                res.status(status).json({ status: "error", message, errors });
                return;
            }
            res.status(status).json({ status: "error", message });
            return;
        }

        res.status(500).json({
            status: "error",
            message: "Internal Server Error",
        });
        return;
    }
}
