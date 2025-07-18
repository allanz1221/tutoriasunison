import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest, { params }: { params: { folio: string } }) {
  try {
    const { pregunta, respuesta } = await req.json()
    if (!pregunta || !respuesta) {
      return NextResponse.json({ error: "Pregunta y respuesta requeridas" }, { status: 400 })
    }
    const historico = await prisma.chatHistorico.findUnique({ where: { folio: params.folio } })
    if (!historico) {
      return NextResponse.json({ error: "Folio no encontrado" }, { status: 404 })
    }
    const mensajes = Array.isArray(historico.mensajes) ? historico.mensajes : []
    mensajes.push({ pregunta, respuesta })
    await prisma.chatHistorico.update({
      where: { folio: params.folio },
      data: { mensajes }
    })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Error al agregar mensaje al chat histórico:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function GET(req: NextRequest, { params }: { params: { folio: string } }) {
  try {
    const historico = await prisma.chatHistorico.findUnique({ where: { folio: params.folio } })
    if (!historico) {
      return NextResponse.json({ error: "Folio no encontrado" }, { status: 404 })
    }
    return NextResponse.json({ expediente: historico.expediente, mensajes: historico.mensajes })
  } catch (error) {
    console.error("Error al obtener el chat histórico:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
} 