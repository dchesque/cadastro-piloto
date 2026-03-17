# Prompt para Claude Code — Sistema de Etiquetas JC Plus Size

## Contexto

Crie um sistema web completo para gerenciar e imprimir etiquetas de **peças piloto** e **cortes de tecido** de uma loja de moda plus size chamada **JC Plus Size**.

O objetivo é: o usuário cadastra cada peça/tecido no sistema, imprime uma etiqueta 10x15cm (tamanho etiqueta de envio), e cola no saquinho plástico onde a peça fica guardada.

---

## Stack

- **Next.js 15** com App Router e TypeScript
- **PostgreSQL** (variável de ambiente `DATABASE_URL`)
- **Prisma ORM** (última versão estável)
- **Tailwind CSS v4**
- **Shadcn/ui** para componentes base
- **QRCode.react** para gerar QR Code nas etiquetas
- **next/font** com fonte **Inter**

---

## Models Prisma

```prisma
model PecaPiloto {
  id          String   @id @default(cuid())
  referencia  String   @unique
  nome        String
  colecao     String
  modelista   String
  fornecedor  String
  tecido      String
  composicao  String
  precoTecido Float
  tamanhos    String   // ex: "46, 48, 50"
  observacoes String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model CorteTecido {
  id          String   @id @default(cuid())
  referencia  String   @unique
  nome        String
  fornecedor  String
  composicao  String
  metragem    Float
  largura     Float
  preco       Float
  cor         String
  refCor      String?
  observacoes String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## Estrutura de páginas e rotas

```
/app
  layout.tsx                    → layout global com sidebar de navegação
  page.tsx                      → dashboard: contadores + últimos cadastros
  
  /pecas
    page.tsx                    → listagem de peças piloto com busca e filtro
    /nova
      page.tsx                  → formulário de cadastro de peça piloto
    /[id]
      page.tsx                  → detalhe/edição da peça piloto
    /[id]/imprimir
      page.tsx                  → página de impressão da etiqueta (somente etiqueta, sem navegação)

  /tecidos
    page.tsx                    → listagem de cortes de tecido com busca e filtro
    /novo
      page.tsx                  → formulário de cadastro de corte de tecido
    /[id]
      page.tsx                  → detalhe/edição do corte de tecido
    /[id]/imprimir
      page.tsx                  → página de impressão da etiqueta (somente etiqueta, sem navegação)

  /api
    /pecas
      route.ts                  → GET (listar) + POST (criar)
    /pecas/[id]
      route.ts                  → GET + PUT + DELETE
    /tecidos
      route.ts                  → GET (listar) + POST (criar)
    /tecidos/[id]
      route.ts                  → GET + PUT + DELETE

/components
  sidebar.tsx                   → navegação lateral
  etiqueta-peca.tsx             → componente visual da etiqueta de peça piloto
  etiqueta-tecido.tsx           → componente visual da etiqueta de corte de tecido

/lib
  prisma.ts                     → singleton do PrismaClient
  utils.ts                      → helpers (formatação de moeda, data etc.)
  gerarReferencia.ts            → função que gera referência automática (ex: PP-2025-0001)
```

---

## Regras de negócio

### Geração de referência automática
- Peça Piloto: `PP-YYYY-NNNN` (ex: PP-2025-0042)
- Corte de Tecido: `TEC-YYYY-NNNN` (ex: TEC-2025-0018)
- O número sequencial (NNNN) deve ser gerado automaticamente buscando o último registro do banco e incrementando
- A referência deve ser exibida no formulário como campo somente leitura (gerado automaticamente)

### Listagem
- Busca em tempo real por nome, referência ou fornecedor
- Ordenação: mais recentes primeiro
- Card por item mostrando: referência, nome, fornecedor, data de cadastro
- Botões de ação em cada card: Ver/Editar · Imprimir · Excluir

### Exclusão
- Confirmação via dialog antes de excluir

---

## Layout visual (sidebar + conteúdo)

### Sidebar (fixa, lado esquerdo, 220px)
- Logo/nome "JC Plus Size" no topo
- Subtítulo "Gestão de Pilotos"
- Links de navegação:
  - Dashboard (ícone home)
  - Peças Piloto (ícone shirt)
  - Cortes de Tecido (ícone scissors)
- Rodapé da sidebar: versão do app "v1.0.0"
- Estilo: fundo escuro (#1a1917), texto claro, item ativo destacado

### Paleta de cores
- Background geral: `#f5f4f0` (off-white quente)
- Surface cards: `#ffffff`
- Sidebar: `#1a1917`
- Accent peça piloto: azul `#1D4ED8` / badge `#E6F1FB`
- Accent corte tecido: verde `#059669` / badge `#EAF3DE`
- Texto principal: `#1a1917`
- Texto secundário: `#6b7280`

---

## Etiqueta para impressão (CRÍTICO)

A etiqueta deve ser uma página de impressão isolada — sem header, sidebar ou qualquer navegação. Apenas a etiqueta.

### CSS de impressão obrigatório
```css
@media print {
  @page {
    size: 100mm 150mm;
    margin: 0;
  }
  body {
    margin: 0;
    padding: 0;
  }
  .no-print {
    display: none !important;
  }
}
```

### Layout da etiqueta de Peça Piloto (100mm x 150mm)

```
┌─────────────────────────────────────┐
│ JC Plus Size          [PEÇA PILOTO] │  ← header, fundo branco, badge azul
├─────────────────────────────────────┤
│ Blusa Transpassada Manga Longa      │  ← nome, 16px bold
│ #PP-2025-0042                       │  ← referência, mono, muted
├─────────────────────────────────────┤
│ Coleção          │ Modelista         │
│ Inverno 2025     │ Jaqueline         │
├─────────────────────────────────────┤
│ Fornecedor       │ Tecido            │
│ Malharia Norte   │ Malha Canelada    │
│                                     │
│ Composição       │ Preço tecido      │
│ 88% Pol 12% Ela  │ R$ 18,50/m        │
│                                     │
│ Tamanhos                            │
│ 46 · 48 · 50                        │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Obs: Testar caimento manequim   │ │  ← box com fundo cinza claro
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ 16/03/2025              [QR CODE]   │  ← footer
└─────────────────────────────────────┘
```

### Layout da etiqueta de Corte de Tecido (100mm x 150mm)

```
┌─────────────────────────────────────┐
│ JC Plus Size       [CORTE TECIDO]   │  ← header, badge verde
├─────────────────────────────────────┤
│ Malha Canelada Fio 30 Preta         │  ← nome
│ #TEC-2025-0018                      │  ← referência
├─────────────────────────────────────┤
│ Fornecedor       │ Composição        │
│ Têxtil Paulista  │ 100% Algodão      │
├─────────────────────────────────────┤
│ Metragem  │ Largura   │ Preço/m      │
│ 1,5 m     │ 1,60 m    │ R$ 22,00     │
│                                     │
│ Cor              │ Ref. cor          │
│ Preto            │ #P-004            │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Obs: Amostra coleção inverno    │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ 16/03/2025              [QR CODE]   │
└─────────────────────────────────────┘
```

### QR Code
- Usar `qrcode.react` — componente `<QRCodeSVG>`
- O valor do QR Code deve ser a URL completa da página de detalhe do item
- Ex: `https://seudominio.com/pecas/clxyz123`
- Tamanho: 48x48px na etiqueta

### Botão de impressão
- Na página `/pecas/[id]/imprimir` e `/tecidos/[id]/imprimir`, exibir um botão "Imprimir Etiqueta" com classe `no-print` que chama `window.print()`
- Abaixo do botão, mostrar preview da etiqueta em tamanho real (simulado em tela, proporcional)

---

## Formulários

### Peça Piloto — campos
| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| Referência | texto (readonly, gerado auto) | sim |
| Nome da peça | texto | sim |
| Coleção | texto | sim |
| Modelista | texto | sim |
| Fornecedor | texto | sim |
| Tecido | texto | sim |
| Composição | texto | sim |
| Preço do tecido (R$/m) | número decimal | sim |
| Tamanhos | texto | sim |
| Observações | textarea | não |

### Corte de Tecido — campos
| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| Referência | texto (readonly, gerado auto) | sim |
| Nome do tecido | texto | sim |
| Fornecedor | texto | sim |
| Composição | texto | sim |
| Metragem (m) | número decimal | sim |
| Largura (m) | número decimal | sim |
| Preço (R$/m) | número decimal | sim |
| Cor | texto | sim |
| Ref. da cor | texto | não |
| Observações | textarea | não |

### Comportamento dos formulários
- Validação client-side com feedback inline em cada campo
- Ao salvar com sucesso: toast de confirmação + redirecionar para página de impressão automaticamente
- Ao editar: carregar dados existentes, botão "Salvar alterações"
- Loading state nos botões durante submit

---

## Dockerfile para EasyPanel

```dockerfile
FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
```

---

## next.config.ts

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
}

export default nextConfig
```

---

## Variáveis de ambiente (.env.example)

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/jcpiloto"
NEXT_PUBLIC_APP_URL="https://seudominio.com"
```

---

## package.json — scripts importantes

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:generate": "prisma generate"
  }
}
```

---

## Instruções de deploy no EasyPanel

Gere um arquivo `DEPLOY.md` na raiz do projeto com as instruções:

1. Criar serviço PostgreSQL no EasyPanel (botão "Add Service > PostgreSQL")
2. Copiar a `DATABASE_URL` gerada pelo EasyPanel
3. Criar serviço de aplicação no EasyPanel (botão "Add Service > App")
4. Conectar ao repositório Git ou fazer upload do código
5. Adicionar variável de ambiente `DATABASE_URL` e `NEXT_PUBLIC_APP_URL`
6. O Dockerfile já está configurado — o EasyPanel vai detectar automaticamente
7. As migrations rodam automaticamente no startup via `prisma migrate deploy`

---

## Observações finais para o Claude Code

- Use Server Components sempre que possível, Client Components apenas onde necessário (formulários, interatividade)
- As rotas de API devem retornar JSON padronizado: `{ data, error, message }`
- Implemente `loading.tsx` em todas as rotas para skeleton loading
- Implemente `error.tsx` para tratamento de erros
- O singleton do Prisma deve estar em `/lib/prisma.ts` para evitar múltiplas conexões em dev
- Formate moedas com `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`
- Formate datas com `Intl.DateTimeFormat('pt-BR')`
- Todos os textos da interface devem estar em português brasileiro
