import { NextRequest, NextResponse } from "next/server";
import { getProfile, updateProfile } from "@/lib/data-service";
import { getSession } from "@/lib/auth";

export async function GET() {
  const profile = await getProfile();
  return NextResponse.json(profile);
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const updated = await updateProfile(body);
  return NextResponse.json(updated);
}

