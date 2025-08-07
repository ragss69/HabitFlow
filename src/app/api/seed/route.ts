import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {
    // Create default goals
    const defaultGoals = [
      {
        name: "Study",
        description: "Track your learning progress",
        color: "#3B82F6",
        icon: "BookOpen",
        isDefault: true,
      },
      {
        name: "Gym",
        description: "Monitor your fitness journey",
        color: "#10B981",
        icon: "Dumbbell",
        isDefault: true,
      },
      {
        name: "Water",
        description: "Stay hydrated daily",
        color: "#06B6D4",
        icon: "Droplets",
        isDefault: true,
      },
    ];

    const createdGoals = [];
    
    for (const goalData of defaultGoals) {
      const goal = await prisma.goal.create({
        data: goalData,
      });
      createdGoals.push(goal);
    }

    return NextResponse.json({
      message: "Database seeded successfully",
      goals: createdGoals,
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
} 