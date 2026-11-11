import { NextRequest, NextResponse } from "next/server";
import { getCategories, createCategory, deleteCategory } from "@/lib/data-service";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || undefined;
  const categories = await getCategories(type);
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.name || !body.type) {
      return NextResponse.json(
        { error: "Nama dan jenis kategori wajib diisi" },
        { status: 400 }
      );
    }
    const newCategory = await createCategory({
      name: body.name,
      type: body.type,
    });
    return NextResponse.json({ success: true, data: newCategory });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Gagal membuat kategori" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const idStr = searchParams.get("id");
  if (!idStr) {
    return NextResponse.json({ error: "ID wajib disertakan" }, { status: 400 });
  }

  await deleteCategory(parseInt(idStr, 10));
  return NextResponse.json({ success: true });
}

