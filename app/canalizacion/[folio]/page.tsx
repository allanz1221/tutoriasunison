"use client"
import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Message {
  pregunta: string
  respuesta: string
}

export default function CanalizacionPage() {
  const params = useParams<{ folio: string }>()
  const folio = params.folio
  const searchParams = useSearchParams()
  const isAdmin = searchParams.get("admin") === "1"
  const [historico, setHistorico] = useState<{ expediente?: string; mensajes: Message[] } | null>(null)
  const [pregunta, setPregunta] = useState("")
  const [respuesta, setRespuesta] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchHistorico()
    // eslint-disable-next-line
  }, [folio])

  const fetchHistorico = async () => {
    const res = await fetch(`/api/canalizar/${folio}`)
    if (res.ok) {
      const data = await res.json()
      setHistorico(data)
    } else {
      setError("Folio no encontrado")
    }
  }

  const handleSendPregunta = async () => {
    if (!pregunta.trim()) return
    setLoading(true)
    const res = await fetch(`/api/canalizar/${folio}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pregunta, respuesta: "" })
    })
    if (res.ok) {
      setHistorico((prev) => prev ? { ...prev, mensajes: [...prev.mensajes, { pregunta, respuesta: "" }] } : prev)
      setPregunta("")
    }
    setLoading(false)
  }

  const handleSendRespuesta = async () => {
    if (!respuesta.trim()) return
    setLoading(true)
    // Encuentra la última pregunta sin respuesta
    const lastMsg = historico?.mensajes.findLast(m => !m.respuesta)
    if (!lastMsg) return
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
    }
    setLoading(false)
  }

  if (error) return <div className="p-8 text-red-500">{error}</div>
  if (!historico) return <div className="p-8 text-gray-500">Cargando historial...</div>

  // Lógica de permisos
  const ultimaSinRespuesta = historico.mensajes.findLast(m => !m.respuesta)
  const puedePreguntar = !isAdmin && (!ultimaSinRespuesta)
  const puedeResponder = isAdmin && !!ultimaSinRespuesta

  return (
    <div className="flex flex-col h-screen bg-white">
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-xl font-bold mb-4">Canalización - Folio: {folio}</h1>
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
          {/* Input para usuario no autenticado */}
          {!isAdmin && puedePreguntar && (
            <div className="mt-8 flex flex-col gap-2">
              <Input
                placeholder="Escribe tu pregunta"
                value={pregunta}
                onChange={e => setPregunta(e.target.value)}
                disabled={loading}
              />
              <Button onClick={handleSendPregunta} disabled={loading || !pregunta.trim()}>
                Enviar pregunta
              </Button>
            </div>
          )}
          {/* Input para admin autenticado */}
          {isAdmin && puedeResponder && (
            <div className="mt-8 flex flex-col gap-2">
              <Input
                placeholder="Respuesta (como admin)"
                value={respuesta}
                onChange={e => setRespuesta(e.target.value)}
                disabled={loading}
              />
              <Button onClick={handleSendRespuesta} disabled={loading || !respuesta.trim()}>
                Enviar respuesta
              </Button>
            </div>
          )}
          {/* Mensaje de espera */}
          {!isAdmin && !puedePreguntar && (
            <div className="mt-8 text-gray-500">Por favor espera la respuesta del administrador antes de enviar otra pregunta.</div>
          )}
        </div>
      </main>
    </div>
  )
} 