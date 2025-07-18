"use client"
import React, { useState, useEffect } from "react"
import {
  ChevronDown,
  Info,
  Share,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  ExternalLink,
  RotateCcw,
  User,
  Plus,
  Mic,
  ArrowUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  pregunta: string
  respuesta: string
  timestamp: Date
}

export default function Component() {
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [openCanalizar, setOpenCanalizar] = useState(false)
  const [openSeguimiento, setOpenSeguimiento] = useState(false)
  const [expediente, setExpediente] = useState("")
  const [folio, setFolio] = useState("")
  const router = useRouter()
  const [tags, setTags] = useState<string[]>([])

  useEffect(() => {
    // Obtener preguntas de la base de datos para los tags
    fetch("/api/admin/preguntas")
      .then(res => res.json())
      .then(data => {
        if (data.preguntas) {
          setTags(data.preguntas.map((p: any) => p.pregunta))
        }
      })
  }, [])

  const handleSend = async () => {
    if (!inputValue.trim()) return

    setLoading(true)
    const pregunta = inputValue.trim()

    try {
      // Llama a la API
      const res = await fetch("/api/pregunta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pregunta })
      })
      
      const data = await res.json()
      
      // Agrega el mensaje a la lista
      const newMessage: Message = {
        id: Date.now().toString(),
        pregunta: pregunta,
        respuesta: data.respuesta || data.mensaje || "No se encontró respuesta.",
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, newMessage])
      setInputValue("")
    } catch (error) {
      console.error("Error al enviar pregunta:", error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        pregunta: pregunta,
        respuesta: "Error al procesar la pregunta. Inténtalo de nuevo.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleCanalizar = async () => {
    if (messages.length === 0) return
    const res = await fetch("/api/canalizar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expediente: expediente.trim() || null, mensajes: messages })
    })
    const data = await res.json()
    if (data.folio) {
      setOpenCanalizar(false)
      setExpediente("")
      // Redirigir a la página del folio
      router.push(`/canalizacion/${data.folio}`)
    }
  }

  const handleSeguimiento = () => {
    if (folio.trim()) {
      setOpenSeguimiento(false)
      setFolio("")
      // Redirigir a la página de canalización con el folio
      router.push(`/canalizacion/${folio.trim()}`)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">Universidad de Sonora campus Navojoa, Departamento de Ciencias Sociales</span>
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sistema Integral de Tutorías</span>
          <Info className="w-4 h-4 text-gray-400" />
        </div>

                  <div className="flex items-center gap-3">
           <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={() => router.push("/admin")}>
             Iniciar Sesión
            </Button>
           <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={() => setOpenSeguimiento(true)}>
             Seguimiento
            </Button>
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-gray-800 text-white text-xs">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Mensaje de bienvenida y tags como primer mensaje del chat */}
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h2 className="text-lg font-bold text-blue-900 mb-1">Bienvenido al Sistema Integral de Tutorías</h2>
              <p className="text-blue-800 text-sm mb-2">Esta plataforma te permitirá recibir atención y orientación con mayor cobertura y eficiencia. Puedes escribir tu pregunta o seleccionar una de las sugerencias.</p>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {tags.map((tag, idx) => (
                    <button
                      key={idx}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs border border-blue-300 transition"
                      onClick={() => setInputValue(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Mensajes del usuario y asistente */}
          {messages.map((message, index) => (
            <div key={message.id} className="space-y-4">
              {/* User Message */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-800">{message.pregunta}</p>
              </div>

              {/* Assistant Response */}
              <div className="space-y-4">
                <p className="text-gray-800">{message.respuesta}</p>
                
                {/* Action Buttons - solo en la última respuesta */}
                {index === messages.length - 1 && (
                  <div className="flex items-center gap-2 pt-4">
                   Canalizar a 
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span className="text-sm">Jefatura de Departamento</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setOpenCanalizar(true)}>
                      <span className="text-sm">Bufete Jurídico</span>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <span className="text-sm">Psicología</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex items-center gap-2 text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
              <span>Buscando respuesta...</span>
            </div>
          )}
        </div>
      </main>

      {/* Modal de canalización */}
      <Dialog open={openCanalizar} onOpenChange={setOpenCanalizar}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Canalización a bufete jurídico</DialogTitle>
            <DialogDescription>
              La canalización puede ser anónima, pero tendrá más certeza si se dan los datos reales.<br/>
              Por favor, ingresa el número de expediente (opcional):
            </DialogDescription>
          </DialogHeader>
          <Input
            className="mt-2"
            placeholder="Número de expediente (opcional)"
            value={expediente}
            onChange={e => setExpediente(e.target.value)}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancelar</Button>
            </DialogClose>
            <Button variant="default" onClick={handleCanalizar} disabled={messages.length === 0}>
              Canalizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de seguimiento */}
      <Dialog open={openSeguimiento} onOpenChange={setOpenSeguimiento}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Seguimiento de Conversación</DialogTitle>
            <DialogDescription>
              Proporciona tu folio para continuar con la conversación
            </DialogDescription>
          </DialogHeader>
          <Input
            className="mt-2"
            placeholder="Ingresa tu folio"
            value={folio}
            onChange={e => setFolio(e.target.value)}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancelar</Button>
            </DialogClose>
            <Button variant="default" onClick={handleSeguimiento} disabled={!folio.trim()}>
              Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
              <Button variant="ghost" size="sm" className="shrink-0">
                <Plus className="w-4 h-4" />
              </Button>

              <Input
                className="flex-1 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                placeholder="Escribe tu pregunta..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />

              <div className="flex items-center gap-2 shrink-0">

                <Button variant="ghost" size="sm">
                  <Mic className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  className="bg-gray-800 hover:bg-gray-700 text-white rounded-full w-8 h-8 p-0"
                  onClick={handleSend}
                  disabled={loading || !inputValue.trim()}
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}