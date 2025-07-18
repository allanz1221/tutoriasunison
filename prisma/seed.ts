import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Limpiar datos existentes
  await prisma.preguntaRespuesta.deleteMany()

  // Insertar datos de ejemplo
  const preguntas = [
    {
      pregunta: "cual es el horario del bufete juridico en la union navojoa",
      respuesta: "El Bufete Jurídico Gratuito de la Universidad de Sonora, campus Navojoa (Unidad Regional Sur), tiene horario de atención presencial de lunes a viernes, en un horario aproximado de 8:00 a 14:00 horas. Por otra parte, según información del Departamento de Derecho en el campus Hermosillo (que suele armonizar horarios entre sedes), el horario general es de 8:30 a 14:30 horas de lunes a viernes. Para estar seguro, considera llegar entre las 8:00 y 8:30 h, y la atención finaliza entre las 14:00 y 14:30 h, dependiendo del flujo y coordinación de la sede Navojoa."
    },
    {
      pregunta: "como puedo crear un proyecto de vite con tailwind",
      respuesta: "Para crear un proyecto de Vite con Tailwind CSS, sigue estos pasos: 1) Crea un nuevo proyecto con Vite: npm create vite@latest my-project -- --template react-ts, 2) Navega al directorio: cd my-project, 3) Instala las dependencias: npm install, 4) Instala Tailwind CSS: npm install -D tailwindcss postcss autoprefixer, 5) Inicializa Tailwind: npx tailwindcss init -p, 6) Configura los archivos CSS y tailwind.config.js, 7) Ejecuta el servidor: npm run dev. ¡Y listo! Ya tienes un proyecto de Vite con Tailwind CSS configurado."
    },
    {
      pregunta: "que es next.js",
      respuesta: "Next.js es un framework de React que permite crear aplicaciones web del lado del servidor (SSR) y aplicaciones web estáticas. Ofrece características como renderizado del lado del servidor, generación de sitios estáticos, enrutamiento basado en archivos, optimización automática de imágenes, y más. Es muy popular para crear aplicaciones web modernas y escalables."
    },
    {
      pregunta: "como funciona prisma",
      respuesta: "Prisma es un ORM (Object-Relational Mapping) moderno para Node.js y TypeScript. Funciona de la siguiente manera: 1) Define tu esquema de base de datos en un archivo schema.prisma, 2) Genera automáticamente un cliente TypeScript basado en tu esquema, 3) Usa el cliente para realizar consultas a la base de datos de forma type-safe. Prisma soporta múltiples bases de datos como PostgreSQL, MySQL, SQLite, y más. Es muy popular por su excelente experiencia de desarrollador y su fuerte tipado."
    }
  ]

  for (const pregunta of preguntas) {
    await prisma.preguntaRespuesta.create({
      data: pregunta
    })
  }

  console.log('Datos de ejemplo insertados correctamente')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 