'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { showToast } from '@/components/ui/toast'
import { ArrowLeft, Check } from 'lucide-react'
import { FMField } from '@/components/fm/field'
import { FMInput } from '@/components/fm/input'
import { FMTextarea } from '@/components/fm/textarea'
import { FMBtn } from '@/components/fm/btn'

export default function NovoTecidoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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

  useEffect(() => {
    let cancelled = false
    fetch('/api/tecidos/referencia')
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
      const r = await fetch('/api/tecidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          metragem: formData.metragem ? parseFloat(formData.metragem) : null,
          largura: formData.largura ? parseFloat(formData.largura) : null,
          preco: formData.preco ? parseFloat(formData.preco) : null,
          refCor: formData.refCor || null,
        }),
      })
      const result = await r.json()
      if (r.ok) {
        showToast({ title: 'Sucesso', description: 'Tecido cadastrado com sucesso' })
        router.push(`/tecidos/${result.data.id}/imprimir`)
      } else {
        showToast({
          title: 'Erro',
          description: result.message || 'Erro ao cadastrar tecido',
          variant: 'destructive',
        })
      }
    } catch {
      showToast({
        title: 'Erro',
        description: 'Erro ao cadastrar tecido',
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
            Novo Corte de Tecido
          </h1>
          <p className="mt-0.5 text-[13px] text-[--color-text-secondary]">
            Cadastre as especificações do tecido
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 rounded-[24px] border border-[--color-border-light] bg-white p-8"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <FMField label="Nome do Tecido">
            <FMInput
              value={formData.nome}
              onChange={set('nome')}
              placeholder="Ex: Malha Fria Estampada Floral"
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
          <FMField label="Cor">
            <FMInput
              value={formData.cor}
              onChange={set('cor')}
              placeholder="Ex: Azul Royal"
            />
          </FMField>
          <FMField label="Ref. da Cor" hint="Opcional">
            <FMInput
              value={formData.refCor}
              onChange={set('refCor')}
              placeholder="Código do fornecedor"
              className="font-mono"
            />
          </FMField>
        </div>

        <div className="h-px bg-[--color-border-light]" />

        <div className="grid gap-5 md:grid-cols-2">
          <FMField label="Fornecedor">
            <FMInput
              value={formData.fornecedor}
              onChange={set('fornecedor')}
              placeholder="Ex: Têxtil Bonfim"
            />
          </FMField>
          <FMField label="Composição">
            <FMInput
              value={formData.composicao}
              onChange={set('composicao')}
              placeholder="Ex: 65% Poliéster, 35% Viscose"
            />
          </FMField>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <FMField label="Metragem (m)">
            <FMInput
              type="number"
              step="0.01"
              value={formData.metragem}
              onChange={set('metragem')}
              placeholder="Ex: 45"
              className="font-mono"
            />
          </FMField>
          <FMField label="Largura (m)">
            <FMInput
              type="number"
              step="0.01"
              value={formData.largura}
              onChange={set('largura')}
              placeholder="Ex: 1.50"
              className="font-mono"
            />
          </FMField>
          <FMField label="Preço / metro (R$)">
            <FMInput
              type="number"
              step="0.01"
              value={formData.preco}
              onChange={set('preco')}
              placeholder="Ex: 18.50"
              className="font-mono"
            />
          </FMField>
        </div>

        <FMField label="Observações">
          <FMTextarea
            value={formData.observacoes}
            onChange={set('observacoes')}
            placeholder="Notas sobre o tecido, condições de armazenamento, etc."
            rows={4}
          />
        </FMField>

        <div className="flex justify-end gap-3 pt-2">
          <FMBtn variant="outline" type="button" onClick={() => router.back()}>
            Cancelar
          </FMBtn>
          <FMBtn variant="tecido" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Salvando...
              </>
            ) : (
              <>
                <Check size={15} strokeWidth={2.5} />
                Salvar Tecido
              </>
            )}
          </FMBtn>
        </div>
      </form>
    </div>
  )
}
