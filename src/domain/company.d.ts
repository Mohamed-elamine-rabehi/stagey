/** @format */

interface Company {
  id: number;
  companyName: string;
  email: string;
  password: string;
  description?: string;
  longitude: number;
  latitude: number;
  address?: string;
  phoneNumber?: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}
