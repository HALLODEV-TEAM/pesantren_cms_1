import { NextRequest, NextResponse } from "next/server";
import {
  getRegistrations,
  createRegistration,
  updateRegistrationStatus,
  deleteRegistration,
} from "@/lib/data-service";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;
  const search = searchParams.get("search") || undefined;

  const items = await getRegistrations({ status, search });
  return NextResponse.json(items);
}

// Public can submit registration online
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      !body.fullName ||
      !body.gender ||
      !body.birthPlace ||
      !body.birthDate ||
      !body.programChoice ||
      !body.parentName ||
      !body.parentPhone
    ) {
      return NextResponse.json(
        { message: "Mohon lengkapi formulir pendaftaran wajib." },
        { status: 400 },
      );
    }

    const created = await createRegistration(body);
    return NextResponse.json(
      {
        success: true,
        message: "Pendaftaran berhasil dikirim!",
        data: created,
      },
      { status: 201 },
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Gagal menyimpan pendaftaran" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id, status, notes } = body;
  const updated = await updateRegistrationStatus(Number(id), status, notes);
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

  await deleteRegistration(Number(id));
  return NextResponse.json({ success: true });
}

