
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const studentId = Number(id);

    if (!Number.isInteger(studentId) || studentId < 1) {
      return NextResponse.json({ error: "Invalid student ID" }, { status: 400 });
    }

    const body = await request.json();
    const { name, rollNumber, department, semester } = body;

    const student = await prisma.student.update({
      where: { id: studentId },
      data: { name, rollNumber, department, semester },
    });

    return NextResponse.json(student);
  } catch {
    return NextResponse.json({ error: "Could not update student" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const studentId = Number(id);

    if (!Number.isInteger(studentId) || studentId < 1) {
      return NextResponse.json({ error: "Invalid student ID" }, { status: 400 });
    }

    await prisma.student.delete({ where: { id: studentId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Could not delete student" }, { status: 500 });
  }
}
