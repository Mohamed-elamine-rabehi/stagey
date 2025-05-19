/** @format */

interface Notification {
  id: number;
  userId: number;
  postId?: number;
  message: string;
  read: boolean;
  createdAt: Date;
}
