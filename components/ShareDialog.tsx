'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { showToast } from '@/components/ui/toast'
import { Mail, Paperclip, Send } from 'lucide-react'

interface Modelagem {
  id: string
  nome: string
  url: string
}

interface Corte {
  id: string
  numeroCorte: string
}

interface ShareDialogProps {
  pecaId: string
  pecaNome: string
  cortes: Corte[]
  modelagens: Modelagem[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ShareDialog({
  pecaId,
  pecaNome,
  cortes,
  modelagens,
  open,
  onOpenChange,
}: ShareDialogProps) {
  const [docType, setDocType] = useState<'ficha' | 'corte'>('ficha')
  const [selectedCorteId, setSelectedCorteId] = useState<string>(cortes[0]?.id || '')
  const [selectedModelagemIds, setSelectedModelagemIds] = useState<string[]>([])
  const [recipient, setRecipient] = useState('')
  const [sending, setSending] = useState(false)

  function toggleModelagem(id: string) {
    setSelectedModelagemIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  function toggleAll() {
    if (selectedModelagemIds.length === modelagens.length) {
      setSelectedModelagemIds([])
    } else {
      setSelectedModelagemIds(modelagens.map(m => m.id))
    }
  }

  async function handleSend() {
    if (!recipient.includes('@')) {
      showToast({ title: 'E-mail inválido', description: 'Informe um e-mail válido', variant: 'destructive' })
      return
    }
    if (docType === 'corte' && !selectedCorteId) {
      showToast({ title: 'Selecione um corte', description: 'Selecione a ficha de corte a enviar', variant: 'destructive' })
      return
    }

    setSending(true)
    try {
      const res = await fetch(`/api/pecas/${pecaId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: docType,
          corteId: docType === 'corte' ? selectedCorteId : undefined,
          recipient,
          modelagemIds: docType === 'ficha' ? selectedModelagemIds : [],
        }),
      })
      const result = await res.json()
      if (res.ok) {
        showToast({ title: 'Enviado!', description: `E-mail enviado para ${recipient}` })
        setRecipient('')
        setSelectedModelagemIds([])
        onOpenChange(false)
      } else {
        showToast({ title: 'Erro ao enviar', description: result.error || 'Erro desconhecido', variant: 'destructive' })
      }
    } catch {
      showToast({ title: 'Erro', description: 'Falha na comunicação com o servidor', variant: 'destructive' })
    } finally {
      setSending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-black rounded-xl">
              <Mail size={16} className="text-white" />
            </div>
            <DialogTitle className="text-base font-black uppercase tracking-tight">Enviar por E-mail</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-gray-400">
            {pecaNome}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4 space-y-5">
          {/* Tipo de documento */}
          <div>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Documento</p>
            <div className="flex gap-2">
              <button
                onClick={() => setDocType('ficha')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                  docType === 'ficha'
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                Ficha Técnica
              </button>
              <button
                onClick={() => setDocType('corte')}
                disabled={cortes.length === 0}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all border disabled:opacity-40 disabled:cursor-not-allowed ${
                  docType === 'corte'
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                Ficha de Corte
              </button>
            </div>
            {cortes.length === 0 && (
              <p className="text-[10px] text-gray-400 mt-1">Nenhuma ficha de corte disponível</p>
            )}
          </div>

          {/* Selector de corte */}
          {docType === 'corte' && cortes.length > 0 && (
            <div>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Selecionar Corte</p>
              <select
                value={selectedCorteId}
                onChange={e => setSelectedCorteId(e.target.value)}
                className="w-full text-sm font-medium border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
              >
                {cortes.map(c => (
                  <option key={c.id} value={c.id}>{c.numeroCorte}</option>
                ))}
              </select>
            </div>
          )}

          {/* Arquivos de modelagem */}
          {docType === 'ficha' && modelagens.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-1.5">
                  <Paperclip size={11} />
                  Arquivos de Modelagem
                </p>
                <button
                  onClick={toggleAll}
                  className="text-[10px] font-bold text-black underline"
                >
                  {selectedModelagemIds.length === modelagens.length ? 'Desmarcar todos' : 'Selecionar todos'}
                </button>
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {modelagens.map(m => (
                  <label
                    key={m.id}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={selectedModelagemIds.includes(m.id)}
                      onChange={() => toggleModelagem(m.id)}
                      className="w-4 h-4 accent-black rounded"
                    />
                    <span className="text-xs font-medium text-gray-700 truncate">{m.nome}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Destinatário */}
          <div>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Destinatário</p>
            <Input
              type="email"
              placeholder="nome@exemplo.com"
              value={recipient}
              onChange={e => setRecipient(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="rounded-xl"
            />
          </div>
        </div>

        <div className="px-6 pb-6">
          <Button
            onClick={handleSend}
            disabled={sending || !recipient}
            className="w-full rounded-2xl bg-black hover:bg-gray-800 text-white font-bold text-sm h-11 flex items-center gap-2"
          >
            {sending ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send size={15} />
            )}
            {sending ? 'Enviando...' : 'Enviar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
