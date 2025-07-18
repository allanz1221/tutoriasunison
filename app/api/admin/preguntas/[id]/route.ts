import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { pregunta, respuesta } = await req.json()
  if (!pregunta || !respuesta) {
    return NextResponse.json({ error: "Pregunta y respuesta requeridas" }, { status: 400 })
  }
  await prisma.preguntaRespuesta.update({
    where: { id: Number(params.id) },
    data: { pregunta, respuesta }
  })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.preguntaRespuesta.delete({ where: { id: Number(params.id) } })
  return NextResponse.json({ ok: true })
} 