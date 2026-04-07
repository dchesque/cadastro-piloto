'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import {
  Activity, ArrowLeft, Mail, Pencil, Plus, Trash2,
  Loader2, ChevronLeft, ChevronRight, Filter,
} from 'lucide-react'

interface LogEntry {
  id: string
  entidade: string
  entidadeId: string
  entidadeRef: string | null
  acao: string
  descricao: string | null
  usuario: string
  destinatario: string | null
  createdAt: string
}

const acaoBadge: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  criacao: { label: 'Criação', className: 'bg-green-50 text-green-700', icon: <Plus size={10} /> },
  edicao: { label: 'Edição', className: 'bg-blue-50 text-blue-700', icon: <Pencil size={10} /> },
  exclusao: { label: 'Exclusão', className: 'bg-red-50 text-red-600', icon: <Trash2 size={10} /> },
  email_enviado: { label: 'E-mail', className: 'bg-purple-50 text-purple-700', icon: <Mail size={10} /> },
}

export default function AdminLogsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [logs, setLogs] = useState<LogEntry[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const [filterEntidade, setFilterEntidade] = useState('')
  const [filterAcao, setFilterAcao] = useState('')
  const [filterUsuario, setFilterUsuario] = useState('')
  const [page, setPage] = useState(1)

  const isAdmin = (session?.user as any)?.role === 'admin'

  useEffect(() => {
    if (status === 'loading') return
    if (!session || !isAdmin) router.replace('/')
  }, [session, status, isAdmin, router])

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page) })
    if (filterEntidade) params.set('entidade', filterEntidade)
    if (filterAcao) params.set('acao', filterAcao)
    if (filterUsuario) params.set('usuario', filterUsuario)

    const res = await fetch(`/api/logs?${params}`)
    if (res.ok) {
      const data = await res.json()
      setLogs(data.data)
      setTotal(data.total)
      setPages(data.pages)
    }
    setLoading(false)
  }, [page, filterEntidade, filterAcao, filterUsuario])

  useEffect(() => {
    if (isAdmin) fetchLogs()
  }, [isAdmin, fetchLogs])

  function handleFilter() {
    setPage(1)
    fetchLogs()
  }

  if (status === 'loading') {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="max-w-5xl mx-auto pb-20 px-4 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <header className="mb-6">
        <Link href="/admin" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-all group mb-3">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Administração
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-black rounded-xl">
            <Activity size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Log de Atividades</h1>
            <p className="text-sm text-gray-400">{total} evento{total !== 1 ? 's' : ''} registrado{total !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </header>

      {/* Filtros */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={13} className="text-gray-400" />
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Filtros</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={filterEntidade}
            onChange={e => { setFilterEntidade(e.target.value); setPage(1) }}
            className="text-xs font-medium border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10 bg-white"
          >
            <option value="">Todas as entidades</option>
            <option value="PecaPiloto">Peças Piloto</option>
            <option value="CorteTecido">Cortes de Tecido</option>
          </select>

          <select
            value={filterAcao}
            onChange={e => { setFilterAcao(e.target.value); setPage(1) }}
            className="text-xs font-medium border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10 bg-white"
          >
            <option value="">Todas as ações</option>
            <option value="criacao">Criação</option>
            <option value="edicao">Edição</option>
            <option value="exclusao">Exclusão</option>
            <option value="email_enviado">E-mail enviado</option>
          </select>

          <input
            type="text"
            value={filterUsuario}
            onChange={e => { setFilterUsuario(e.target.value); setPage(1) }}
            placeholder="Filtrar por usuário..."
            className="text-xs font-medium border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10 flex-1 min-w-[160px]"
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
          </div>
        ) : logs.length === 0 ? (
          <div className="p-16 text-center text-gray-400">
            <Activity size={36} className="mx-auto mb-3 opacity-20" />
            <p className="font-bold text-sm">Nenhum evento encontrado</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="p-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Data/Hora</th>
                  <th className="p-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400 hidden sm:table-cell">Entidade</th>
                  <th className="p-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Referência</th>
                  <th className="p-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Ação</th>
                  <th className="p-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400 hidden md:table-cell">Usuário</th>
                  <th className="p-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400 hidden lg:table-cell">Destinatário</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => {
                  const badge = acaoBadge[log.acao] ?? { label: log.acao, className: 'bg-gray-100 text-gray-600', icon: null }
                  const href = log.entidade === 'PecaPiloto' ? `/pecas/${log.entidadeId}` : `/tecidos/${log.entidadeId}`
                  return (
                    <tr key={log.id} className={`border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/20'}`}>
                      <td className="p-4">
                        <p className="text-xs font-bold text-black whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {new Date(log.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <span className="text-[10px] font-black uppercase text-gray-400">
                          {log.entidade === 'PecaPiloto' ? 'Peça' : 'Tecido'}
                        </span>
                      </td>
                      <td className="p-4">
                        {log.acao !== 'exclusao' ? (
                          <Link href={href} className="text-xs font-bold text-black hover:underline">
                            {log.entidadeRef || log.entidadeId.slice(-6)}
                          </Link>
                        ) : (
                          <span className="text-xs font-bold text-gray-400 line-through">
                            {log.entidadeRef || log.entidadeId.slice(-6)}
                          </span>
                        )}
                        {log.descricao && (
                          <p className="text-[10px] text-gray-400 mt-0.5">{log.descricao}</p>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${badge.className}`}>
                          {badge.icon}{badge.label}
                        </span>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <span className="text-xs font-medium text-gray-600">{log.usuario}</span>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <span className="text-xs text-gray-400">{log.destinatario || '—'}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* Paginação */}
            {pages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-50">
                <p className="text-[11px] text-gray-400 font-medium">
                  Página {page} de {pages} · {total} eventos
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-xl border border-gray-200 hover:border-black/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(pages, p + 1))}
                    disabled={page === pages}
                    className="p-2 rounded-xl border border-gray-200 hover:border-black/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
