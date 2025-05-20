/** @format */

import { Request, Response } from "express";
import { NotificationService } from "../services/notification.service";
import ExpressError from "../domain/Error";

export class NotificationController {
  static async getUserNotifications(req: Request, res: Response) {
    const userId = (req.user as any).id;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const specialty = req.query.specialty as string | undefined;
    res.json(await NotificationService.getUserNotifications(userId, page, specialty));
  }


  static async markAsRead(req: Request, res: Response) {
    const userId = (req.user as any).id;
    const notificationId = parseInt(req.params.notificationId);
    if (isNaN(notificationId))
      throw new ExpressError("Invalid notification ID", 400);

    res.json(await NotificationService.markAsRead(notificationId, userId));
  }
}
