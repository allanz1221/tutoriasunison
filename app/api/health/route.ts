import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Verificar variables de entorno
    const envCheck = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      NODE_ENV: process.env.NODE_ENV
    }
    
    console.log("Verificando variables de entorno:", envCheck)
    
    // Verificar conexión a la base de datos
    await prisma.$connect()
    console.log("Conexión a BD exitosa")
    
    // Verificar que las tablas existan
    const count = await prisma.chatHistorico.count()
    console.log("Registros en ChatHistorico:", count)
    
    return NextResponse.json({
      status: "ok",
      environment: envCheck,
      database: "connected",
      records: count
    })
  } catch (error) {
    console.error("Error en health check:", error)
    return NextResponse.json({
      status: "error",
      message: error.message,
      environment: {
        DATABASE_URL: !!process.env.DATABASE_URL,
        NODE_ENV: process.env.NODE_ENV
      }
    }, { status: 500 })
  }
}
