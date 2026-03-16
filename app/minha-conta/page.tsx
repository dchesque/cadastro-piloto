'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { showToast } from '@/components/ui/toast';
import { User, Shield, Key, Plus, Users, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface UserData {
  id: string;
  username: string;
  name: string | null;
  createdAt: string;
}

export default function MinhaContaPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New User State
  const [isNewUserOpen, setIsNewUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', password: '', name: '' });
  const [creating, setCreating] = useState(false);

  // Password Change State
  const [isPassChangeOpen, setIsPassChangeOpen] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [changing, setChanging] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (res.ok) setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (res.ok) {
        showToast({ title: 'Sucesso', description: 'Usuário criado com sucesso!' });
        setIsNewUserOpen(false);
        setNewUser({ username: '', password: '', name: '' });
        fetchUsers();
      } else {
        showToast({ title: 'Erro', description: data.error, variant: 'destructive' });
      }
    } catch (err) {
      showToast({ title: 'Erro', description: 'Falha ao criar usuário.', variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
        showToast({ title: 'Erro', description: 'As senhas não coincidem.', variant: 'destructive' });
        return;
    }
    setChanging(true);
    try {
      const res = await fetch('/api/users/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast({ title: 'Sucesso', description: 'Senha alterada com sucesso!' });
        setIsPassChangeOpen(false);
        setPasswords({ current: '', new: '', confirm: '' });
      } else {
        showToast({ title: 'Erro', description: data.error, variant: 'destructive' });
      }
    } catch (err) {
      showToast({ title: 'Erro', description: 'Falha ao alterar senha.', variant: 'destructive' });
    } finally {
      setChanging(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      <header className="flex items-center justify-between pb-2">
        <div className="space-y-1.5">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[--color-text-tertiary] hover:text-[--color-text-primary] transition-colors mb-2">
            <ArrowLeft size={14} />
            Voltar ao Dashboard
          </Link>
          <h1 className="text-3xl font-light text-[--color-text-primary] tracking-tight">Minha Conta</h1>
          <p className="text-sm text-[--color-text-secondary] font-medium uppercase tracking-widest">Gestão de acessos e perfil</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-[24px] p-6 shadow-card border border-[--color-border-light]">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-[--color-accent-tecido-light] flex items-center justify-center text-[--color-accent-tecido] text-2xl font-bold shadow-inner border border-[--color-accent-tecido]/10">
                {session?.user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-[--color-text-primary]">{session?.user?.name || 'Administrador'}</h2>
                <p className="text-sm text-[--color-text-tertiary] font-medium opacity-80">
                  {session?.user?.email || (session?.user as any)?.username ? `@${(session?.user as any).username}` : ''}
                </p>
              </div>
              <Button 
                variant="outline" 
                className="w-full rounded-[16px] h-12 border-[--color-border-medium] hover:border-[--color-text-primary] transition-all gap-2"
                onClick={() => setIsPassChangeOpen(true)}
              >
                <Key size={16} />
                Alterar Minha Senha
              </Button>
            </div>
          </div>

          <div className="bg-[#1A1917] rounded-[24px] p-6 shadow-premium text-white space-y-4">
            <div className="flex items-center gap-3">
              <Shield className="text-accent-tecido" size={20} />
              <h3 className="font-semibold text-sm uppercase tracking-wider">Acesso Seguro</h3>
            </div>
            <p className="text-xs text-white/60 leading-relaxed font-light">
              Suas credenciais são protegidas por criptografia de ponta a ponta. Novos usuários criados terão acesso total ao sistema.
            </p>
          </div>
        </div>

        {/* Users Management */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-[24px] shadow-card border border-[--color-border-light] overflow-hidden">
            <div className="p-6 border-b border-[--color-border-light] flex items-center justify-between bg-[--color-bg-page]/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-[--color-border-light] flex items-center justify-center shadow-sm">
                  <Users className="text-[--color-text-primary]" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-[--color-text-primary]">Equipe JC</h3>
                  <p className="text-[11px] text-[--color-text-tertiary] uppercase tracking-wider font-bold">Gerenciar Acessos</p>
                </div>
              </div>
              <Button 
                className="rounded-[14px] bg-[#1A1917] hover:bg-[#2C2C2A] h-10 px-5 shadow-lg shadow-black/5"
                onClick={() => setIsNewUserOpen(true)}
              >
                <Plus size={18} />
                Novo Usuário
              </Button>
            </div>

            <div className="divide-y divide-[--color-border-light]">
              {loading ? (
                <div className="p-12 text-center text-[--color-text-tertiary]">Carregando usuários...</div>
              ) : users.length === 0 ? (
                <div className="p-12 text-center text-[--color-text-tertiary]">Nenhum usuário encontrado.</div>
              ) : (
                users.map((u) => (
                  <div key={u.id} className="p-5 flex items-center justify-between hover:bg-[--color-bg-page]/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[--color-bg-subtle] flex items-center justify-center text-[--color-text-secondary] font-bold text-sm">
                        {u.name?.[0]?.toUpperCase() || u.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-[15px] font-semibold text-[--color-text-primary] leading-none mb-1">{u.name || u.username}</p>
                        <p className="text-[12px] text-[--color-text-tertiary] font-mono leading-none">@{u.username}</p>
                      </div>
                    </div>
                    <div className="text-[11px] text-[--color-text-tertiary] font-medium bg-[--color-bg-subtle] px-2 py-1 rounded-full uppercase tracking-wider">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New User Dialog */}
      <Dialog open={isNewUserOpen} onOpenChange={setIsNewUserOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[32px] p-8">
          <DialogHeader className="space-y-3">
            <div className="w-12 h-12 rounded-[16px] bg-[--color-accent-tecido-light] text-[--color-accent-tecido] flex items-center justify-center">
              <User size={24} />
            </div>
            <div className="space-y-1">
                <DialogTitle className="text-2xl font-light tracking-tight">Criar Acesso</DialogTitle>
                <DialogDescription className="text-sm font-medium text-[--color-text-secondary]">
                    Novos usuários terão acesso total ao sistema.
                </DialogDescription>
            </div>
          </DialogHeader>
          <form onSubmit={handleCreateUser} className="space-y-6">
            <div className="space-y-4">
              <Field label="Nome Completo">
                <input
                  required
                  className="w-full h-12 px-4 rounded-[12px] bg-[--color-bg-subtle] border border-[--color-border-light] focus:border-[--color-text-primary] focus:ring-1 focus:ring-[--color-text-primary] outline-none transition-all text-[15px] placeholder:text-[--color-text-tertiary]/50"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Ex: Maria Joaquina"
                />
              </Field>
              <Field label="Nome de Usuário (Login)">
                  <input
                    required
                    className="w-full h-12 px-4 rounded-[12px] bg-[--color-bg-subtle] border border-[--color-border-light] focus:border-[--color-text-primary] focus:ring-1 focus:ring-[--color-text-primary] outline-none transition-all text-[15px] placeholder:text-[--color-text-tertiary]/50 font-mono text-sm"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value.toLowerCase().replace(/\s/g, '') })}
                    placeholder="Ex: maria.j"
                  />
                </Field>
              <Field label="Senha Inicial">
                  <input
                    required
                    type="password"
                    className="w-full h-12 px-4 rounded-[12px] bg-[--color-bg-subtle] border border-[--color-border-light] focus:border-[--color-text-primary] focus:ring-1 focus:ring-[--color-text-primary] outline-none transition-all text-[15px] placeholder:text-[--color-text-tertiary]/50"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="••••••••"
                  />
                </Field>
            </div>
            <DialogFooter className="pt-6 flex flex-row gap-3">
              <Button type="button" variant="outline" className="flex-1 h-12 rounded-[16px] border-[--color-border-medium]" onClick={() => setIsNewUserOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={creating} className="flex-1 h-12 rounded-[16px] bg-[#1A1917] hover:bg-[#2C2C2A] shadow-premium">
                {creating ? 'Criando...' : 'Salvar Acesso'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isPassChangeOpen} onOpenChange={setIsPassChangeOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[32px] p-8">
          <DialogHeader className="space-y-3">
            <div className="w-12 h-12 rounded-[16px] bg-[--color-bg-subtle] text-[--color-text-primary] flex items-center justify-center">
              <Key size={24} />
            </div>
            <div className="space-y-1">
                <DialogTitle className="text-2xl font-light tracking-tight">Alterar Senha</DialogTitle>
                <DialogDescription className="text-sm font-medium text-[--color-text-secondary]">
                    Sua segurança é nossa prioridade.
                </DialogDescription>
            </div>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-6">
            <div className="space-y-4">
              <Field label="Senha Atual">
                <input
                  required
                  type="password"
                  className="w-full h-12 px-4 rounded-[12px] bg-[--color-bg-subtle] border border-[--color-border-light] focus:border-[--color-text-primary] focus:ring-1 focus:ring-[--color-text-primary] outline-none transition-all text-[15px] placeholder:text-[--color-text-tertiary]/50"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  placeholder="••••••••"
                />
              </Field>
              <div className="h-[1px] bg-[--color-border-light] my-2" />
              <Field label="Nova Senha">
                  <input
                    required
                    type="password"
                    className="w-full h-12 px-4 rounded-[12px] bg-[--color-bg-subtle] border border-[--color-border-light] focus:border-[--color-text-primary] focus:ring-1 focus:ring-[--color-text-primary] outline-none transition-all text-[15px] placeholder:text-[--color-text-tertiary]/50"
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    placeholder="••••••••"
                  />
                </Field>
              <Field label="Confirmar Nova Senha">
                  <input
                    required
                    type="password"
                    className="w-full h-12 px-4 rounded-[12px] bg-[--color-bg-subtle] border border-[--color-border-light] focus:border-[--color-text-primary] focus:ring-1 focus:ring-[--color-text-primary] outline-none transition-all text-[15px] placeholder:text-[--color-text-tertiary]/50"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    placeholder="••••••••"
                  />
                </Field>
            </div>
            <DialogFooter className="pt-6 flex flex-row gap-3">
              <Button type="button" variant="outline" className="flex-1 h-12 rounded-[16px] border-[--color-border-medium]" onClick={() => setIsPassChangeOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={changing} className="flex-1 h-12 rounded-[16px] bg-[#1A1917] hover:bg-[#2C2C2A] shadow-premium">
                {changing ? 'Salvando...' : 'Atualizar Senha'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
