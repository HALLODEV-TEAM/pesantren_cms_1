import { NextRequest, NextResponse } from "next/server";
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from "@/lib/data-service";
import { getSession } from "@/lib/auth";

export async function GET() {
  const banners = await getBanners();
  return NextResponse.json(banners);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const created = await createBanner(body);
  return NextResponse.json(created, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id, ...data } = body;
  const updated = await updateBanner(Number(id), data);
  return NextResponse.json(updated);
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

  await deleteBanner(Number(id));
  return NextResponse.json({ success: true });
}

