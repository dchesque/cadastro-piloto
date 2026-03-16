'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { showToast } from '@/components/ui/toast'
import { ArrowLeft, Plus, CheckCircle, AlertCircle } from 'lucide-react'
import { Field } from '@/components/ui/field'

export default function NovaPecaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [referencia, setReferencia] = useState('Gerando...')
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
    const fetchReferencia = async () => {
      try {
        const response = await fetch('/api/pecas/referencia')
        const result = await response.json()
        setReferencia(result.data.referencia)
      } catch (error) {
        console.error('Erro ao gerar referência:', error)
      }
    }
    fetchReferencia()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    try {
      const response = await fetch('/api/pecas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          precoTecido: formData.precoTecido ? parseFloat(formData.precoTecido) : null,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        showToast({
          title: 'Sucesso',
          description: 'Peça cadastrada com sucesso',
        })
        router.push(`/pecas/${result.data.id}/imprimir`)
      } else {
        showToast({
          title: 'Erro',
          description: result.message || 'Erro ao cadastrar peça',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Erro ao cadastrar peça:', error)
      showToast({
        title: 'Erro',
        description: 'Erro ao cadastrar peça',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full h-11 px-4 bg-white border border-[--color-border-light] rounded-[16px] text-[15px] font-medium text-[--color-text-primary] placeholder:text-[--color-text-tertiary] focus:outline-none focus:border-[--color-accent] focus:ring-4 focus:ring-[--color-accent]/5 transition-all duration-200"
  const monoClass = "font-mono text-[13px] tracking-tight"

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-4">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[--color-text-tertiary] hover:text-[--color-accent] transition-all group px-3 py-1.5 rounded-full bg-[--color-bg-subtle]"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Voltar
        </button>
        <div>
          <h1 className="text-3xl font-light text-[--color-text-primary] tracking-tight">Nova Peça Piloto</h1>
          <p className="text-[14px] text-[--color-text-secondary] font-medium">Cadastre um novo modelo no sistema JC Studio</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="bg-white border border-[--color-border-light] rounded-[32px] overflow-hidden shadow-card hover:shadow-hover transition-all duration-500">
        <div className="p-6 space-y-5">
          <Field label="Referência" hint="Gerada automaticamente pelo sistema">
            <div className="relative">
              <input value={referencia} readOnly className={`${inputClass} ${monoClass} bg-[--color-bg-subtle]/50 border-dashed opacity-80 cursor-default`} />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[--color-accent-peca] animate-pulse" />
            </div>
          </Field>

          <Field label="Nome da peça" error={errors.nome}>
            <input
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className={`${inputClass} ${errors.nome ? 'border-destructive ring-2 ring-destructive/10' : ''}`}
              placeholder="Ex: Vestido Midi Linho"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Coleção" error={errors.colecao}>
              <input
                name="colecao"
                value={formData.colecao}
                onChange={handleChange}
                className={`${inputClass} ${errors.colecao ? 'border-destructive ring-2 ring-destructive/10' : ''}`}
                placeholder="Ex: Inverno 2025"
              />
            </Field>

            <Field label="Modelista" error={errors.modelista}>
              <input
                name="modelista"
                value={formData.modelista}
                onChange={handleChange}
                className={`${inputClass} ${errors.modelista ? 'border-destructive ring-2 ring-destructive/10' : ''}`}
                placeholder="Nome da modelista"
              />
            </Field>
          </div>

          <Field label="Fornecedor" error={errors.fornecedor}>
            <input
              name="fornecedor"
              value={formData.fornecedor}
              onChange={handleChange}
              className={`${inputClass} ${errors.fornecedor ? 'border-destructive ring-2 ring-destructive/10' : ''}`}
              placeholder="Nome do fornecedor"
            />
          </Field>

          <Field label="Tecido" error={errors.tecido}>
            <input
              name="tecido"
              value={formData.tecido}
              onChange={handleChange}
              className={`${inputClass} ${errors.tecido ? 'border-destructive ring-2 ring-destructive/10' : ''}`}
              placeholder="Tipo de tecido"
            />
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Composição" error={errors.composicao}>
              <input
                name="composicao"
                value={formData.composicao}
                onChange={handleChange}
                className={`${inputClass} ${errors.composicao ? 'border-destructive ring-2 ring-destructive/10' : ''}`}
                placeholder="Ex: 100% Linho"
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
                  placeholder="0.00"
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
              placeholder="Ex: 46, 48, 50, 52"
            />
          </Field>

          <Field label="Observações">
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              rows={4}
              className={`${inputClass} h-auto py-4 leading-relaxed resize-none`}
              placeholder="Informações adicionais sobre o modelo..."
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
            disabled={loading}
            className="btn-premium btn-primary h-12 px-10 shadow-premium disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Salvando...
              </div>
            ) : (
              <>
                <Plus size={18} />
                Cadastrar Peça
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
