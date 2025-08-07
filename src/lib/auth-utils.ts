import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function ensureUsersTable() {
  try {
    // Add logging
    console.log("Checking users table exists...");
    
    await prisma.$queryRaw`SELECT 1 FROM "users" LIMIT 1`;
    console.log("Users table exists");
    return true;
  } catch (error: any) {
    console.log("Error checking users table:", error.code, error.message);
    
    if (error.code === 'P2021' || error.code === '42P01' || error.code === 'P2010' || 
        error.message?.includes('relation "users" does not exist') ||
        error.message?.includes('does not exist')) {
      console.log("Users table doesn't exist, creating it...");
      try {
        await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "users" (
          "id" TEXT NOT NULL,
          "email" TEXT NOT NULL,
          "password" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "users_pkey" PRIMARY KEY ("id")
        )`;
        
        await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email")`;
        
        console.log("Users table created successfully");
        return true;
      } catch (createTableError) {
        console.error("Error creating users table:", createTableError);
        throw new Error("Database setup failed");
      }
    }
    throw error;
  }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  await ensureUsersTable();
  
  try {
    console.log("Searching for user with email:", email);
    const result = await prisma.$queryRaw<User[]>`
      SELECT * FROM "users" WHERE "email" = ${email} LIMIT 1
    `;
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Error finding user:", error);
    return null;
  }
}

export async function findUserById(id: string): Promise<User | null> {
  await ensureUsersTable();
  
  try {
    const result = await prisma.$queryRaw<User[]>`
      SELECT * FROM "users" WHERE "id" = ${id} LIMIT 1
    `;
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Error finding user by ID:", error);
    return null;
  }
}

export async function createUser(email: string, password: string, name: string): Promise<User> {
  await ensureUsersTable();
  
  const hashedPassword = await bcrypt.hash(password, 12);
  const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    await prisma.$executeRaw`
      INSERT INTO "users" ("id", "email", "password", "name", "createdAt", "updatedAt")
      VALUES (${userId}, ${email}, ${hashedPassword}, ${name}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;
    
    return {
      id: userId,
      email,
      password: hashedPassword,
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: string, email: string, name: string): string {
  const secret = process.env.JWT_SECRET || "secret";
  return jwt.sign({ userId, email, name }, secret, { expiresIn: "7d" });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
  } catch (error) {
    throw new Error("Invalid token");
  }
} 