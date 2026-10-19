import { NextRequest, NextResponse } from "next/server";
import { getAIProvider } from "@/lib/ai/provider";

export async function POST(req: NextRequest) {
  try {
    const { role, location, experience } = await req.json();

    if (!role || !location) {
      return NextResponse.json(
        { success: false, error: "Role and location are required" },
        { status: 400 }
      );
    }

    const aiProvider = getAIProvider();
    const result = await aiProvider.getSalaryInsights(
      role,
      location,
      experience || "Mid-Level (3-5 yrs)"
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Salary insights error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to estimate salary benchmarks" },
      { status: 500 }
    );
  }
}
