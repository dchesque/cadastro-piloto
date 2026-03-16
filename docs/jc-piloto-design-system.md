# Design System — JC Piloto

> Sistema de organização de peças piloto e cortes de tecido · JC Plus Size

---

## 1. Princípios

**Clareza antes de estética.** O app é uma ferramenta de trabalho — usado no chão de fábrica, sob luz artificial, às vezes com pressa. Cada decisão de design deve tornar a informação mais fácil de encontrar, não mais bonita de admirar.

**Densidade controlada.** Formulários têm muitos campos. A etiqueta tem pouco espaço. O design equilibra informação densa com respiro visual suficiente para não sufocar.

**Consistência total.** Mesma fonte, mesmos espaçamentos, mesmas cores em todos os contextos — tela, impressão, mobile. O que o usuário aprende em uma tela funciona em todas.

---

## 2. Tokens de Design

### 2.1 Cores

Paleta baseada em tons quentes de areia/linho — remete ao universo têxtil sem ser óbvio.

```css
:root {
  /* Backgrounds */
  --color-bg-page:      #F5F4F0;   /* areia claro — fundo da página */
  --color-bg-surface:   #FFFFFF;   /* branco puro — cards, formulários */
  --color-bg-subtle:    #EEECEA;   /* areia médio — inputs, seções de obs */
  --color-bg-muted:     #E4E2DE;   /* areia escuro — hover states */

  /* Borders */
  --color-border-light:  #E4E2DE;  /* divisores internos de cards */
  --color-border-medium: #CCCAC5;  /* bordas de inputs e cards */
  --color-border-strong: #A8A69F;  /* foco, hover em borders */

  /* Texto */
  --color-text-primary:   #1A1917;  /* preto quente — títulos, valores */
  --color-text-secondary: #6B6965;  /* cinza médio — labels, meta */
  --color-text-tertiary:  #9C9A94;  /* cinza claro — placeholders, hints */
  --color-text-inverse:   #FFFFFF;  /* texto sobre fundos escuros */

  /* Tipo: Peça Piloto (azul índigo) */
  --color-peca-bg:      #E6F1FB;
  --color-peca-text:    #0C447C;
  --color-peca-border:  #85B7EB;
  --color-peca-solid:   #185FA5;

  /* Tipo: Corte de Tecido (verde musgo) */
  --color-tecido-bg:    #EAF3DE;
  --color-tecido-text:  #27500A;
  --color-tecido-border:#97C459;
  --color-tecido-solid: #3B6D11;

  /* Feedback */
  --color-success-bg:   #EAF3DE;
  --color-success-text: #27500A;
  --color-danger-bg:    #FCEBEB;
  --color-danger-text:  #791F1F;
  --color-warning-bg:   #FAEEDA;
  --color-warning-text: #633806;

  /* Accent — ação principal */
  --color-accent:       #1A1917;   /* preto quente — botão primário */
  --color-accent-hover: #2C2C2A;
}
```

**Regra de uso:**
- `bg-page` → fundo do layout
- `bg-surface` → cards, modais, formulários
- `bg-subtle` → campos de input, área de observações
- Nunca use cores de tipo (peca/tecido) fora de badges e acentos de etiqueta

---

### 2.2 Tipografia

```css
:root {
  /* Fontes */
  --font-sans: 'DM Sans', system-ui, sans-serif;
  --font-mono: 'DM Mono', 'Fira Code', monospace;
}
```

**Importar no `layout.tsx`:**
```ts
import { DM_Sans, DM_Mono } from 'next/font/google'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-sans',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
})
```

**Escala tipográfica:**

| Token            | Tamanho | Peso | Uso                              |
|------------------|---------|------|----------------------------------|
| `text-xs`        | 10px    | 400  | Labels de etiqueta impressa      |
| `text-sm`        | 12px    | 400  | Meta info, datas, hints          |
| `text-base`      | 14px    | 400  | Corpo de formulários, valores    |
| `text-md`        | 15px    | 500  | Nome do item em cards            |
| `text-lg`        | 18px    | 500  | Títulos de seção                 |
| `text-xl`        | 22px    | 300  | Título de página                 |
| `text-mono-sm`   | 11px    | 400  | Referência em etiqueta impressa  |
| `text-mono-base` | 13px    | 400  | Referência em cards/formulários  |

**Regras:**
- Referências (`PP-2025-0042`) sempre em `font-mono`
- Valores numéricos (preço, metragem, largura) sempre em `font-mono`
- Labels de campo em `uppercase`, `letter-spacing: 0.06em`, `text-secondary`
- Títulos de página em peso `300` — leve e elegante

---

### 2.3 Espaçamento

Sistema baseado em múltiplos de 4px:

```
4px   → gap interno mínimo (entre label e valor)
8px   → gap entre campos em grid
12px  → padding interno de badge, padding de footer de etiqueta
16px  → padding padrão de card, gap entre seções de etiqueta
20px  → padding lateral de formulário mobile
24px  → padding lateral de formulário desktop, gap entre cards
32px  → margem entre seções da página
48px  → padding de página desktop
```

**No Tailwind:**
Use as classes padrão — `p-2`, `p-3`, `p-4`, `p-6`, `gap-2`, `gap-4`, `gap-6`.

---

### 2.4 Bordas e Raios

```css
:root {
  --radius-sm:  4px;   /* badges, QR box, seções internas de etiqueta */
  --radius-md:  8px;   /* inputs, botões, chips */
  --radius-lg:  12px;  /* cards, modais */
  --radius-xl:  16px;  /* cards de destaque */

  --border-thin:   0.5px solid var(--color-border-light);
  --border-medium: 1px solid var(--color-border-medium);
  --border-strong: 1.5px solid var(--color-border-strong);
}
```

---

### 2.5 Sombras

Sombras mínimas — o design é flat com bordas, não elevado com sombra.

```css
--shadow-none:  none;
--shadow-card:  0 1px 3px rgba(26, 25, 23, 0.06);   /* card em repouso */
--shadow-hover: 0 2px 8px rgba(26, 25, 23, 0.10);   /* card em hover */
--shadow-focus: 0 0 0 3px rgba(26, 25, 23, 0.12);   /* focus ring */
```

---

## 3. Componentes

### 3.1 Badge de Tipo

Usado no header da etiqueta e nos cards da listagem.

```tsx
// components/ui/type-badge.tsx
type Tipo = 'peca' | 'tecido'

const config = {
  peca:   { label: 'Peça Piloto',      bg: 'bg-[#E6F1FB]', text: 'text-[#0C447C]' },
  tecido: { label: 'Corte de Tecido',  bg: 'bg-[#EAF3DE]', text: 'text-[#27500A]' },
}

export function TypeBadge({ tipo }: { tipo: Tipo }) {
  const c = config[tipo]
  return (
    <span className={`
      ${c.bg} ${c.text}
      text-[9px] font-semibold uppercase tracking-[0.06em]
      px-2 py-0.5 rounded-[4px]
    `}>
      {c.label}
    </span>
  )
}
```

---

### 3.2 Campo de Formulário

Padrão para todos os inputs do sistema.

```tsx
// components/ui/field.tsx
interface FieldProps {
  label: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}

export function Field({ label, required, hint, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[--color-text-secondary]">
        {label}
        {required && <span className="text-[--color-danger-text] ml-0.5">*</span>}
      </label>
      {children}
      {hint && (
        <p className="text-[11px] text-[--color-text-tertiary]">{hint}</p>
      )}
    </div>
  )
}
```

**Classes de input padrão:**
```
className="
  w-full h-10 px-3
  bg-[--color-bg-subtle] border border-[--color-border-medium]
  rounded-[8px]
  text-[14px] font-[--font-sans] text-[--color-text-primary]
  placeholder:text-[--color-text-tertiary]
  focus:outline-none focus:border-[--color-border-strong] focus:bg-white
  transition-colors duration-150
"
```

**Input mono (referência, preço, metragem):**
```
className="... font-[--font-mono] text-[13px]"
```

---

### 3.3 Botões

Três variantes:

```tsx
// Primário — ação principal (salvar, criar)
<button className="
  h-10 px-5
  bg-[--color-accent] text-white
  text-[14px] font-medium
  rounded-[8px]
  hover:bg-[--color-accent-hover]
  active:scale-[0.98]
  transition-all duration-150
">
  Salvar peça
</button>

// Secundário — ação alternativa (cancelar, voltar)
<button className="
  h-10 px-5
  bg-transparent text-[--color-text-primary]
  border border-[--color-border-medium]
  text-[14px] font-medium
  rounded-[8px]
  hover:bg-[--color-bg-subtle]
  active:scale-[0.98]
  transition-all duration-150
">
  Cancelar
</button>

// Destrutivo — exclusão
<button className="
  h-10 px-5
  bg-transparent text-[--color-danger-text]
  border border-[--color-border-light]
  text-[14px] font-medium
  rounded-[8px]
  hover:bg-[--color-danger-bg]
  active:scale-[0.98]
  transition-all duration-150
">
  Excluir
</button>

// Ícone — ação compacta em card
<button className="
  w-8 h-8
  flex items-center justify-center
  rounded-[6px]
  text-[--color-text-secondary]
  hover:bg-[--color-bg-muted] hover:text-[--color-text-primary]
  transition-colors duration-150
">
  {/* ícone Lucide */}
</button>
```

---

### 3.4 Card de Item (listagem)

```tsx
// Estrutura de um card na listagem
<div className="
  bg-white border border-[--color-border-light]
  rounded-[12px] p-4
  hover:shadow-[--shadow-hover]
  transition-shadow duration-200
  cursor-pointer
">
  {/* Linha superior: badge + ações */}
  <div className="flex items-center justify-between mb-3">
    <TypeBadge tipo={item.tipo} />
    <div className="flex gap-1">
      {/* botões ícone: imprimir, editar, excluir */}
    </div>
  </div>

  {/* Nome */}
  <p className="text-[15px] font-medium text-[--color-text-primary] leading-tight mb-1">
    {item.nome}
  </p>

  {/* Referência */}
  <p className="font-mono text-[12px] text-[--color-text-secondary] mb-3">
    #{item.referencia}
  </p>

  {/* Meta */}
  <div className="flex items-center gap-3 text-[12px] text-[--color-text-tertiary]">
    <span>{item.fornecedor}</span>
    <span>·</span>
    <span>{formatDate(item.criadoEm)}</span>
  </div>
</div>
```

---

### 3.5 Tabs (Peças / Tecidos)

```tsx
// Tabs simples sem lib externa
<div className="flex gap-0 border-b border-[--color-border-light] mb-6">
  {['peca', 'tecido'].map((tab) => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`
        px-4 py-2.5 text-[13px] font-medium
        border-b-2 -mb-px transition-colors duration-150
        ${activeTab === tab
          ? 'border-[--color-accent] text-[--color-text-primary]'
          : 'border-transparent text-[--color-text-secondary] hover:text-[--color-text-primary]'
        }
      `}
    >
      {tab === 'peca' ? 'Peças Piloto' : 'Cortes de Tecido'}
      <span className="ml-1.5 text-[11px] text-[--color-text-tertiary]">
        ({counts[tab]})
      </span>
    </button>
  ))}
</div>
```

---

### 3.6 Campo de Busca

```tsx
<div className="relative">
  <Search
    size={15}
    className="absolute left-3 top-1/2 -translate-y-1/2 text-[--color-text-tertiary]"
  />
  <input
    type="search"
    placeholder="Buscar por nome ou referência..."
    className="
      w-full h-10 pl-9 pr-4
      bg-[--color-bg-subtle] border border-[--color-border-medium]
      rounded-[8px]
      text-[14px] text-[--color-text-primary]
      placeholder:text-[--color-text-tertiary]
      focus:outline-none focus:border-[--color-border-strong] focus:bg-white
      transition-colors duration-150
    "
  />
</div>
```

---

### 3.7 Header do App

```tsx
<header className="
  sticky top-0 z-50
  bg-white border-b border-[--color-border-light]
  px-6 h-14
  flex items-center justify-between
">
  {/* Logo */}
  <div className="flex flex-col leading-none">
    <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[--color-text-tertiary]">
      JC Plus Size
    </span>
    <span className="text-[15px] font-medium text-[--color-text-primary]">
      Peças Piloto
    </span>
  </div>

  {/* Ação principal */}
  <Link href="/novo">
    <button className="/* botão primário compacto */">
      <Plus size={15} />
      Novo item
    </button>
  </Link>
</header>
```

---

### 3.8 Toast / Feedback

```tsx
// Estados de feedback inline (sem lib externa necessária)
// Sucesso
<div className="
  flex items-center gap-2 px-4 py-3
  bg-[--color-success-bg] border border-[#97C459]
  rounded-[8px] text-[13px] text-[--color-success-text]
">
  <CheckCircle size={15} />
  Peça salva com sucesso
</div>

// Erro
<div className="
  flex items-center gap-2 px-4 py-3
  bg-[--color-danger-bg] border border-[#F09595]
  rounded-[8px] text-[13px] text-[--color-danger-text]
">
  <AlertCircle size={15} />
  Erro ao salvar. Tente novamente.
</div>
```

---

## 4. Etiquetas (Componentes de Impressão)

As etiquetas são componentes React separados, usados tanto na preview de tela quanto na impressão real.

### 4.1 Estrutura base

```tsx
// Wrapper comum das duas etiquetas
<div className="
  label-wrapper
  w-[10cm] h-[15cm]          /* tamanho exato de impressão */
  bg-white
  border border-[--color-border-medium]
  rounded-[4px]
  flex flex-col
  font-[--font-sans]
  overflow-hidden
">
  {/* conteúdo */}
</div>
```

### 4.2 Anatomia da etiqueta

```
┌──────────────────────────────┐  ← border 1px
│ HEADER   (altura fixa: 32px) │  ← brand + badge
├──────────────────────────────┤  ← divider
│ IDENTITY (altura aprox: 52px)│  ← nome + referência
├──────────────────────────────┤
│ CAMPOS   (flex: 1)           │  ← grid 2 ou 3 colunas
├──────────────────────────────┤
│ OBS      (altura auto)       │  ← fundo bg-subtle
├──────────────────────────────┤
│ FOOTER   (altura fixa: 44px) │  ← data + QR code
└──────────────────────────────┘
```

### 4.3 Tipografia específica de etiqueta (impressão)

| Elemento         | Tamanho | Peso | Fonte |
|------------------|---------|------|-------|
| Brand (JC Plus)  | 7pt     | 600  | sans  |
| Badge tipo       | 7pt     | 600  | sans  |
| Nome da peça     | 11pt    | 600  | sans  |
| Referência       | 8pt     | 400  | mono  |
| Label de campo   | 6pt     | 600  | sans  |
| Valor de campo   | 8.5pt   | 400  | sans  |
| Valor numérico   | 8pt     | 400  | mono  |
| Observações      | 7pt     | 400  | sans  |
| Data footer      | 7pt     | 400  | sans  |

> Use `pt` (pontos tipográficos) nos componentes de etiqueta para garantir consistência na impressão.

---

## 5. CSS de Impressão

Arquivo `app/globals.css` — seção de impressão:

```css
@media print {
  /* Reset de página */
  @page {
    size: 10cm 15cm;
    margin: 0;
  }

  /* Esconder tudo exceto a etiqueta */
  body > *:not(#print-area) {
    display: none !important;
  }

  #print-area {
    display: block;
    width: 10cm;
    height: 15cm;
    margin: 0;
    padding: 0;
  }

  /* Garantir cores na impressão */
  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Remover sombras e transitions */
  * {
    box-shadow: none !important;
    transition: none !important;
  }
}
```

**Estrutura da página `/imprimir/[id]`:**
```tsx
// Área que será impressa
<div id="print-area">
  {tipo === 'peca' ? <LabelPeca item={item} /> : <LabelTecido item={item} />}
</div>

// Controles (escondidos na impressão)
<div className="print:hidden fixed bottom-6 left-0 right-0 flex justify-center gap-3">
  <button onClick={() => window.print()}>Imprimir etiqueta</button>
  <Link href="/">Voltar</Link>
</div>
```

---

## 6. Layout de Páginas

### 6.1 Layout global

```tsx
// app/layout.tsx
<html>
  <body className="bg-[--color-bg-page] min-h-screen">
    <Header />
    <main className="max-w-[900px] mx-auto px-4 sm:px-6 py-8">
      {children}
    </main>
  </body>
</html>
```

### 6.2 Página de listagem `/`

```
┌─────────────────────────────────────────┐
│ HEADER                                  │
├─────────────────────────────────────────┤
│                                         │
│  [Busca___________________________]     │
│                                         │
│  [Peças Piloto (12)] [Tecidos (8)]      │
│                                         │
│  ┌────────┐ ┌────────┐ ┌────────┐      │
│  │ card   │ │ card   │ │ card   │      │
│  └────────┘ └────────┘ └────────┘      │
│  ┌────────┐ ┌────────┐                 │
│  │ card   │ │ card   │                 │
│  └────────┘ └────────┘                 │
│                                         │
└─────────────────────────────────────────┘
```

Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`

### 6.3 Formulário `/novo` e `/editar/[id]`

```
┌─────────────────────────────────────────┐
│ HEADER                                  │
├─────────────────────────────────────────┤
│                                         │
│  ← Voltar                               │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ Tipo:  ○ Peça Piloto            │    │
│  │        ○ Corte de Tecido        │    │
│  ├─────────────────────────────────┤    │
│  │ [Referência]  [Nome da peça   ] │    │
│  │ [Coleção   ]  [Modelista      ] │    │
│  │ [Fornecedor]  [Tecido         ] │    │
│  │ [Composição]  [Preço tecido   ] │    │
│  │ [Observações                  ] │    │
│  ├─────────────────────────────────┤    │
│  │ [Cancelar]          [Salvar →] │    │
│  └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

Formulário: `max-w-[640px] mx-auto`

Grid de campos: `grid grid-cols-1 sm:grid-cols-2 gap-4`

---

## 7. Ícones

Usar **Lucide React** — já incluso com shadcn/ui.

```ts
import {
  Plus,           // novo item
  Printer,        // imprimir etiqueta
  Pencil,         // editar
  Trash2,         // excluir
  Search,         // busca
  ArrowLeft,      // voltar
  CheckCircle,    // sucesso
  AlertCircle,    // erro
  Package,        // peça piloto (empty state)
  Scissors,       // corte de tecido (empty state)
} from 'lucide-react'
```

Tamanho padrão: `size={15}` em botões e campos, `size={40}` em empty states.

---

## 8. Estados Especiais

### Empty state

```tsx
<div className="flex flex-col items-center justify-center py-20 gap-3">
  <Package size={40} className="text-[--color-text-tertiary]" strokeWidth={1} />
  <p className="text-[15px] font-medium text-[--color-text-secondary]">
    Nenhuma peça piloto cadastrada
  </p>
  <p className="text-[13px] text-[--color-text-tertiary]">
    Comece cadastrando a primeira peça
  </p>
  <Link href="/novo">
    <button className="/* botão primário */">+ Nova peça</button>
  </Link>
</div>
```

### Loading skeleton

```tsx
// Card skeleton
<div className="bg-white border border-[--color-border-light] rounded-[12px] p-4 animate-pulse">
  <div className="h-5 w-24 bg-[--color-bg-muted] rounded mb-3" />
  <div className="h-4 w-40 bg-[--color-bg-muted] rounded mb-2" />
  <div className="h-3 w-28 bg-[--color-bg-subtle] rounded" />
</div>
```

---

## 9. Responsividade

O app deve funcionar bem no celular — a Jaqueline usará no smartphone.

| Breakpoint | Layout                             |
|------------|------------------------------------|
| `< 640px`  | 1 coluna, padding lateral 16px     |
| `640–900px`| 2 colunas em cards, form full      |
| `> 900px`  | 3 colunas em cards, form centrado  |

**Mobile first.** Começar pelo mobile e usar `sm:` e `lg:` para expandir.

Inputs sempre `w-full`. Botões de ação sempre `w-full sm:w-auto` no mobile.

---

## 10. Referência Rápida de Classes

```
Fundo página:    bg-[#F5F4F0]
Fundo surface:   bg-white
Fundo input:     bg-[#EEECEA]
Fundo hover:     bg-[#E4E2DE]

Borda padrão:    border border-[#E4E2DE]
Borda input:     border border-[#CCCAC5]

Texto principal: text-[#1A1917]
Texto secondary: text-[#6B6965]
Texto tertiary:  text-[#9C9A94]

Radius card:     rounded-[12px]
Radius input:    rounded-[8px]
Radius badge:    rounded-[4px]

Font mono:       font-[family-name:var(--font-mono)]
Label campo:     text-[11px] font-semibold uppercase tracking-[0.06em] text-[#6B6965]
```

---

*Design System v1.0 — JC Piloto · JC Plus Size · Março 2025*
