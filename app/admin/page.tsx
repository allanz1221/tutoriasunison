"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")
  const [error, setError] = useState("")
  const [logged, setLogged] = useState(false)
  const [chats, setChats] = useState<any[]>([])
  const router = useRouter()
  const [section, setSection] = useState<'chats' | 'preguntas'>("chats")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (user === "admin" && pass === "admin") {
      setLogged(true)
      setError("")
      // Cargar chats
      const res = await fetch("/api/admin/chats")
      if (res.ok) {
        const data = await res.json()
        setChats(data.chats)
      }
    } else {
      setError("Usuario o contraseña incorrectos")
    }
  }

  if (!logged) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md flex flex-col gap-4 w-80">
          <h2 className="text-xl font-bold mb-2">Admin Login</h2>
          <input
            className="border p-2 rounded"
            placeholder="Usuario"
            value={user}
            onChange={e => setUser(e.target.value)}
            autoFocus
          />
          <input
            className="border p-2 rounded"
            placeholder="Contraseña"
            type="password"
            value={pass}
            onChange={e => setPass(e.target.value)}
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button className="bg-gray-800 text-white rounded p-2 mt-2" type="submit">Entrar</button>
        </form>
      </div>
    )
  }

  return (
    <div className="p-8">
      <nav className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${section === 'chats' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setSection('chats')}
        >
          Chats
        </button>
        <button
          className={`px-4 py-2 rounded ${section === 'preguntas' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => router.push('/admin/preguntas')}
        >
          Preguntas y respuestas
        </button>
      </nav>
      {section === 'chats' && (
        <>
          <h1 className="text-2xl font-bold mb-4">Bienvenido al panel de administración de Bufete Jurídico campus Navojoa</h1>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Folio</th>
                <th className="p-2 border">Fecha</th>
                <th className="p-2 border">Acción</th>
              </tr>
            </thead>
            <tbody>
              {chats.map(chat => (
                <tr key={chat.folio}>
                  <td className="p-2 border">{chat.folio}</td>
                  <td className="p-2 border">{new Date(chat.createdAt).toLocaleString()}</td>
                  <td className="p-2 border">
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={() => router.push(`/admin/chat/${chat.folio}`)}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
} 