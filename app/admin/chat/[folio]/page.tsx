"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Message {
  pregunta: string
  respuesta: string
}

export default function AdminChatPage() {
  const params = useParams<{ folio: string }>()
  const folio = params.folio
  const [historico, setHistorico] = useState<{ expediente?: string; mensajes: Message[] } | null>(null)
  const [respuesta, setRespuesta] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Cargar historial al montar
  useEffect(() => {
    const fetchHistorico = async () => {
      const res = await fetch(`/api/canalizar/${folio}`)
      if (res.ok) {
        const data = await res.json()
        setHistorico(data)
      } else {
        setError("Folio no encontrado")
      }
    }
    fetchHistorico()
  }, [folio])

  // Enviar respuesta a la última pregunta sin respuesta
  const handleSendRespuesta = async () => {
    if (!respuesta.trim()) return
    setLoading(true)
    try {
      // Encuentra la última pregunta sin respuesta
      const lastMsg = historico?.mensajes.findLast(m => !m.respuesta)
      if (!lastMsg) {
        setError("No hay preguntas pendientes de respuesta")
        setLoading(false)
        return
      }
      const res = await fetch(`/api/canalizar/${folio}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pregunta: lastMsg.pregunta, respuesta })
      })
      if (res.ok) {
        setHistorico((prev) => {
          if (!prev) return prev
          const idx = prev.mensajes.findIndex(m => m.pregunta === lastMsg.pregunta && !m.respuesta)
          if (idx === -1) return prev
          const newMsgs = [...prev.mensajes]
          newMsgs[idx] = { ...newMsgs[idx], respuesta }
          return { ...prev, mensajes: newMsgs }
        })
        setRespuesta("")
        setError("")
      } else {
        const errorData = await res.json()
        console.error("Error al enviar respuesta:", errorData)
        setError("Error al enviar la respuesta. Inténtalo de nuevo.")
      }
    } catch (error) {
      console.error("Error al enviar respuesta:", error)
      setError("Error de conexión. Inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  if (!historico) return <div className="p-8 text-gray-500">Cargando historial...</div>

  // Lógica de permisos para admin
  const ultimaSinRespuesta = historico?.mensajes.findLast(m => !m.respuesta)
  const puedeResponder = !!ultimaSinRespuesta

  return (
    <div className="flex flex-col h-screen bg-white">
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-xl font-bold mb-4">Admin - Chat Folio: {folio}</h1>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center">
                <p className="text-red-800">{error}</p>
                <button 
                  onClick={() => setError("")}
                  className="text-red-600 hover:text-red-800"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
          {historico.expediente && (
            <div className="mb-2 text-gray-600">Expediente: {historico.expediente}</div>
          )}
          {historico.mensajes.map((msg, idx) => (
            <div key={idx} className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-800">{msg.pregunta}</p>
              </div>
              {msg.respuesta && (
                <div className="space-y-4">
                  <p className="text-gray-800">{msg.respuesta}</p>
                </div>
              )}
            </div>
          ))}
          
          {/* Input para admin - solo respuesta */}
          {puedeResponder && (
            <div className="mt-8 flex flex-col gap-2">
              <Input
                placeholder="Escribe tu respuesta como administrador"
                value={respuesta}
                onChange={e => setRespuesta(e.target.value)}
                disabled={loading}
              />
              <Button onClick={handleSendRespuesta} disabled={loading || !respuesta.trim()}>
                Enviar respuesta
              </Button>
            </div>
          )}
          
          {/* Mensaje cuando no hay preguntas pendientes */}
          {!puedeResponder && (
            <div className="mt-8 text-gray-500">
              No hay preguntas pendientes de respuesta.
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 