import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { v4 as uuidv4 } from "uuid"

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
        mensajes: mensajes as any
      }
    })
    
    return NextResponse.json({ folio })
  } catch (error) {
    console.error("Error en canalizar:", error)
    return NextResponse.json({ 
      error: "Error interno del servidor",
      details: error.message
    }, { status: 500 })
  }
} 