import { PrismaClient } from "@prisma/client"
import { hashPassword } from "../lib/password"

const prisma = new PrismaClient()

async function main() {
  const password = process.env.ADMIN_PASSWORD
  if (!password) throw new Error("Configura ADMIN_PASSWORD para crear el administrador")
  const usuario = process.env.ADMIN_USERNAME || "admin"
  const passwordHash = hashPassword(password)
  await prisma.usuario.upsert({
    where: { usuario },
    create: { usuario, passwordHash, rol: "admin" },
    update: { passwordHash, rol: "admin" },
  })
  console.log(`Administrador ${usuario} configurado correctamente`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
