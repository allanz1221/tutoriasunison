"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"

export default function AdminPreguntasPage() {
  const [pregunta, setPregunta] = useState("")
  const [respuesta, setRespuesta] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [preguntas, setPreguntas] = useState<any[]>([])
  const [editId, setEditId] = useState<number | null>(null)
  const [editPregunta, setEditPregunta] = useState("")
  const [editRespuesta, setEditRespuesta] = useState("")
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchPreguntas()
  }, [])

  const fetchPreguntas = async () => {
    const res = await fetch("/api/admin/preguntas")
    if (res.ok) {
      const data = await res.json()
      setPreguntas(data.preguntas)
    }
  }

  const handleAdd = async () => {
    setLoading(true)
    setSuccess("")
    setError("")
    const res = await fetch("/api/admin/preguntas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pregunta, respuesta })
    })
    if (res.ok) {
      setSuccess("Pregunta añadida correctamente")
      setPregunta("")
      setRespuesta("")
      fetchPreguntas()
    } else {
      setError("Error al añadir pregunta")
    }
    setLoading(false)
  }

  const handleEdit = (p: any) => {
    setEditId(p.id)
    setEditPregunta(p.pregunta)
    setEditRespuesta(p.respuesta)
  }

  const handleUpdate = async () => {
    if (!editPregunta.trim() || !editRespuesta.trim()) return
    setLoading(true)
    setSuccess("")
    setError("")
    const res = await fetch(`/api/admin/preguntas/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pregunta: editPregunta, respuesta: editRespuesta })
    })
    if (res.ok) {
      setSuccess("Pregunta actualizada correctamente")
      setEditId(null)
      setEditPregunta("")
      setEditRespuesta("")
      fetchPreguntas()
    } else {
      setError("Error al actualizar pregunta")
    }
    setLoading(false)
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta pregunta?")) return
    setLoading(true)
    setSuccess("")
    setError("")
    const res = await fetch(`/api/admin/preguntas/${id}`, {
      method: "DELETE"
    })
    if (res.ok) {
      setSuccess("Pregunta eliminada correctamente")
      fetchPreguntas()
    } else {
      setError("Error al eliminar pregunta")
    }
    setLoading(false)
  }

  // Filtrado por búsqueda
  const preguntasFiltradas = preguntas.filter(
    p =>
      p.pregunta.toLowerCase().includes(search.toLowerCase()) ||
      p.respuesta.toLowerCase().includes(search.toLowerCase())
  )

  // Exportar a Excel
  const handleExportExcel = () => {
    const data = preguntasFiltradas.map(p => ({ Pregunta: p.pregunta, Respuesta: p.respuesta }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Preguntas")
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" })
    saveAs(blob, "preguntas.xlsx")
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Añadir pregunta y respuesta</h1>
      <div className="flex flex-col gap-2 mb-6">
        <Input
          placeholder="Pregunta"
          value={pregunta}
          onChange={e => setPregunta(e.target.value)}
          disabled={loading}
        />
        <Input
          placeholder="Respuesta"
          value={respuesta}
          onChange={e => setRespuesta(e.target.value)}
          disabled={loading}
        />
        <Button onClick={handleAdd} disabled={loading || !pregunta.trim() || !respuesta.trim()}>
          Añadir
        </Button>
        {success && <div className="text-green-600 text-sm">{success}</div>}
        {error && <div className="text-red-600 text-sm">{error}</div>}
      </div>
      <h2 className="text-lg font-bold mb-2 flex items-center justify-between">
        Preguntas en la base de datos
        <Button size="sm" variant="outline" onClick={handleExportExcel}>
          Exportar a Excel
        </Button>
      </h2>
      <Input
        className="mb-4"
        placeholder="Buscar pregunta o respuesta..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Pregunta</th>
            <th className="p-2 border">Respuesta</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {preguntasFiltradas.map((p, idx) => (
            <tr key={p.id}>
              <td className="p-2 border">
                {editId === p.id ? (
                  <Input value={editPregunta} onChange={e => setEditPregunta(e.target.value)} />
                ) : (
                  p.pregunta
                )}
              </td>
              <td className="p-2 border">
                {editId === p.id ? (
                  <Input value={editRespuesta} onChange={e => setEditRespuesta(e.target.value)} />
                ) : (
                  p.respuesta
                )}
              </td>
              <td className="p-2 border flex gap-2">
                {editId === p.id ? (
                  <>
                    <Button size="sm" onClick={handleUpdate} disabled={loading}>Guardar</Button>
                    <Button size="sm" variant="secondary" onClick={() => setEditId(null)} disabled={loading}>Cancelar</Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" onClick={() => handleEdit(p)} disabled={loading}>Editar</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)} disabled={loading}>Eliminar</Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 