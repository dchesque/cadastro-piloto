'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { showToast } from '@/components/ui/toast'
import { ArrowLeft, Printer, Save, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Field } from '@/components/ui/field'

interface PecaPiloto {
  id: string
  referencia: string
  nome: string
  colecao: string
  modelista: string
  fornecedor: string
  tecido: string
  composicao: string
  precoTecido: number
  tamanhos: string
  observacoes: string | null
}

export default function PecaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [peca, setPeca] = useState<PecaPiloto | null>(null)
  const [formData, setFormData] = useState({
    nome: '',
    colecao: '',
    modelista: '',
    fornecedor: '',
    tecido: '',
    composicao: '',
    precoTecido: '',
    tamanhos: '',
    observacoes: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (id) {
      fetchPeca()
    }
  }, [id])

  const fetchPeca = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/pecas/${id}`)
      const result = await response.json()

      if (response.ok) {
        const pecaData = result.data
        setPeca(pecaData)
        setFormData({
          nome: pecaData.nome,
          colecao: pecaData.colecao,
          modelista: pecaData.modelista,
          fornecedor: pecaData.fornecedor,
          tecido: pecaData.tecido,
          composicao: pecaData.composicao,
          precoTecido: pecaData.precoTecido.toString(),
          tamanhos: pecaData.tamanhos,
          observacoes: pecaData.observacoes || '',
        })
      }
    } catch (error) {
      console.error('Erro ao buscar peça:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório'
    if (!formData.colecao.trim()) newErrors.colecao = 'Coleção é obrigatória'
    if (!formData.modelista.trim()) newErrors.modelista = 'Modelista é obrigatório'
    if (!formData.fornecedor.trim()) newErrors.fornecedor = 'Fornecedor é obrigatório'
    if (!formData.tecido.trim()) newErrors.tecido = 'Tecido é obrigatório'
    if (!formData.composicao.trim()) newErrors.composicao = 'Composição é obrigatória'
    if (!formData.precoTecido.trim()) newErrors.precoTecido = 'Preço do tecido é obrigatório'
    if (!formData.tamanhos.trim()) newErrors.tamanhos = 'Tamanhos é obrigatório'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setSaving(true)
    try {
      const response = await fetch(`/api/pecas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          precoTecido: parseFloat(formData.precoTecido),
        }),
      })

      const result = await response.json()

      if (response.ok) {
        showToast({
          title: 'Sucesso',
          description: 'Peça atualizada com sucesso',
        })
        fetchPeca()
      } else {
        showToast({
          title: 'Erro',
          description: result.message || 'Erro ao atualizar peça',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Erro ao atualizar peça:', error)
      showToast({
        title: 'Erro',
        description: 'Erro ao atualizar peça',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-[640px] mx-auto py-20 flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-2 border-[--color-accent] border-t-transparent rounded-full animate-spin" />
        <p className="text-[14px] text-[--color-text-secondary]">Carregando peça...</p>
      </div>
    )
  }

  if (!peca) {
    return (
      <div className="max-w-[640px] mx-auto py-20 text-center">
        <p className="text-[15px] font-medium text-[--color-text-secondary]">Peça não encontrada</p>
        <Link href="/pecas">
          <button className="mt-4 text-[14px] text-[--color-accent] hover:underline">Voltar para lista</button>
        </Link>
      </div>
    )
  }

  const inputClass = "w-full h-11 px-4 bg-white border border-[--color-border-light] rounded-[16px] text-[15px] font-medium text-[--color-text-primary] placeholder:text-[--color-text-tertiary] focus:outline-none focus:border-[--color-accent] focus:ring-4 focus:ring-[--color-accent]/5 transition-all duration-200"
  const monoClass = "font-mono text-[13px] tracking-tight"

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-4">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[--color-text-tertiary] hover:text-[--color-accent] transition-all group px-3 py-1.5 rounded-full bg-[--color-bg-subtle]"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Voltar
          </button>
          <div>
            <h1 className="text-3xl font-light text-[--color-text-primary] tracking-tight">Editar Peça Piloto</h1>
            <p className="text-[14px] text-[--color-text-secondary] font-medium">Atualize as informações do modelo JC Studio</p>
          </div>
        </div>
        
        <Link href={`/pecas/${id}/imprimir`}>
          <button className="btn-premium btn-outline h-12 px-6 flex items-center gap-2 bg-white">
            <Printer size={18} />
            Imprimir Etiqueta
          </button>
        </Link>
      </header>

      <form onSubmit={handleSubmit} className="bg-white border border-[--color-border-light] rounded-[32px] overflow-hidden shadow-card hover:shadow-hover transition-all duration-500">
        <div className="p-6 space-y-5">
          <Field label="Referência" hint="Identificador único não editável">
            <div className="relative">
              <input value={peca.referencia} readOnly className={`${inputClass} ${monoClass} bg-[--color-bg-subtle]/50 border-dashed opacity-80 cursor-not-allowed`} />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[--color-accent-peca] opacity-50" />
            </div>
          </Field>

          <Field label="Nome da peça" error={errors.nome}>
            <input
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className={`${inputClass} ${errors.nome ? 'border-destructive ring-2 ring-destructive/10' : ''}`}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Coleção" error={errors.colecao}>
              <input
                name="colecao"
                value={formData.colecao}
                onChange={handleChange}
                className={`${inputClass} ${errors.colecao ? 'border-destructive ring-2 ring-destructive/10' : ''}`}
              />
            </Field>

            <Field label="Modelista" error={errors.modelista}>
              <input
                name="modelista"
                value={formData.modelista}
                onChange={handleChange}
                className={`${inputClass} ${errors.modelista ? 'border-destructive ring-2 ring-destructive/10' : ''}`}
              />
            </Field>
          </div>

          <Field label="Fornecedor" error={errors.fornecedor}>
            <input
              name="fornecedor"
              value={formData.fornecedor}
              onChange={handleChange}
              className={`${inputClass} ${errors.fornecedor ? 'border-destructive ring-2 ring-destructive/10' : ''}`}
            />
          </Field>

          <Field label="Tecido" error={errors.tecido}>
            <input
              name="tecido"
              value={formData.tecido}
              onChange={handleChange}
              className={`${inputClass} ${errors.tecido ? 'border-destructive ring-2 ring-destructive/10' : ''}`}
            />
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Composição" error={errors.composicao}>
              <input
                name="composicao"
                value={formData.composicao}
                onChange={handleChange}
                className={`${inputClass} ${errors.composicao ? 'border-destructive ring-2 ring-destructive/10' : ''}`}
              />
            </Field>

            <Field label="Preço tecido (R$/m)" error={errors.precoTecido}>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[--color-text-tertiary] font-mono text-xs">R$</span>
                <input
                  name="precoTecido"
                  type="number"
                  step="0.01"
                  value={formData.precoTecido}
                  onChange={handleChange}
                  className={`${inputClass} pl-10 ${monoClass} ${errors.precoTecido ? 'border-destructive ring-2 ring-destructive/10' : ''}`}
                />
              </div>
            </Field>
          </div>

          <Field label="Tamanhos" error={errors.tamanhos}>
            <input
              name="tamanhos"
              value={formData.tamanhos}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>

          <Field label="Observações">
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              rows={4}
              className={`${inputClass} h-auto py-4 leading-relaxed resize-none`}
            />
          </Field>
        </div>

        <div className="bg-[--color-bg-subtle]/50 border-t border-[--color-border-light] p-6 flex flex-col sm:flex-row justify-end gap-3">
          <button 
            type="button" 
            onClick={() => router.back()}
            className="btn-premium btn-outline h-12 px-8 bg-white"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={saving}
            className="btn-premium btn-primary h-12 px-10 shadow-premium disabled:opacity-50"
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Salvando...
              </div>
            ) : (
              <>
                <Save size={18} />
                Salvar alterações
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
