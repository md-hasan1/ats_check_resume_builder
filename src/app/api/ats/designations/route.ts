import { NextRequest, NextResponse } from "next/server";
import {
  JOB_TEMPLATES,
  JOB_DEPARTMENTS,
  searchJobTemplates,
  getJobTemplateById,
  getJobTemplateByTitle,
} from "@/data/job-templates";

export const runtime = "nodejs";

/**
 * GET /api/ats/designations
 * Query parameters:
 * - query / search: string (designation or skill query)
 * - department: string (filter by department)
 * - id: string (fetch specific template by ID)
 * - title: string (fetch specific template by title)
 * - limit: number (default 25)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const title = searchParams.get("title");
    const query = searchParams.get("query") || searchParams.get("search") || "";
    const department = searchParams.get("department") || "All";
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10), 1), 100) : 25;

    // Direct ID lookup
    if (id) {
      const found = getJobTemplateById(id);
      if (!found) {
        return NextResponse.json(
          { success: false, error: `Designation template with ID '${id}' not found.` },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: found });
    }

    // Direct Title lookup
    if (title) {
      const found = getJobTemplateByTitle(title);
      if (!found) {
        return NextResponse.json(
          { success: false, error: `Designation template with title '${title}' not found.` },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: found });
    }

    // Filtered / Search list
    const results = searchJobTemplates(query, department, limit);

    return NextResponse.json({
      success: true,
      totalTemplates: JOB_TEMPLATES.length,
      count: results.length,
      departments: JOB_DEPARTMENTS,
      data: results,
    });
  } catch (error) {
    console.error("Error fetching designation templates:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch designation templates" },
      { status: 500 }
    );
  }
}

