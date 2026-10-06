import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyPassword } from "@/lib/password"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (typeof body?.user !== "string" || typeof body?.pass !== "string" || body.pass.length > 1024) {
    return NextResponse.json({ error: "Datos de acceso inválidos" }, { status: 400 })
  }

  try {
    const usuario = await prisma.usuario.findUnique({ where: { usuario: body.user } })
    if (!usuario || usuario.rol !== "admin" || !verifyPassword(body.pass, usuario.passwordHash)) {
      return NextResponse.json({ error: "Usuario o contraseña incorrectos" }, { status: 401 })
    }
    return NextResponse.json({ usuario: usuario.usuario })
  } catch {
    return NextResponse.json({ error: "No se pudo iniciar sesión" }, { status: 500 })
  }
}
