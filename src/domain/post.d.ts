/** @format */

interface Post {
  id: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  longitude: number;
  latitude: number;
  specialty: string;
  educationLevel: string;
  skills: string[];
  companyId: number;
  createdAt: Date;
  updatedAt: Date;
}
