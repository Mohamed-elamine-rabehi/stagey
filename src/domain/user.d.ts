/** @format */

interface User {
  id: number;
  fullName: string;
  email: string;
  password: string;
  educationLevel: string;
  specialty: string;
  favorites: Favorite[];
  notifications: Notification[];
  createdAt: Date;
  updatedAt: Date;
}
