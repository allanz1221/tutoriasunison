import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const chats = await prisma.chatHistorico.findMany({
    select: {
      folio: true,
      createdAt: true
    },
    orderBy: { createdAt: "desc" }
  })
  return NextResponse.json({ chats })
} 