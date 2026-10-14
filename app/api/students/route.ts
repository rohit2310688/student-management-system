

import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error("GET students error:", error);

    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, rollNumber, department, semester } = body;

    if (
      typeof name !== "string" || !name.trim() ||
      typeof rollNumber !== "string" || !rollNumber.trim() ||
      typeof department !== "string" || !department.trim() ||
      typeof semester !== "string" || !semester.trim()
    ) {
      return NextResponse.json(
        { error: "Name, roll number, department, and semester are required" },
        { status: 400 }
      );
    }

    const student = await prisma.student.create({
      data: {
        name: name.trim(),
        rollNumber: rollNumber.trim(),
        department: department.trim(),
        semester: semester.trim(),
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error("POST student error:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "This roll number already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 }
    );
  }
}
