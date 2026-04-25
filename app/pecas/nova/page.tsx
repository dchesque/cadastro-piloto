'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { showToast } from '@/components/ui/toast'
import { ArrowLeft, Check } from 'lucide-react'
import { FMField } from '@/components/fm/field'
import { FMInput } from '@/components/fm/input'
import { FMTextarea } from '@/components/fm/textarea'
import { FMBtn } from '@/components/fm/btn'

export default function NovaPecaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    referencia: '',
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

  useEffect(() => {
    let cancelled = false
    fetch('/api/pecas/referencia')
      .then((r) => r.json())
      .then((result) => {
        if (cancelled) return
        setFormData((prev) => ({ ...prev, referencia: result?.data?.referencia ?? '' }))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const set =
    <K extends keyof typeof formData>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFormData((prev) => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const r = await fetch('/api/pecas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          precoTecido: formData.precoTecido ? parseFloat(formData.precoTecido) : null,
        }),
      })
      const result = await r.json()
      if (r.ok) {
        showToast({ title: 'Sucesso', description: 'Peça cadastrada com sucesso' })
        router.push(`/pecas/${result.data.id}/imprimir`)
      } else {
        showToast({
          title: 'Erro',
          description: result.message || 'Erro ao cadastrar peça',
          variant: 'destructive',
        })
      }
    } catch {
      showToast({
        title: 'Erro',
        description: 'Erro ao cadastrar peça',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-[800px] animate-in fade-in duration-500">
      <div className="mb-8 flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[--color-bg-subtle] text-[--color-text-secondary] transition-colors hover:bg-[--color-bg-muted]"
          aria-label="Voltar"
        >
          <ArrowLeft size={16} strokeWidth={2.2} />
        </button>
        <div>
          <h1 className="m-0 text-[28px] font-light leading-tight tracking-[-0.5px] text-[--color-text-primary]">
            Nova Peça Piloto
          </h1>
          <p className="mt-0.5 text-[13px] text-[--color-text-secondary]">
            Preencha as informações técnicas da peça
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 rounded-[24px] border border-[--color-border-light] bg-white p-8"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <FMField label="Nome da Peça">
            <FMInput
              value={formData.nome}
              onChange={set('nome')}
              placeholder="Ex: Blusa Plus Size Verão"
              required
            />
          </FMField>
          <FMField label="Referência" hint="Gerada automaticamente, edite se necessário">
            <FMInput
              value={formData.referencia}
              onChange={set('referencia')}
              placeholder="Gerando..."
              className="font-mono"
            />
          </FMField>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FMField label="Coleção">
            <FMInput
              value={formData.colecao}
              onChange={set('colecao')}
              placeholder="Ex: Verão 2024"
            />
          </FMField>
          <FMField label="Modelista">
            <FMInput
              value={formData.modelista}
              onChange={set('modelista')}
              placeholder="Nome do modelista"
            />
          </FMField>
        </div>

        <div className="h-px bg-[--color-border-light]" />

        <div className="grid gap-5 md:grid-cols-2">
          <FMField label="Fornecedor de Tecido">
            <FMInput
              value={formData.fornecedor}
              onChange={set('fornecedor')}
              placeholder="Ex: Têxtil Bonfim"
            />
          </FMField>
          <FMField label="Tipo de Tecido">
            <FMInput
              value={formData.tecido}
              onChange={set('tecido')}
              placeholder="Ex: Malha fria estampada"
            />
          </FMField>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FMField label="Composição" hint="Ex: 65% Poliéster, 35% Viscose">
            <FMInput
              value={formData.composicao}
              onChange={set('composicao')}
              placeholder="Composição do tecido"
            />
          </FMField>
          <FMField label="Preço / metro (R$)">
            <FMInput
              type="number"
              step="0.01"
              value={formData.precoTecido}
              onChange={set('precoTecido')}
              placeholder="Ex: 18.50"
              className="font-mono"
            />
          </FMField>
        </div>

        <FMField label="Tamanhos">
          <FMInput
            value={formData.tamanhos}
            onChange={set('tamanhos')}
            placeholder="Ex: 46, 48, 50, 52, 54"
          />
        </FMField>

        <FMField label="Observações">
          <FMTextarea
            value={formData.observacoes}
            onChange={set('observacoes')}
            placeholder="Notas técnicas, pontos de atenção, instruções especiais..."
            rows={4}
          />
        </FMField>

        <div className="flex justify-end gap-3 pt-2">
          <FMBtn variant="outline" type="button" onClick={() => router.back()}>
            Cancelar
          </FMBtn>
          <FMBtn variant="peca" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Salvando...
              </>
            ) : (
              <>
                <Check size={15} strokeWidth={2.5} />
                Salvar Peça
              </>
            )}
          </FMBtn>
        </div>
      </form>
    </div>
  )
}
