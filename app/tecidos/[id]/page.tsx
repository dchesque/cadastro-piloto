'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { showToast } from '@/components/ui/toast'
import { ArrowLeft, Printer, Save } from 'lucide-react'
import Link from 'next/link'
import { Field } from '@/components/ui/field'

interface CorteTecido {
  id: string
  referencia: string
  nome: string
  fornecedor: string
  composicao: string
  metragem: number
  largura: number
  preco: number
  cor: string
  refCor: string | null
  observacoes: string | null
}

export default function TecidoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tecido, setTecido] = useState<CorteTecido | null>(null)
  const [formData, setFormData] = useState({
    referencia: '',
    nome: '',
    fornecedor: '',
    composicao: '',
    metragem: '',
    largura: '',
    preco: '',
    cor: '',
    refCor: '',
    observacoes: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (id) {
      fetchTecido()
    }
  }, [id])

  const fetchTecido = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/tecidos/${id}`)
      const result = await response.json()

      if (response.ok) {
        const tecidoData = result.data
        setTecido(tecidoData)
        setFormData({
          referencia: tecidoData.referencia,
          nome: tecidoData.nome,
          fornecedor: tecidoData.fornecedor,
          composicao: tecidoData.composicao,
          metragem: tecidoData.metragem.toString(),
          largura: tecidoData.largura.toString(),
          preco: tecidoData.preco.toString(),
          cor: tecidoData.cor,
          refCor: tecidoData.refCor || '',
          observacoes: tecidoData.observacoes || '',
        })
      }
    } catch (error) {
      console.error('Erro ao buscar tecido:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setSaving(true)
    try {
      const response = await fetch(`/api/tecidos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          metragem: formData.metragem ? parseFloat(formData.metragem) : null,
          largura: formData.largura ? parseFloat(formData.largura) : null,
          preco: formData.preco ? parseFloat(formData.preco) : null,
          refCor: formData.refCor || null,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        showToast({
          title: 'Sucesso',
          description: 'Tecido atualizado com sucesso',
        })
        fetchTecido()
      } else {
        showToast({
          title: 'Erro',
          description: result.message || 'Erro ao atualizar tecido',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Erro ao atualizar tecido:', error)
      showToast({
        title: 'Erro',
        description: 'Erro ao atualizar tecido',
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
        <p className="text-[14px] text-[--color-text-secondary]">Carregando tecido...</p>
      </div>
    )
  }

  if (!tecido) {
    return (
      <div className="max-w-[640px] mx-auto py-20 text-center">
        <p className="text-[15px] font-medium text-[--color-text-secondary]">Tecido não encontrado</p>
        <Link href="/tecidos">
          <button className="mt-4 text-[14px] text-[--color-accent] hover:underline">Voltar para lista</button>
        </Link>
      </div>
    )
  }

  const inputClass = "w-full h-11 px-4 bg-white border border-[--color-border-light] rounded-[16px] text-[15px] font-medium text-[--color-text-primary] placeholder:text-[--color-text-tertiary] focus:outline-none focus:border-[--color-accent-tecido] focus:ring-4 focus:ring-[--color-accent-tecido]/5 transition-all duration-200"
  const monoClass = "font-mono text-[13px] tracking-tight"

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-4">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[--color-text-tertiary] hover:text-[--color-accent-tecido] transition-all group px-3 py-1.5 rounded-full bg-[--color-bg-subtle]"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Voltar
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-light text-[--color-text-primary] tracking-tight">Editar Corte de Tecido</h1>
            <p className="text-[14px] text-[--color-text-secondary] font-medium uppercase tracking-wider font-bold">JC PLUS SIZE</p>
          </div>
        </div>
        
        <Link href={`/tecidos/${id}/imprimir`}>
          <button className="btn-premium btn-outline h-12 px-6 flex items-center gap-2 bg-white">
            <Printer size={18} />
            Imprimir Etiqueta
          </button>
        </Link>
      </header>

      <form onSubmit={handleSubmit} className="bg-white border border-[--color-border-light] rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-card hover:shadow-hover transition-all duration-500">
        <div className="p-6 space-y-5">
          <Field label="Referência" hint="Você pode editar o código se necessário">
            <div className="relative">
              <input 
                name="referencia"
                value={formData.referencia} 
                onChange={handleChange}
                className={`${inputClass} ${monoClass}`} 
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[--color-accent-tecido] opacity-50" />
            </div>
          </Field>

          <Field label="Nome do tecido" error={errors.nome}>
            <input
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className={`${inputClass} ${errors.nome ? 'border-destructive ring-2 ring-destructive/10' : ''}`}
            />
          </Field>

          <Field label="Fornecedor" error={errors.fornecedor}>
            <input
              name="fornecedor"
              value={formData.fornecedor}
              onChange={handleChange}
              className={`${inputClass} ${errors.fornecedor ? 'border-destructive ring-2 ring-destructive/10' : ''}`}
            />
          </Field>

          <Field label="Composição" error={errors.composicao}>
            <input
              name="composicao"
              value={formData.composicao}
              onChange={handleChange}
              className={`${inputClass} ${errors.composicao ? 'border-destructive ring-2 ring-destructive/10' : ''}`}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Metragem (m)" error={errors.metragem}>
              <input
                name="metragem"
                type="number"
                step="0.01"
                value={formData.metragem}
                onChange={handleChange}
                className={`${inputClass} ${monoClass} ${errors.metragem ? 'border-destructive ring-2 ring-destructive/10' : ''}`}
              />
            </Field>

            <Field label="Largura (m)" error={errors.largura}>
              <input
                name="largura"
                type="number"
                step="0.01"
                value={formData.largura}
                onChange={handleChange}
                className={`${inputClass} ${monoClass} ${errors.largura ? 'border-destructive ring-2 ring-destructive/10' : ''}`}
              />
            </Field>

            <Field label="Preço (R$/m)" error={errors.preco}>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[--color-text-tertiary] font-mono text-xs">R$</span>
                <input
                  name="preco"
                  type="number"
                  step="0.01"
                  value={formData.preco}
                  onChange={handleChange}
                  className={`${inputClass} pl-10 ${monoClass} ${errors.preco ? 'border-destructive ring-2 ring-destructive/10' : ''}`}
                />
              </div>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Cor" error={errors.cor}>
              <input
                name="cor"
                value={formData.cor}
                onChange={handleChange}
                className={`${inputClass} ${errors.cor ? 'border-destructive ring-2 ring-destructive/10' : ''}`}
              />
            </Field>

            <Field label="Ref. da cor" hint="Opcional">
              <input
                name="refCor"
                value={formData.refCor}
                onChange={handleChange}
                className={`${inputClass} ${monoClass}`}
              />
            </Field>
          </div>

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
