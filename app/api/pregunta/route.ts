import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const { pregunta } = await req.json()
    
    if (!pregunta) {
      return NextResponse.json({ error: "Pregunta requerida" }, { status: 400 })
    }

    // Buscar coincidencias por inclusión (case-insensitive)
    const registros = await prisma.preguntaRespuesta.findMany({
      where: {
        pregunta: {
          contains: pregunta.trim(),
          mode: 'insensitive'
        }
      }
    })

    if (!registros || registros.length === 0) {
      return NextResponse.json({ 
        respuesta: null,
        mensaje: "No se encontró respuesta para esa pregunta." 
      })
    }

    // Concatenar todas las respuestas encontradas
    const respuestas = registros.map(r => r.respuesta).join("\n\n---\n\n")

    return NextResponse.json({ 
      respuesta: respuestas,
      ids: registros.map(r => r.id)
    })
  } catch (error) {
    console.error("Error en la API:", error)
    return NextResponse.json({ 
      error: "Error interno del servidor" 
    }, { status: 500 })
  }
} 