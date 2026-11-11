import { NextRequest, NextResponse } from "next/server";
import { getArticles, createArticle } from "@/lib/data-service";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;
  const search = searchParams.get("search") || undefined;
  const isFeatured = searchParams.has("isFeatured")
    ? searchParams.get("isFeatured") === "true"
    : undefined;
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit")!)
    : undefined;

  const articles = await getArticles({ category, search, isFeatured, limit });
  return NextResponse.json(articles);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const created = await createArticle(body);
  return NextResponse.json(created, { status: 201 });
}

