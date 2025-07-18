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
  const [pregunta, setPregunta] = useState("")
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

  // Enviar nuevo mensaje
  const handleSend = async () => {
    if (!pregunta.trim() || !respuesta.trim()) return
    setLoading(true)
    const res = await fetch(`/api/canalizar/${folio}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pregunta, respuesta })
    })
    if (res.ok) {
      setHistorico((prev) => prev ? { ...prev, mensajes: [...prev.mensajes, { pregunta, respuesta }] } : prev)
      setPregunta("")
      setRespuesta("")
    }
    setLoading(false)
  }

  if (error) return <div className="p-8 text-red-500">{error}</div>
  if (!historico) return <div className="p-8 text-gray-500">Cargando historial...</div>

  return (
    <div className="flex flex-col h-screen bg-white">
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-xl font-bold mb-4">Admin - Chat Folio: {folio}</h1>
          {historico.expediente && (
            <div className="mb-2 text-gray-600">Expediente: {historico.expediente}</div>
          )}
          {historico.mensajes.map((msg, idx) => (
            <div key={idx} className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-800">{msg.pregunta}</p>
              </div>
              <div className="space-y-4">
                <p className="text-gray-800">{msg.respuesta}</p>
              </div>
            </div>
          ))}
          <div className="mt-8">
            <div className="flex flex-col gap-2">
              <Input
                placeholder="Escribe tu pregunta"
                value={pregunta}
                onChange={e => setPregunta(e.target.value)}
                disabled={loading}
              />
              <Input
                placeholder="Respuesta (como admin)"
                value={respuesta}
                onChange={e => setRespuesta(e.target.value)}
                disabled={loading}
              />
              <Button onClick={handleSend} disabled={loading || !pregunta.trim() || !respuesta.trim()}>
                Enviar
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 