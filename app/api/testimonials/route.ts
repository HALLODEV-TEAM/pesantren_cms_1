import { NextRequest, NextResponse } from "next/server";
import {
  getTestimonials,
  createTestimonial,
  deleteTestimonial,
} from "@/lib/data-service";
import { getSession } from "@/lib/auth";

export async function GET() {
  const items = await getTestimonials();
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const created = await createTestimonial(body);
  return NextResponse.json(created, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }

  await deleteTestimonial(Number(id));
  return NextResponse.json({ success: true });
}

