'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutGrid,
  Shirt,
  Scissors,
  LogOut,
  ChevronUp,
  ChevronDown,
  Settings,
  X,
  Users,
  Building2,
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { useState, useRef, useEffect } from 'react'
import { FlowModaMark } from '@/components/flowmoda-wordmark'

interface NavItem {
  href: string
  label: string
  icon: typeof LayoutGrid
  badge?: number
}

interface NavGroup {
  label: string | null
  items: NavItem[]
}

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
  counts?: { pecas?: number; tecidos?: number }
}

export function Sidebar({ isOpen, onClose, counts }: SidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const groups: NavGroup[] = [
    {
      label: null,
      items: [{ href: '/', label: 'Dashboard', icon: LayoutGrid }],
    },
    {
      label: 'Produção',
      items: [
        { href: '/pecas', label: 'Peças Piloto', icon: Shirt, badge: counts?.pecas },
        { href: '/tecidos', label: 'Cortes de Tecido', icon: Scissors, badge: counts?.tecidos },
      ],
    },
  ]

  const userInitial = session?.user?.name?.[0]?.toUpperCase() ?? 'U'
  const userName = session?.user?.name ?? 'Usuário'
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === 'admin'
  const userRole = isAdmin ? 'Admin' : 'Operador'
  const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || '1.12'

  return (
    <>
      {/* Backdrop mobile */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden transition-opacity duration-300 print:hidden',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen w-[252px] bg-[#111110] border-r border-white/5 flex flex-col overflow-hidden transition-transform duration-300 md:translate-x-0 print:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Subtle grid texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage: 'linear-gradient(to bottom, black 0%, transparent 60%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 60%)',
          }}
        />

        {/* Brand area */}
        <div className="relative px-5 pb-6 pt-7">
          <div className="mb-4 flex items-center gap-2.5">
            <FlowModaMark size="md" />
            <div className="flex flex-col leading-none">
              <span
                className="text-[15px] tracking-[-0.2px]"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                <span className="font-light text-white">flow</span>
                <span className="font-bold text-white">moda</span>
                <span className="text-[#059669]">.</span>
              </span>
              <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-[#52504C]">
                Workspace
              </span>
            </div>
            {/* Close button mobile */}
            <button
              onClick={onClose}
              className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-[#85837D] hover:text-white transition-colors md:hidden"
              aria-label="Fechar menu"
            >
              <X size={16} />
            </button>
          </div>

          {/* Workspace card */}
          <div className="flex items-center gap-2.5 rounded-[10px] border border-white/[0.06] bg-white/[0.04] px-3 py-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-[rgba(5,150,105,0.15)]">
              <Building2 size={13} className="text-[#059669]" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold tracking-[-0.1px] text-[#EBEAE6]">
                JC Plus Size
              </div>
              <div className="text-[9px] font-medium text-[#52504C]">Confecção</div>
            </div>
            <ChevronDown size={12} className="text-[#52504C]" strokeWidth={2} />
          </div>
        </div>

        {/* Nav */}
        <nav className="relative flex-1 overflow-y-auto px-3">
          {groups.map((group, gi) => (
            <div key={gi} className={cn(group.label ? 'mb-2' : 'mb-1')}>
              {group.label && (
                <div className="px-2.5 pb-1 pt-2.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#3A3937]">
                  {group.label}
                </div>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive =
                    item.href === '/'
                      ? pathname === '/'
                      : pathname === item.href || pathname.startsWith(item.href + '/')
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        'group flex items-center gap-2.5 rounded-[10px] border px-3 py-2 text-[13px] transition-all',
                        isActive
                          ? 'border-[rgba(5,150,105,0.2)] font-semibold text-white'
                          : 'border-transparent font-medium text-[#85837D] hover:bg-white/[0.04] hover:text-[#EBEAE6]',
                      )}
                      style={
                        isActive
                          ? {
                              background:
                                'linear-gradient(90deg, rgba(5,150,105,0.18) 0%, rgba(5,150,105,0.06) 100%)',
                            }
                          : undefined
                      }
                    >
                      <Icon
                        size={16}
                        strokeWidth={2}
                        className={cn(
                          'transition-colors',
                          isActive
                            ? 'text-[#059669]'
                            : 'text-[#52504C] group-hover:text-[#EBEAE6]',
                        )}
                      />
                      <span className="flex-1">{item.label}</span>
                      {item.badge !== undefined && (
                        <span
                          className={cn(
                            'min-w-[28px] rounded-full px-1.5 py-0.5 text-center text-[10px] font-bold transition-colors',
                            isActive
                              ? 'bg-[rgba(5,150,105,0.15)] text-[#059669]'
                              : 'bg-white/[0.06] text-[#52504C]',
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom: user pill + status */}
        <div className="relative border-t border-white/[0.05] px-3 pb-5 pt-3">
          {/* User dropdown menu */}
          <div className="relative" ref={userMenuRef}>
            <div
              className={cn(
                'absolute bottom-full left-0 mb-2 w-full origin-bottom overflow-hidden rounded-[12px] border border-white/10 bg-[#1A1917] shadow-2xl transition-all duration-200',
                isUserMenuOpen
                  ? 'translate-y-0 scale-100 opacity-100'
                  : 'pointer-events-none translate-y-2 scale-95 opacity-0',
              )}
            >
              <Link
                href="/minha-conta"
                onClick={() => {
                  setIsUserMenuOpen(false)
                  onClose?.()
                }}
                className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-[#85837D] transition-colors hover:bg-white/5 hover:text-white"
              >
                <Settings size={16} />
                Minha Conta
              </Link>
              {isAdmin && (
                <>
                  <div className="h-px bg-white/5" />
                  <Link
                    href="/admin"
                    onClick={() => {
                      setIsUserMenuOpen(false)
                      onClose?.()
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-[#85837D] transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <Users size={16} />
                    Administração
                  </Link>
                </>
              )}
              <div className="h-px bg-white/5" />
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-[#85837D] transition-colors hover:bg-red-500/10 hover:text-red-400"
              >
                <LogOut size={16} />
                Sair do Sistema
              </button>
            </div>

            <button
              onClick={() => setIsUserMenuOpen((o) => !o)}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-[12px] border border-white/[0.06] px-3 py-2.5 transition-all',
                isUserMenuOpen ? 'bg-white/[0.07]' : 'bg-white/[0.03] hover:bg-white/[0.07]',
              )}
            >
              <div
                className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-[8px] border text-[11px] font-bold"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(5,150,105,0.3), rgba(5,150,105,0.15))',
                  borderColor: 'rgba(5,150,105,0.25)',
                  color: '#059669',
                }}
              >
                {userInitial}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <div className="truncate text-[12px] font-semibold tracking-[-0.1px] text-[#EBEAE6]">
                  {userName}
                </div>
                <div className="mt-0.5 text-[9px] font-medium text-[#52504C]">{userRole}</div>
              </div>
              <ChevronUp
                size={13}
                className={cn(
                  'flex-shrink-0 text-[#52504C] transition-transform',
                  !isUserMenuOpen && 'rotate-180',
                )}
                strokeWidth={2}
              />
            </button>
          </div>

          {/* Status ping */}
          <div className="mt-3 flex items-center gap-2 px-3 opacity-50">
            <span className="relative h-[7px] w-[7px]">
              <span
                className="absolute inset-0 rounded-full bg-[#059669]"
                style={{ animation: 'fmStatusPing 2s ease-in-out infinite' }}
              />
              <span className="absolute inset-0 rounded-full bg-[#059669]" />
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#EBEAE6]">
              Sistema online · v{appVersion}
            </span>
          </div>
        </div>
      </aside>
    </>
  )
}
