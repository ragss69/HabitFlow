import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/auth-utils";

const prisma = new PrismaClient();

// GET /api/goals - Get all goals
export async function GET() {
  try {
    console.log("API: Fetching goals...");
    
    const goals = await prisma.goal.findMany({
      include: {
        components: true,
        streak: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("API: Found goals:", goals);
    console.log("API: Goals count:", goals.length);

    return NextResponse.json(goals);
  } catch (error) {
    console.error("API: Error fetching goals:", error);
    
    // If it's a table doesn't exist error, return empty array
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2021') {
      console.log("API: Table doesn't exist, returning empty array");
      return NextResponse.json([]);
    }
    
    // For any other error, also return empty array to show empty state
    console.log("API: Other error, returning empty array");
    return NextResponse.json([]);
  }
}

// POST /api/goals - Create a new goal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title, 
      description, 
      goalType, 
      unit, 
      targetPerDay, 
      checklistItems, 
      completionLogic
    } = body;

    // Extract userId from JWT token (Authorization header or cookies)
    let userId;
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      try {
        const decoded = verifyToken(token);
        userId = decoded.userId;
      } catch (err) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
    } else {
      // Try to get token from cookies
      const token = request.cookies.get("token")?.value;
      if (token) {
        try {
          const decoded = verifyToken(token);
          userId = decoded.userId;
        } catch (err) {
          return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
      }
    }
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate default color and icon based on goal type
    const defaultColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444'];
    const defaultIcons = ['🎯', '💪', '🧠', '🏃‍♂️', '📚', '💡'];
    const randomIndex = Math.floor(Math.random() * defaultColors.length);

    const goal = await prisma.goal.create({
      data: {
        name: title,
        description,
        color: defaultColors[randomIndex],
        icon: defaultIcons[randomIndex],
        goalType,
        unit: goalType === 'quantitative' ? unit : null,
        targetPerDay: goalType === 'quantitative' ? targetPerDay : null,
        checklistItems: goalType === 'checklist' ? JSON.stringify(checklistItems) : null,
        completionLogic: goalType === 'checklist' ? completionLogic : 'all',
        userId: userId,
      },
      include: {
        components: true,
        streak: true,
      },
    });

    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    console.error("Error creating goal:", error);
    return NextResponse.json(
      { error: "Failed to create goal" },
      { status: 500 }
    );
  }
} 