'use client'

import { useEffect, useRef, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Lock, User as UserIcon, ArrowRight, ArrowLeft, Mail, MessageCircle, Phone, CheckCircle2, AlertCircle } from 'lucide-react'
import { FlowModaMark } from '@/components/flowmoda-wordmark'

type View =
  | 'password'
  | 'otp-request'
  | 'otp-verify'
  | 'forgot'
  | 'forgot-sent'
  | 'support-channel'
  | 'support-form'
  | 'support-sent'
  | 'success'

type SupportChannel = 'email' | 'whatsapp'

const TRANSITION = 'transition-[opacity,transform] duration-[320ms]'

function maskPhoneBR(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

export default function LoginPage() {
  const router = useRouter()
  const [view, setView] = useState<View>('password')
  const [authMode, setAuthMode] = useState<'password' | 'otp'>('password')

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userName, setUserName] = useState('')

  // OTP
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', ''])
  const [otpCountdown, setOtpCountdown] = useState(45)
  const otpRefs = useRef<Array<HTMLInputElement | null>>([])

  // Support
  const [supportChannel, setSupportChannel] = useState<SupportChannel | null>(null)
  const [supportForm, setSupportForm] = useState({ nome: '', email: '', telefone: '' })

  // Countdown
  useEffect(() => {
    if (view !== 'otp-verify' || otpCountdown <= 0) return
    const t = setInterval(() => setOtpCountdown((c) => Math.max(0, c - 1)), 1000)
    return () => clearInterval(t)
  }, [view, otpCountdown])

  // Reset error when view changes
  useEffect(() => {
    setError(null)
  }, [view])

  const goView = (next: View) => {
    setView(next)
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const result = await signIn('credentials', {
        username: identifier,
        password,
        redirect: false,
      })
      if (result?.error) {
        setError('Usuário ou senha incorretos.')
      } else {
        setUserName(identifier.split('@')[0] || identifier)
        setView('success')
        setTimeout(() => {
          router.push('/')
          router.refresh()
        }, 1600)
      }
    } catch {
      setError('Ocorreu um erro ao tentar entrar.')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isEmail(identifier)) {
      setError('Informe um e-mail válido.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      // Stub: implementar envio real plugando nodemailer em /api/auth/otp/request
      await fetch('/api/auth/otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier }),
      }).catch(() => {})
      setOtpCountdown(45)
      setOtp(['', '', '', '', '', ''])
      setView('otp-verify')
      setTimeout(() => otpRefs.current[0]?.focus(), 350)
    } finally {
      setLoading(false)
    }
  }

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length !== 6) {
      setError('Digite os 6 dígitos do código.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      // Stub: validar via /api/auth/otp/verify e iniciar sessão
      const r = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier, code }),
      })
      if (!r.ok) {
        setError('Código inválido. Funcionalidade em configuração — utilize senha por enquanto.')
        return
      }
      setUserName(identifier.split('@')[0] || identifier)
      setView('success')
      setTimeout(() => {
        router.push('/')
        router.refresh()
      }, 1600)
    } catch {
      setError('Falha ao verificar código.')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (i: number, v: string) => {
    const digit = v.replace(/\D/g, '').slice(-1)
    if (!digit && !v) {
      const next = [...otp]
      next[i] = ''
      setOtp(next)
      return
    }
    const next = [...otp]
    next[i] = digit
    setOtp(next)
    if (digit && i < 5) otpRefs.current[i + 1]?.focus()
  }

  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      otpRefs.current[i - 1]?.focus()
    } else if (e.key === 'ArrowLeft' && i > 0) {
      otpRefs.current[i - 1]?.focus()
    } else if (e.key === 'ArrowRight' && i < 5) {
      otpRefs.current[i + 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!text) return
    e.preventDefault()
    const next = ['', '', '', '', '', '']
    for (let j = 0; j < text.length; j++) next[j] = text[j]
    setOtp(next)
    otpRefs.current[Math.min(text.length, 5)]?.focus()
  }

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await fetch('/api/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      }).catch(() => {})
      setView('forgot-sent')
    } finally {
      setLoading(false)
    }
  }

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supportChannel) return
    if (
      supportForm.nome.trim().length < 2 ||
      !isEmail(supportForm.email) ||
      supportForm.telefone.replace(/\D/g, '').length < 10
    ) {
      setError('Verifique nome, e-mail e telefone.')
      return
    }
    if (supportChannel === 'whatsapp') {
      const text = encodeURIComponent(
        `Olá, sou ${supportForm.nome} (${supportForm.email}). Preciso de suporte no FlowModa.`,
      )
      // TODO: substituir pelo número real de suporte
      window.open(`https://wa.me/5511999999999?text=${text}`, '_blank')
      setView('support-sent')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...supportForm, canal: supportChannel }),
      }).catch(() => {})
      setView('support-sent')
    } finally {
      setLoading(false)
    }
  }

  const supportFormValid =
    supportForm.nome.trim().length >= 2 &&
    isEmail(supportForm.email) &&
    supportForm.telefone.replace(/\D/g, '').length >= 10

  return (
    <div className="grid min-h-dvh w-full grid-cols-1 lg:grid-cols-2">
      {/* Left panel — dark editorial */}
      <aside className="relative hidden overflow-hidden bg-[#111110] text-white lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse at 30% 40%, black 0%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 30% 40%, black 0%, transparent 75%)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(5,150,105,0.18) 0%, transparent 60%)',
          }}
        />
        <div className="relative">
          <div className="flex items-center gap-3">
            <FlowModaMark size="lg" />
            <span className="text-[28px] tracking-[-0.4px]" style={{ fontFamily: 'var(--font-sans)' }}>
              <span className="font-light text-white">flow</span>
              <span className="font-bold text-white">moda</span>
              <span className="text-[#059669]">.</span>
            </span>
          </div>
          <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.24em] text-[#52504C]">
            Gestão de Produção
          </p>
        </div>

        <div className="relative">
          <h2 className="text-[40px] font-extralight leading-[1.1] tracking-[-1.2px] text-white">
            O desenvolvimento da <br />
            <span className="font-semibold">sua coleção</span> — do <br />
            croqui à produção, em <br />
            um <span className="font-semibold">fluxo único</span>
            <span className="text-[#059669]">.</span>
          </h2>
        </div>

        <div className="relative flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#52504C]">
          <span className="relative h-[7px] w-[7px]">
            <span
              className="absolute inset-0 rounded-full bg-[#059669]"
              style={{ animation: 'fmStatusPing 2s ease-in-out infinite' }}
            />
            <span className="absolute inset-0 rounded-full bg-[#059669]" />
          </span>
          Conexão segura · TLS 1.3
        </div>
      </aside>

      {/* Right panel — form */}
      <main className="flex min-h-dvh items-center justify-center bg-[--color-bg-page] p-6">
        <div className="w-full max-w-[420px]">
          {/* Mobile brand header */}
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <FlowModaMark size="md" />
            <span className="text-[18px] tracking-[-0.2px]" style={{ fontFamily: 'var(--font-sans)' }}>
              <span className="font-light text-[#1A1917]">flow</span>
              <span className="font-bold text-[#1A1917]">moda</span>
              <span className="text-[#059669]">.</span>
            </span>
          </div>

          {/* Heading */}
          {(view === 'password' || view === 'otp-request') && (
            <div className="mb-6">
              <h1 className="text-[28px] font-light leading-tight tracking-[-0.5px] text-[#1A1917]">
                Bem-vindo de volta
                <span className="text-[#059669]">.</span>
              </h1>
              <p className="mt-1 text-[13px] text-[--color-text-secondary]">
                Acesse sua conta para continuar.
              </p>
            </div>
          )}

          {view === 'forgot' && (
            <div className="mb-6">
              <h1 className="text-[28px] font-light tracking-[-0.5px] text-[#1A1917]">
                Recuperar senha
              </h1>
              <p className="mt-1 text-[13px] text-[--color-text-secondary]">
                Enviaremos um link de recuperação para seu e-mail.
              </p>
            </div>
          )}

          {view === 'support-channel' && (
            <div className="mb-6">
              <h1 className="text-[28px] font-light tracking-[-0.5px] text-[#1A1917]">
                Como podemos ajudar?
              </h1>
              <p className="mt-1 text-[13px] text-[--color-text-secondary]">
                Escolha um canal de atendimento.
              </p>
            </div>
          )}

          {/* Toggle pill */}
          {(view === 'password' || view === 'otp-request') && (
            <div className="mb-5 flex items-center rounded-[12px] border border-[--color-border-light] bg-[--color-bg-subtle] p-1">
              {(
                [
                  ['password', 'Senha'],
                  ['otp', 'Código por e-mail'],
                ] as const
              ).map(([mode, label]) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    setAuthMode(mode)
                    setView(mode === 'password' ? 'password' : 'otp-request')
                  }}
                  className={`flex-1 rounded-[8px] px-3 py-2 text-[12px] font-semibold transition-all ${
                    authMode === mode
                      ? 'bg-white text-[#1A1917] shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                      : 'text-[--color-text-tertiary] hover:text-[--color-text-secondary]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-[12px] border border-[#F0C4C4] bg-[--color-status-danger-bg] px-3 py-2.5 text-[12px] text-[--color-status-danger-text]">
              <AlertCircle size={14} className="mt-px flex-shrink-0" strokeWidth={2.2} />
              <span>{error}</span>
            </div>
          )}

          <div className={TRANSITION} style={{ animation: 'fmFadeUp 0.32s cubic-bezier(0.4,0,0.2,1) both' }} key={view}>
            {/* Password form */}
            {view === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <FormField label="Usuário ou e-mail" icon={<UserIcon size={18} strokeWidth={1.8} />}>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Seu usuário"
                    className="form-input"
                  />
                </FormField>
                <FormField label="Senha" icon={<Lock size={18} strokeWidth={1.8} />}>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="form-input"
                  />
                </FormField>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => goView('forgot')}
                    className="text-[12px] font-semibold text-[--color-text-secondary] hover:text-[--color-text-primary]"
                  >
                    Esqueci minha senha
                  </button>
                </div>

                <SubmitButton loading={loading}>
                  Entrar no sistema
                  <ArrowRight size={18} />
                </SubmitButton>
              </form>
            )}

            {/* OTP request */}
            {view === 'otp-request' && (
              <form onSubmit={handleOtpRequest} className="space-y-4">
                <FormField label="E-mail" icon={<Mail size={18} strokeWidth={1.8} />}>
                  <input
                    type="email"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="seu@email.com"
                    className="form-input"
                  />
                </FormField>
                <p className="text-[12px] text-[--color-text-tertiary]">
                  Enviaremos um código de 6 dígitos para seu e-mail.
                </p>
                <SubmitButton loading={loading}>
                  Enviar código
                  <ArrowRight size={18} />
                </SubmitButton>
              </form>
            )}

            {/* OTP verify */}
            {view === 'otp-verify' && (
              <form onSubmit={handleOtpVerify} className="space-y-5">
                <button
                  type="button"
                  onClick={() => setView('otp-request')}
                  className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[--color-text-secondary] hover:text-[--color-text-primary]"
                >
                  <ArrowLeft size={13} /> Alterar e-mail
                </button>
                <div>
                  <p className="text-[13px] text-[--color-text-secondary]">
                    Código enviado para{' '}
                    <strong className="text-[--color-text-primary]">{identifier}</strong>
                  </p>
                </div>
                <div className="flex justify-between gap-2">
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        otpRefs.current[i] = el
                      }}
                      inputMode="numeric"
                      maxLength={1}
                      value={d}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      onPaste={handleOtpPaste}
                      className="h-14 w-12 rounded-[12px] border border-[--color-border-medium] bg-[--color-bg-subtle] text-center text-[22px] font-bold text-[--color-text-primary] outline-none transition-all focus:border-[--color-text-primary] focus:bg-white focus:shadow-[0_0_0_3px_rgba(26,25,23,0.05)]"
                    />
                  ))}
                </div>
                <div className="text-center">
                  {otpCountdown > 0 ? (
                    <p className="text-[12px] text-[--color-text-tertiary]">
                      Reenviar código em {otpCountdown}s
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setOtpCountdown(45)
                        fetch('/api/auth/otp/request', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email: identifier }),
                        }).catch(() => {})
                      }}
                      className="text-[12px] font-semibold text-[#059669] hover:underline"
                    >
                      Reenviar código
                    </button>
                  )}
                </div>
                <SubmitButton loading={loading}>
                  Verificar código
                  <ArrowRight size={18} />
                </SubmitButton>
              </form>
            )}

            {/* Forgot */}
            {view === 'forgot' && (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <FormField label="E-mail ou usuário" icon={<Mail size={18} strokeWidth={1.8} />}>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="seu@email.com"
                    className="form-input"
                  />
                </FormField>
                <button
                  type="button"
                  onClick={() => setView('password')}
                  className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[--color-text-secondary] hover:text-[--color-text-primary]"
                >
                  <ArrowLeft size={13} /> Voltar ao login
                </button>
                <SubmitButton loading={loading}>
                  Enviar link de recuperação
                  <ArrowRight size={18} />
                </SubmitButton>
              </form>
            )}

            {view === 'forgot-sent' && (
              <ConfirmCard
                tone="ok"
                title="Link enviado"
                description={
                  <>
                    Verifique sua caixa de entrada em{' '}
                    <strong className="text-[--color-text-primary]">{identifier}</strong>. O link
                    expira em 30 minutos.
                  </>
                }
                onBack={() => setView('password')}
                backLabel="Voltar ao login"
              />
            )}

            {/* Support — channel choice */}
            {view === 'support-channel' && (
              <div className="space-y-3">
                {(
                  [
                    {
                      id: 'email' as const,
                      icon: Mail,
                      title: 'E-mail',
                      meta: 'Resposta em até 4h úteis',
                    },
                    {
                      id: 'whatsapp' as const,
                      icon: MessageCircle,
                      title: 'WhatsApp',
                      meta: 'Tempo real · seg–sex, 9h às 18h',
                    },
                  ]
                ).map((c) => {
                  const Icon = c.icon
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setSupportChannel(c.id)
                        setView('support-form')
                      }}
                      className="group flex w-full items-center gap-4 rounded-[16px] border border-[--color-border-light] bg-white p-4 text-left transition-all hover:border-[#1A1917] hover:shadow-[0_4px_12px_rgba(26,25,23,0.06)]"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[--color-bg-subtle] text-[--color-text-secondary] transition-colors group-hover:bg-[--color-accent-tecido-light] group-hover:text-[--color-accent-tecido]">
                        <Icon size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[14px] font-semibold text-[--color-text-primary]">
                          {c.title}
                        </p>
                        <p className="text-[11px] text-[--color-text-tertiary]">{c.meta}</p>
                      </div>
                      <ArrowRight
                        size={16}
                        className="text-[--color-text-tertiary] transition-transform group-hover:translate-x-0.5"
                      />
                    </button>
                  )
                })}
                <button
                  type="button"
                  onClick={() => setView('password')}
                  className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[--color-text-secondary] hover:text-[--color-text-primary]"
                >
                  <ArrowLeft size={13} /> Voltar ao login
                </button>
              </div>
            )}

            {/* Support — form */}
            {view === 'support-form' && (
              <form onSubmit={handleSupportSubmit} className="space-y-4">
                <button
                  type="button"
                  onClick={() => setView('support-channel')}
                  className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[--color-text-secondary] hover:text-[--color-text-primary]"
                >
                  <ArrowLeft size={13} /> Escolher outro canal
                </button>
                <FormField label="Nome" icon={<UserIcon size={18} strokeWidth={1.8} />}>
                  <input
                    type="text"
                    required
                    value={supportForm.nome}
                    onChange={(e) => setSupportForm((f) => ({ ...f, nome: e.target.value }))}
                    placeholder="Seu nome"
                    className="form-input"
                  />
                </FormField>
                <FormField label="E-mail" icon={<Mail size={18} strokeWidth={1.8} />}>
                  <input
                    type="email"
                    required
                    value={supportForm.email}
                    onChange={(e) => setSupportForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="seu@email.com"
                    className="form-input"
                  />
                </FormField>
                <FormField label="Telefone" icon={<Phone size={18} strokeWidth={1.8} />}>
                  <input
                    type="tel"
                    required
                    value={supportForm.telefone}
                    onChange={(e) =>
                      setSupportForm((f) => ({ ...f, telefone: maskPhoneBR(e.target.value) }))
                    }
                    placeholder="(11) 98765-4321"
                    className="form-input"
                  />
                </FormField>
                <SubmitButton loading={loading} disabled={!supportFormValid}>
                  {supportChannel === 'whatsapp' ? 'Abrir WhatsApp' : 'Enviar solicitação'}
                  <ArrowRight size={18} />
                </SubmitButton>
              </form>
            )}

            {view === 'support-sent' && (
              <ConfirmCard
                tone="ok"
                title="Solicitação enviada"
                description={
                  <>
                    Entraremos em contato via{' '}
                    <strong className="text-[--color-text-primary]">
                      {supportChannel === 'whatsapp' ? 'WhatsApp' : 'e-mail'}
                    </strong>{' '}
                    em <strong className="text-[--color-text-primary]">{supportForm.email}</strong>.
                  </>
                }
                onBack={() => {
                  setSupportChannel(null)
                  setSupportForm({ nome: '', email: '', telefone: '' })
                  setView('password')
                }}
                backLabel="Voltar ao login"
              />
            )}

            {/* Success animation */}
            {view === 'success' && (
              <div className="flex flex-col items-center gap-5 py-8 text-center">
                <div className="relative">
                  <div
                    className="absolute inset-0 rounded-full bg-[#059669]"
                    style={{ animation: 'fmCheckRing 1.4s ease-out infinite' }}
                  />
                  <div
                    className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#059669] text-white"
                    style={{ animation: 'fmCheckPop 0.45s cubic-bezier(0.4,0,0.2,1) both' }}
                  >
                    <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                      <polyline
                        points="20 6 9 17 4 12"
                        style={{
                          strokeDasharray: 30,
                          strokeDashoffset: 0,
                          animation: 'fmCheckDraw 0.5s 0.2s cubic-bezier(0.4,0,0.2,1) both',
                        }}
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-[20px] font-semibold tracking-[-0.4px] text-[--color-text-primary]">
                    Autenticado, {userName.charAt(0).toUpperCase() + userName.slice(1)}.
                  </p>
                  <p className="mt-1 text-[13px] text-[--color-text-secondary]">
                    Abrindo seu workspace FlowModa…
                  </p>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[--color-bg-subtle]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #059669, #047857)',
                      animation: 'fmFillBar 1.6s linear forwards',
                      width: '0%',
                    }}
                  />
                </div>
                <style>{`
                  @keyframes fmFillBar { from { width: 0%; } to { width: 100%; } }
                `}</style>
              </div>
            )}
          </div>

          {/* Footer / support link */}
          {view !== 'success' && (
            <div className="mt-8 flex items-center justify-between text-[11px] text-[--color-text-tertiary]">
              <span>Protegido por TLS · {new Date().getFullYear()}</span>
              {view !== 'support-channel' &&
                view !== 'support-form' &&
                view !== 'support-sent' && (
                  <button
                    type="button"
                    onClick={() => setView('support-channel')}
                    className="font-semibold text-[--color-text-secondary] hover:text-[--color-text-primary]"
                  >
                    Suporte
                  </button>
                )}
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        :global(.form-input) {
          width: 100%;
          height: 48px;
          padding-left: 48px;
          padding-right: 16px;
          background: var(--color-bg-subtle);
          border: 1px solid var(--color-border-medium);
          border-radius: 16px;
          font-size: 15px;
          color: var(--color-text-primary);
          outline: none;
          transition: all 0.15s;
          font-family: inherit;
        }
        :global(.form-input:focus) {
          background: white;
          border-color: var(--color-text-primary);
          box-shadow: 0 0 0 4px rgba(26, 25, 23, 0.05);
        }
      `}</style>
    </div>
  )
}

function FormField({
  label,
  icon,
  children,
}: {
  label: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="ml-1 text-[11px] font-bold uppercase tracking-[0.06em] text-[--color-text-secondary]">
        {label}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[--color-text-tertiary]">
          {icon}
        </div>
        {children}
      </div>
    </div>
  )
}

function SubmitButton({
  loading,
  disabled,
  children,
}: {
  loading: boolean
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-[16px] bg-[#1A1917] text-[15px] font-semibold text-white shadow-[0_10px_15px_-3px_rgba(26,25,23,0.10)] transition-all hover:bg-[#2C2C2A] active:scale-[0.98] disabled:opacity-50"
    >
      {loading ? (
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      ) : (
        children
      )}
    </button>
  )
}

function ConfirmCard({
  tone,
  title,
  description,
  onBack,
  backLabel,
}: {
  tone: 'ok' | 'warn'
  title: string
  description: React.ReactNode
  onBack: () => void
  backLabel: string
}) {
  return (
    <div className="space-y-5 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[--color-status-ok-bg]">
        <CheckCircle2 size={26} className="text-[--color-status-ok-text]" strokeWidth={2} />
      </div>
      <div>
        <p className="text-[18px] font-semibold tracking-[-0.3px] text-[--color-text-primary]">
          {title}
        </p>
        <p className="mt-1 text-[13px] text-[--color-text-secondary]">{description}</p>
      </div>
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[--color-text-secondary] hover:text-[--color-text-primary]"
      >
        <ArrowLeft size={13} /> {backLabel}
      </button>
    </div>
  )
}
