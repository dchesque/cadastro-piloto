'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { showToast } from '@/components/ui/toast'
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  Key,
  Shield,
  ShieldOff,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface User {
  id: string
  username: string
  email: string | null
  name: string | null
  role: string
  ativo: boolean
  createdAt: string
}

type ModalMode = 'create' | 'edit' | 'password' | null

export default function AdminUsuariosPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  const [saving, setSaving] = useState(false)

  // Form state
  const [formUsername, setFormUsername] = useState('')
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formRole, setFormRole] = useState<'user' | 'admin'>('user')
  const [formAtivo, setFormAtivo] = useState(true)
  const [formPassword, setFormPassword] = useState('')
  const [formNewPassword, setFormNewPassword] = useState('')

  const isAdmin = (session?.user as any)?.role === 'admin'

  useEffect(() => {
    if (status === 'loading') return
    if (!session || !isAdmin) {
      router.replace('/')
    }
  }, [session, status, isAdmin, router])

  useEffect(() => {
    if (isAdmin) fetchUsers()
  }, [isAdmin])

  async function fetchUsers() {
    setLoading(true)
    try {
      const res = await fetch('/api/users')
      if (res.ok) setUsers(await res.json())
    } finally {
      setLoading(false)
    }
  }

  function openCreate() {
    setFormUsername('')
    setFormName('')
    setFormEmail('')
    setFormRole('user')
    setFormAtivo(true)
    setFormPassword('')
    setSelectedUser(null)
    setModalMode('create')
  }

  function openEdit(user: User) {
    setFormName(user.name || '')
    setFormEmail(user.email || '')
    setFormRole(user.role as 'user' | 'admin')
    setFormAtivo(user.ativo)
    setSelectedUser(user)
    setModalMode('edit')
  }

  function openPassword(user: User) {
    setFormNewPassword('')
    setSelectedUser(user)
    setModalMode('password')
  }

  async function handleCreate() {
    if (!formUsername || !formPassword) {
      showToast({ title: 'Campos obrigatórios', description: 'Usuário e senha são obrigatórios', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formUsername, password: formPassword, name: formName, email: formEmail || null, role: formRole }),
      })
      const data = await res.json()
      if (res.ok) {
        showToast({ title: 'Usuário criado', description: `@${data.username} adicionado com sucesso` })
        setModalMode(null)
        fetchUsers()
      } else {
        showToast({ title: 'Erro', description: data.error, variant: 'destructive' })
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleEdit() {
    if (!selectedUser) return
    setSaving(true)
    try {
      const res = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formName, email: formEmail || null, role: formRole, ativo: formAtivo }),
      })
      const data = await res.json()
      if (res.ok) {
        showToast({ title: 'Usuário atualizado' })
        setModalMode(null)
        fetchUsers()
      } else {
        showToast({ title: 'Erro', description: data.error, variant: 'destructive' })
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleResetPassword() {
    if (!selectedUser || !formNewPassword) return
    if (formNewPassword.length < 4) {
      showToast({ title: 'Senha muito curta', description: 'Mínimo 4 caracteres', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: formNewPassword }),
      })
      if (res.ok) {
        showToast({ title: 'Senha redefinida', description: `Senha de @${selectedUser.username} atualizada` })
        setModalMode(null)
      } else {
        const data = await res.json()
        showToast({ title: 'Erro', description: data.error, variant: 'destructive' })
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setSaving(true)
    try {
      const res = await fetch(`/api/users/${deleteTarget.id}`, { method: 'DELETE' })
      if (res.ok) {
        showToast({ title: 'Usuário excluído' })
        setDeleteTarget(null)
        fetchUsers()
      } else {
        const data = await res.json()
        showToast({ title: 'Erro', description: data.error, variant: 'destructive' })
      }
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 px-4 pt-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-all group mb-3">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Voltar
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-black rounded-xl">
              <Users size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Gerenciar Usuários</h1>
              <p className="text-sm text-gray-400">{users.length} usuário{users.length !== 1 ? 's' : ''} cadastrado{users.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>
        <Button onClick={openCreate} className="bg-black hover:bg-gray-800 text-white font-bold rounded-2xl h-10 px-4 flex items-center gap-2">
          <Plus size={16} /> Novo Usuário
        </Button>
      </header>

      {/* Tabela */}
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        {users.length === 0 ? (
          <div className="p-16 text-center text-gray-400">
            <Users size={40} className="mx-auto mb-3 opacity-20" />
            <p className="font-bold text-sm">Nenhum usuário cadastrado</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="p-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Usuário</th>
                <th className="p-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400 hidden sm:table-cell">E-mail</th>
                <th className="p-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400 hidden md:table-cell">Perfil</th>
                <th className="p-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-400 hidden md:table-cell">Status</th>
                <th className="p-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => {
                const isSelf = user.id === (session?.user as any)?.id
                return (
                  <tr key={user.id} className={`border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/20'}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-black text-xs flex-shrink-0">
                          {(user.name || user.username).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-black">{user.name || user.username}</p>
                          <p className="text-[10px] text-gray-400 font-medium">@{user.username}{isSelf ? ' (você)' : ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <p className="text-sm text-gray-600">{user.email || <span className="text-gray-300 italic text-xs">Não informado</span>}</p>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        user.role === 'admin'
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {user.role === 'admin' ? <Shield size={10} /> : <ShieldOff size={10} />}
                        {user.role === 'admin' ? 'Admin' : 'Usuário'}
                      </span>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        user.ativo
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-600'
                      }`}>
                        {user.ativo ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                        {user.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => openEdit(user)}
                          className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-black transition-all"
                          title="Editar"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => openPassword(user)}
                          className="p-2 rounded-xl hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-all"
                          title="Redefinir senha"
                        >
                          <Key size={14} />
                        </button>
                        {!isSelf && (
                          <button
                            onClick={() => setDeleteTarget(user)}
                            className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
                            title="Excluir"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Criar */}
      {modalMode === 'create' && (
        <Modal title="Novo Usuário" onClose={() => setModalMode(null)}>
          <div className="space-y-4">
            <Field label="Nome completo">
              <Input value={formName} onChange={e => setFormName(e.target.value)} placeholder="Ex: Maria Silva" className="rounded-xl" />
            </Field>
            <Field label="Nome de usuário *">
              <Input value={formUsername} onChange={e => setFormUsername(e.target.value)} placeholder="Ex: maria.silva" className="rounded-xl font-mono" />
            </Field>
            <Field label="E-mail">
              <Input type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)} placeholder="email@empresa.com" className="rounded-xl" />
            </Field>
            <Field label="Senha *">
              <Input type="password" value={formPassword} onChange={e => setFormPassword(e.target.value)} placeholder="Mínimo 4 caracteres" className="rounded-xl" />
            </Field>
            <Field label="Perfil">
              <RoleSelect value={formRole} onChange={setFormRole} />
            </Field>
            <div className="flex gap-3 pt-2">
              <Button onClick={handleCreate} disabled={saving} className="flex-1 bg-black hover:bg-gray-800 text-white rounded-2xl font-bold">
                {saving ? <Loader2 size={16} className="animate-spin" /> : 'Criar Usuário'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Editar */}
      {modalMode === 'edit' && selectedUser && (
        <Modal title={`Editar @${selectedUser.username}`} onClose={() => setModalMode(null)}>
          <div className="space-y-4">
            <Field label="Nome completo">
              <Input value={formName} onChange={e => setFormName(e.target.value)} placeholder="Nome completo" className="rounded-xl" />
            </Field>
            <Field label="E-mail">
              <Input type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)} placeholder="email@empresa.com" className="rounded-xl" />
            </Field>
            <Field label="Perfil">
              <RoleSelect value={formRole} onChange={setFormRole} />
            </Field>
            <Field label="Status">
              <div className="flex gap-2">
                <button
                  onClick={() => setFormAtivo(true)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${formAtivo ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}
                >
                  <CheckCircle2 size={13} /> Ativo
                </button>
                <button
                  onClick={() => setFormAtivo(false)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${!formAtivo ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}
                >
                  <XCircle size={13} /> Inativo
                </button>
              </div>
            </Field>
            <div className="flex gap-3 pt-2">
              <Button onClick={handleEdit} disabled={saving} className="flex-1 bg-black hover:bg-gray-800 text-white rounded-2xl font-bold">
                {saving ? <Loader2 size={16} className="animate-spin" /> : 'Salvar'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Redefinir Senha */}
      {modalMode === 'password' && selectedUser && (
        <Modal title={`Redefinir senha de @${selectedUser.username}`} onClose={() => setModalMode(null)}>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">A nova senha será aplicada imediatamente. O usuário deverá usar a nova senha no próximo login.</p>
            <Field label="Nova senha">
              <Input type="password" value={formNewPassword} onChange={e => setFormNewPassword(e.target.value)} placeholder="Mínimo 4 caracteres" className="rounded-xl" />
            </Field>
            <div className="flex gap-3 pt-2">
              <Button onClick={handleResetPassword} disabled={saving || !formNewPassword} className="flex-1 bg-black hover:bg-gray-800 text-white rounded-2xl font-bold">
                {saving ? <Loader2 size={16} className="animate-spin" /> : 'Redefinir Senha'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Confirmar Exclusão */}
      {deleteTarget && (
        <Modal title="Excluir usuário" onClose={() => setDeleteTarget(null)}>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Deseja excluir permanentemente o usuário <span className="font-black">@{deleteTarget.username}</span>? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 pt-2">
              <Button onClick={() => setDeleteTarget(null)} variant="outline" className="flex-1 rounded-2xl font-bold">Cancelar</Button>
              <Button onClick={handleDelete} disabled={saving} className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold">
                {saving ? <Loader2 size={16} className="animate-spin" /> : 'Excluir'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ─── Componentes auxiliares ────────────────────────────────────────────────────

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
        <h2 className="text-base font-black uppercase tracking-tight mb-5">{title}</h2>
        {children}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1.5">{label}</p>
      {children}
    </div>
  )
}

function RoleSelect({ value, onChange }: { value: 'user' | 'admin'; onChange: (v: 'user' | 'admin') => void }) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onChange('user')}
        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${value === 'user' ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}
      >
        <ShieldOff size={13} /> Usuário
      </button>
      <button
        type="button"
        onClick={() => onChange('admin')}
        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${value === 'admin' ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}
      >
        <Shield size={13} /> Admin
      </button>
    </div>
  )
}
