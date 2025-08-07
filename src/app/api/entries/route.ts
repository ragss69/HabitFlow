import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/entries - Get entries for a specific goal
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const goalId = searchParams.get("goalId");

    if (!goalId) {
      return NextResponse.json(
        { error: "Goal ID is required" },
        { status: 400 }
      );
    }

    const entries = await prisma.entry.findMany({
      where: {
        goalId,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error("Error fetching entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch entries" },
      { status: 500 }
    );
  }
}

// POST /api/entries - Create a new entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { goalId, date, data } = body;

    const entry = await prisma.entry.create({
      data: {
        goalId,
        date: new Date(date),
        data: JSON.stringify(data),
      },
    });

    // Update streak
    await updateStreak(goalId);

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("Error creating entry:", error);
    return NextResponse.json(
      { error: "Failed to create entry" },
      { status: 500 }
    );
  }
}

// Helper function to update streak
async function updateStreak(goalId: string) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if there's an entry for today
    const todayEntry = await prisma.entry.findFirst({
      where: {
        goalId,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });

    if (!todayEntry) return;

    // Get current streak
    const currentStreak = await prisma.streak.findUnique({
      where: { goalId },
    });

    // Check if there was an entry yesterday
    const yesterdayEntry = await prisma.entry.findFirst({
      where: {
        goalId,
        date: {
          gte: yesterday,
          lt: today,
        },
      },
    });

    let newCurrentStreak = 1;
    let newLongestStreak = currentStreak?.longestStreak || 0;

    if (yesterdayEntry && currentStreak) {
      newCurrentStreak = currentStreak.currentStreak + 1;
    }

    if (newCurrentStreak > newLongestStreak) {
      newLongestStreak = newCurrentStreak;
    }

    // Upsert streak
    await prisma.streak.upsert({
      where: { goalId },
      update: {
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        lastEntryDate: today,
      },
      create: {
        goalId,
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        lastEntryDate: today,
      },
    });
  } catch (error) {
    console.error("Error updating streak:", error);
  }
} 