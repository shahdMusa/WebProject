import { NextResponse } from "next/server";
import { getStatistics } from "../../../lib/repository/statsRepo";

export async function GET() {
  try {
    const stats = await getStatistics();
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}