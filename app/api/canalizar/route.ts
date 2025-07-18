import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { expediente, mensajes } = await req.json()
    if (!mensajes || !Array.isArray(mensajes)) {
      return NextResponse.json({ error: "Mensajes requeridos" }, { status: 400 })
    }
    const folio = uuidv4()
    const historico = await prisma.chatHistorico.create({
      data: {
        folio,
        expediente: expediente || null,
        mensajes
      }
    })
    return NextResponse.json({ folio })
  } catch (error) {
    console.error("Error en canalizar:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
} 