import { NextRequest, NextResponse } from "next/server";
import { signToken, setSessionCookie, comparePassword } from "@/lib/auth";
import { INITIAL_USER } from "@/lib/initial-data";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username dan password wajib diisi" },
        { status: 400 },
      );
    }

    // Verify against required admin credentials
    const isValidUser = username === INITIAL_USER.username;
    const isValidPass =
      password === INITIAL_USER.password ||
      (await comparePassword(password, INITIAL_USER.password));

    if (!isValidUser || !isValidPass) {
      return NextResponse.json(
        { message: "Username atau password salah" },
        { status: 401 },
      );
    }

    const payload = {
      userId: INITIAL_USER.id,
      username: INITIAL_USER.username,
      name: INITIAL_USER.name,
      role: INITIAL_USER.role,
    };

    const token = await signToken(payload);
    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: payload,
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Terjadi kesalahan internal" },
      { status: 500 },
    );
  }
}

