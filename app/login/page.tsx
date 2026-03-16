'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { showToast } from '@/components/ui/toast';
import { Lock, User as UserIcon, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        username: formData.username,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        showToast({
          title: 'Erro de Autenticação',
          description: 'Usuário ou senha incorretos.',
          variant: 'destructive',
        });
      } else {
        showToast({
          title: 'Bem-vindo!',
          description: 'Login realizado com sucesso.',
        });
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      showToast({
        title: 'Erro',
        description: 'Ocorreu um erro ao tentar entrar.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[--color-bg-page] flex items-center justify-center p-6 animate-in fade-in duration-1000">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[24px] bg-white border border-[--color-border-light] shadow-sm mb-4">
            <Lock className="text-[--color-text-primary]" size={28} />
          </div>
          <h1 className="text-3xl font-light text-[--color-text-primary] tracking-tight">JC STUDIO</h1>
          <p className="text-[13px] text-[--color-text-secondary] font-medium leading-relaxed max-w-[280px] mx-auto">
            Sistema interno de gestão de tecidos e pilotos <span className="text-[--color-text-primary] font-bold">JC PLUS SIZE</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-[--color-border-light] rounded-[32px] p-8 shadow-card space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[--color-text-secondary] ml-1">
                Usuário
              </label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[--color-text-tertiary] group-focus-within:text-[--color-text-primary] transition-colors" size={18} />
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full h-12 pl-12 pr-4 bg-[--color-bg-subtle] border border-[--color-border-medium] rounded-[16px] text-[15px] focus:outline-none focus:border-[--color-text-primary] focus:bg-white transition-all"
                  placeholder="Seu usuário"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[--color-text-secondary] ml-1">
                Senha
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[--color-text-tertiary] group-focus-within:text-[--color-text-primary] transition-colors" size={18} />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full h-12 pl-12 pr-4 bg-[--color-bg-subtle] border border-[--color-border-medium] rounded-[16px] text-[15px] focus:outline-none focus:border-[--color-text-primary] focus:bg-white transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#1A1917] hover:bg-[#2C2C2A] text-white rounded-[16px] font-medium text-[15px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-black/10"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Entrar no sistema
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-[12px] text-[--color-text-tertiary]">
          Protegido por criptografia de ponta a ponta
        </p>
      </div>
    </div>
  );
}
