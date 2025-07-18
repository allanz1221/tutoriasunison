import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest, { params }: { params: { folio: string } }) {
  try {
    const { pregunta, respuesta } = await req.json()
    if (!pregunta) {
      return NextResponse.json({ error: "Pregunta requerida" }, { status: 400 })
    }
    const historico = await prisma.chatHistorico.findUnique({ where: { folio: params.folio } })
    if (!historico) {
      return NextResponse.json({ error: "Folio no encontrado" }, { status: 404 })
    }
    const mensajes = Array.isArray(historico.mensajes) ? historico.mensajes : []
    
    // Si hay respuesta, actualizar el mensaje existente
    if (respuesta && respuesta.trim() !== "") {
      const mensajeIndex = mensajes.findIndex(m => m.pregunta === pregunta && (!m.respuesta || m.respuesta.trim() === ""))
      if (mensajeIndex !== -1) {
        mensajes[mensajeIndex] = { ...mensajes[mensajeIndex], respuesta }
      } else {
        return NextResponse.json({ error: "No se encontró la pregunta para responder" }, { status: 404 })
      }
    } else {
      // Si no hay respuesta, agregar nueva pregunta
      mensajes.push({ pregunta, respuesta: "" })
    }
    
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