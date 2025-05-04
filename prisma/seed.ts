/** @format */

import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

// Type definitions for our data
type UserData = {
  fullName: string;
  email: string;
  password: string;
  educationLevel: string;
  specialty: string;
};

type CompanyData = {
  companyName: string;
  email: string;
  password: string;
  description?: string;
  longitude: number;
  latitude: number;
  address?: string;
  phoneNumber?: string;
  website?: string;
};

type PostData = {
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
};

const educationLevels = ["High School", "Bachelor", "Master", "PhD"];
const specialties = [
  "Software Engineering",
  "Data Science",
  "Cybersecurity",
  "Artificial Intelligence",
  "Web Development",
];
const skills = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C#",
  "React",
  "Angular",
  "Vue",
  "Node.js",
  "Express",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Docker",
  "Kubernetes",
];

async function main() {
  console.log("🌱 Seeding database...");

  // Create users
  const userData: UserData[] = Array.from({ length: 10 }, () => ({
    fullName: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    educationLevel: faker.helpers.arrayElement(educationLevels),
    specialty: faker.helpers.arrayElement(specialties),
  }));

  const users = await Promise.all(
    userData.map((data) => prisma.user.create({ data }))
  );
  console.log(`Created ${users.length} users`);

  // Create companies
  const companyData: CompanyData[] = Array.from({ length: 5 }, () => ({
    companyName: faker.company.name(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    description: faker.company.catchPhrase(),
    longitude: faker.location.longitude(),
    latitude: faker.location.latitude(),
    address: faker.location.streetAddress(),
    phoneNumber: faker.phone.number(),
    website: faker.internet.url(),
  }));

  const companies = await Promise.all(
    companyData.map((data) => prisma.company.create({ data }))
  );
  console.log(`Created ${companies.length} companies`);

  // Create posts
  const postData: PostData[] = Array.from({ length: 20 }, () => ({
    title: faker.person.jobTitle(),
    description: faker.lorem.paragraphs(3),
    startDate: faker.date.future(),
    endDate: faker.date.future({ refDate: new Date() }),
    longitude: faker.location.longitude(),
    latitude: faker.location.latitude(),
    specialty: faker.helpers.arrayElement(specialties),
    educationLevel: faker.helpers.arrayElement(educationLevels),
    skills: faker.helpers.arrayElements(skills, { min: 3, max: 6 }),
    companyId: faker.helpers.arrayElement(companies).id,
  }));

  const posts = await Promise.all(
    postData.map((data) => prisma.post.create({ data }))
  );
  console.log(`Created ${posts.length} posts`);

  // Create favorites
  const favorites = await Promise.all(
    users.flatMap((user) =>
      faker.helpers.arrayElements(posts, { min: 1, max: 5 }).map((post) =>
        prisma.favorite.create({
          data: {
            userId: user.id,
            postId: post.id,
          },
        })
      )
    )
  );
  console.log(`Created ${favorites.length} favorites`);

  // Create notifications
  const notifications = await Promise.all(
    users.flatMap((user) =>
      faker.helpers.arrayElements(posts, { min: 1, max: 3 }).map((post) =>
        prisma.notification.create({
          data: {
            userId: user.id,
            postId: post.id,
            message: `New job posting in ${post.specialty}: ${post.title}`,
            read: faker.datatype.boolean(),
          },
        })
      )
    )
  );
  console.log(`Created ${notifications.length} notifications`);

  console.log("✅ Database seeded successfully");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
