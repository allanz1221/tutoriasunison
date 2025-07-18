import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  const preguntas = await prisma.preguntaRespuesta.findMany({
    select: { id: true, pregunta: true, respuesta: true },
    orderBy: { id: "desc" }
  })
  return NextResponse.json({ preguntas })
}

export async function POST(req: NextRequest) {
  const { pregunta, respuesta } = await req.json()
  if (!pregunta || !respuesta) {
    return NextResponse.json({ error: "Pregunta y respuesta requeridas" }, { status: 400 })
  }
  await prisma.preguntaRespuesta.create({ data: { pregunta, respuesta } })
  return NextResponse.json({ ok: true })
} 