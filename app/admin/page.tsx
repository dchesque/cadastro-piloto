'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import {
  Users, Activity, Settings2, ArrowRight, Shield, CheckCircle2,
  XCircle, Mail, Pencil, Plus, Trash2, Loader2, ArrowLeft,
} from 'lucide-react'

interface Stats {
  usuarios: { total: number; ativos: number; admins: number }
  logs: { total: number; recentes: LogEntry[] }
  sistema: { smtpConfigurado: boolean; emailRestrito: boolean }
}

interface LogEntry {
  id: string
  entidade: string
  entidadeRef: string | null
  acao: string
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

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'agora'
  if (mins < 60) return `${mins}min atrás`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h atrás`
  return `${Math.floor(hrs / 24)}d atrás`
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  const isAdmin = (session?.user as any)?.role === 'admin'

  useEffect(() => {
    if (status === 'loading') return
    if (!session || !isAdmin) router.replace('/')
  }, [session, status, isAdmin, router])

  useEffect(() => {
    if (!isAdmin) return
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(setStats)
      .finally(() => setLoading(false))
  }, [isAdmin])

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!isAdmin || !stats) return null

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-black rounded-xl">
            <Shield size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Administração</h1>
            <p className="text-sm text-gray-400">Painel de controle do sistema</p>
          </div>
        </div>
      </header>

      {/* Cards de stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

        {/* Usuários */}
        <Link href="/admin/usuarios" className="group bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-black/10 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-black rounded-xl">
              <Users size={16} className="text-white" />
            </div>
            <ArrowRight size={16} className="text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-3xl font-black text-black">{stats.usuarios.total}</p>
          <p className="text-sm font-bold text-gray-500 mt-0.5">Usuários</p>
          <div className="mt-3 flex gap-3 text-[11px] font-bold">
            <span className="text-green-600">{stats.usuarios.ativos} ativos</span>
            <span className="text-gray-300">·</span>
            <span className="text-gray-500">{stats.usuarios.admins} admin{stats.usuarios.admins !== 1 ? 's' : ''}</span>
          </div>
        </Link>

        {/* Atividade */}
        <Link href="/admin/logs" className="group bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-black/10 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-black rounded-xl">
              <Activity size={16} className="text-white" />
            </div>
            <ArrowRight size={16} className="text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-3xl font-black text-black">{stats.logs.total}</p>
          <p className="text-sm font-bold text-gray-500 mt-0.5">Eventos registrados</p>
          {stats.logs.recentes[0] && (
            <p className="mt-3 text-[11px] font-bold text-gray-400">
              Último: {timeAgo(stats.logs.recentes[0].createdAt)}
            </p>
          )}
        </Link>

        {/* Status do sistema */}
        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-black rounded-xl">
              <Settings2 size={16} className="text-white" />
            </div>
          </div>
          <p className="text-sm font-black text-black mb-3">Status do Sistema</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {stats.sistema.smtpConfigurado
                ? <CheckCircle2 size={13} className="text-green-600 flex-shrink-0" />
                : <XCircle size={13} className="text-red-500 flex-shrink-0" />}
              <span className={`text-[11px] font-bold ${stats.sistema.smtpConfigurado ? 'text-green-700' : 'text-red-600'}`}>
                SMTP {stats.sistema.smtpConfigurado ? 'configurado' : 'não configurado'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {stats.sistema.emailRestrito
                ? <CheckCircle2 size={13} className="text-blue-600 flex-shrink-0" />
                : <CheckCircle2 size={13} className="text-gray-400 flex-shrink-0" />}
              <span className="text-[11px] font-bold text-gray-600">
                E-mail {stats.sistema.emailRestrito ? 'restrito a cadastrados' : 'livre para qualquer endereço'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Atividade recente */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Atividade Recente</p>
          <Link href="/admin/logs" className="text-[11px] font-bold text-black hover:underline flex items-center gap-1">
            Ver tudo <ArrowRight size={12} />
          </Link>
        </div>

        {stats.logs.recentes.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            <Activity size={32} className="mx-auto mb-2 opacity-20" />
            <p className="text-sm font-bold">Nenhuma atividade registrada</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {stats.logs.recentes.map(log => {
              const badge = acaoBadge[log.acao] ?? { label: log.acao, className: 'bg-gray-100 text-gray-600', icon: null }
              const href = log.entidade === 'PecaPiloto'
                ? `/pecas/${log.entidadeRef ? '' : ''}` // fallback — usa entidadeRef como display
                : `/tecidos/`
              return (
                <div key={log.id} className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50/50 transition-colors">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase flex-shrink-0 ${badge.className}`}>
                    {badge.icon}{badge.label}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-black">
                      {log.entidadeRef || log.entidade}
                    </span>
                    {log.destinatario && (
                      <span className="text-[10px] text-gray-400 ml-1">→ {log.destinatario}</span>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[11px] font-bold text-gray-500">{log.usuario}</p>
                    <p className="text-[10px] text-gray-300">{timeAgo(log.createdAt)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Links rápidos */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Link
          href="/admin/usuarios"
          className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-5 py-4 hover:border-black/20 hover:shadow-sm transition-all group"
        >
          <Users size={16} className="text-gray-400 group-hover:text-black transition-colors" />
          <span className="text-sm font-bold text-gray-700 group-hover:text-black transition-colors">Gerenciar Usuários</span>
          <ArrowRight size={14} className="ml-auto text-gray-300 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
        </Link>
        <Link
          href="/admin/logs"
          className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-5 py-4 hover:border-black/20 hover:shadow-sm transition-all group"
        >
          <Activity size={16} className="text-gray-400 group-hover:text-black transition-colors" />
          <span className="text-sm font-bold text-gray-700 group-hover:text-black transition-colors">Log de Atividades</span>
          <ArrowRight size={14} className="ml-auto text-gray-300 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>
    </div>
  )
}
