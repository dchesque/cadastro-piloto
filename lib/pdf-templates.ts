import { readFileSync, existsSync } from 'fs'
import path from 'path'

// ─── tipos ────────────────────────────────────────────────────────────────────

interface Tecido {
  referencia?: string | null
  nome?: string | null
  composicao?: string | null
  largura?: string | null
  cor?: string | null
  consumo?: string | null
}

interface Aviamento {
  referencia?: string | null
  nome?: string | null
  medida?: string | null
  cor?: string | null
  consumo?: string | null
}

interface Equipamento {
  maquina?: string | null
  agulha?: string | null
}

interface CorteItem {
  nome?: string | null
  cor?: string | null
  largura?: string | null
  grade?: Record<string, { previsto?: number }>
}

interface Peca {
  id: string
  nome?: string | null
  referencia: string
  colecao?: string | null
  estilista?: string | null
  modelista?: string | null
  pilotista?: string | null
  responsavelCorte?: string | null
  oficina?: string | null
  tamanhoPiloto?: string | null
  gradeCorte?: string | null
  fotoFrente?: string | null
  fotoVerso?: string | null
  caracteristicasCostura?: string | null
  pontosCriticos?: string | null
  observacoesGerais?: string | null
  createdAt?: string | Date | null
  materiais?: Tecido[]
  aviamentos?: Aviamento[]
  equipamentos?: Equipamento[]
}

interface Corte {
  id: string
  numeroCorte: string
  dataCorte?: string | Date | null
  observacoes?: string | null
  items?: CorteItem[]
}

// ─── helper: imagem → base64 ──────────────────────────────────────────────────

function imgToBase64(url: string | null | undefined): string {
  if (!url) return ''
  try {
    // url é relativa, ex: /uploads/abc.jpg
    const filePath = path.join(process.cwd(), 'public', url.startsWith('/') ? url.slice(1) : url)
    if (!existsSync(filePath)) return ''
    const buffer = readFileSync(filePath)
    const ext = path.extname(filePath).toLowerCase().replace('.', '') || 'jpeg'
    const mime = ext === 'png' ? 'image/png' : ext === 'gif' ? 'image/gif' : ext === 'webp' ? 'image/webp' : 'image/jpeg'
    return `data:${mime};base64,${buffer.toString('base64')}`
  } catch {
    return ''
  }
}

function formatDateBr(val?: string | Date | null): string {
  if (!val) return '—'
  try {
    return new Date(val).toLocaleDateString('pt-BR')
  } catch {
    return '—'
  }
}

// ─── HTML wrapper com Tailwind CDN ────────────────────────────────────────────

function htmlDoc(body: string, extraHead = ''): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
    body { background: white; margin: 0; padding: 0; }
    @page { size: A4; margin: 10mm; }
  </style>
  ${extraHead}
</head>
<body class="bg-white text-black">
  ${body}
</body>
</html>`
}

// ─── FICHA TÉCNICA ────────────────────────────────────────────────────────────

export function buildFichaTecnicaPdf(peca: Peca, _appUrl?: string): string {
  const frenteB64 = imgToBase64(peca.fotoFrente)
  const versoB64 = imgToBase64(peca.fotoVerso)
  const docId = `DOC-JC-FT-${peca.id.slice(-8).toUpperCase()}`
  const emissao = new Date().toLocaleDateString('pt-BR')
  const dataCadastro = formatDateBr(peca.createdAt)

  const materiais = peca.materiais || []
  const aviamentos = peca.aviamentos || []
  const equipamentos = peca.equipamentos || []

  const materiaisRows = materiais.length > 0
    ? materiais.map(m => `
      <tr class="border-b border-black last:border-0">
        <td class="p-1.5 px-2 border-r border-black font-black text-xs">${m.referencia || '—'}</td>
        <td class="p-1.5 px-2 border-r border-black font-black uppercase text-xs">${m.nome || '—'}</td>
        <td class="p-1.5 px-2 border-r border-black text-xs leading-tight font-medium uppercase">${m.composicao || '—'}</td>
        <td class="p-1.5 px-2 border-r border-black text-center font-black text-xs">${m.largura || '—'}</td>
        <td class="p-1.5 px-2 border-r border-black truncate uppercase text-xs">${m.cor || '—'}</td>
        <td class="p-1.5 px-2 font-black text-center bg-gray-50 text-xs">${m.consumo || '—'}</td>
      </tr>`).join('')
    : `<tr><td colspan="6" class="p-4 text-center text-gray-400 font-bold uppercase text-xs italic">Nenhum tecido cadastrado.</td></tr>`

  const aviamentosRows = aviamentos.length > 0
    ? aviamentos.map(a => `
      <tr class="border-b border-black last:border-0">
        <td class="p-1.5 px-2 border-r border-black font-black text-xs">${a.referencia || '—'}</td>
        <td class="p-1.5 px-2 border-r border-black font-black uppercase text-xs">${a.nome || '—'}</td>
        <td class="p-1.5 px-2 border-r border-black text-center uppercase text-xs">${a.medida || '—'}</td>
        <td class="p-1.5 px-2 border-r border-black truncate uppercase text-xs">${a.cor || '—'}</td>
        <td class="p-1.5 px-2 font-black text-center bg-gray-50 text-xs">${a.consumo || '—'}</td>
      </tr>`).join('')
    : `<tr><td colspan="5" class="p-4 text-center text-gray-400 font-bold uppercase text-xs italic">Nenhum aviamento cadastrado.</td></tr>`

  const equipamentosRows = equipamentos.length > 0
    ? equipamentos.map(eq => `
      <div class="flex gap-2 items-center border-b border-black/10 pb-1.5 last:border-0">
        <div class="flex-1">
          <p class="font-black uppercase text-gray-400 leading-none mb-0.5" style="font-size:7px">Máquina</p>
          <p class="font-black text-black leading-tight uppercase" style="font-size:10px">${eq.maquina || '—'}</p>
        </div>
        <div class="w-14 text-center border-l border-black/10">
          <p class="font-black uppercase text-gray-400 leading-none mb-0.5" style="font-size:7px">Agulha</p>
          <p class="font-black text-black leading-tight uppercase" style="font-size:10px">${eq.agulha || '—'}</p>
        </div>
      </div>`).join('')
    : `<div class="text-center py-6"><p class="text-gray-300 font-bold uppercase italic" style="font-size:9px">Sem especificações de máquinas.</p></div>`

  const notasGerais = peca.observacoesGerais ? `
    <div class="p-3 border-x-2 border-b-2 border-black bg-yellow-50/10">
      <p class="font-black uppercase tracking-widest text-yellow-800/40 mb-1 leading-none" style="font-size:9px">Anotações Gerais Adicionais</p>
      <p class="leading-relaxed text-gray-700 font-medium italic" style="font-size:10px; white-space:pre-wrap">${peca.observacoesGerais}</p>
    </div>` : ''

  const photoBlock = (b64: string, label: string) => b64
    ? `<div class="flex flex-col gap-1.5 h-full overflow-hidden">
         <div class="flex-1 rounded-2xl flex items-center justify-center overflow-hidden bg-white relative border border-gray-100" style="min-height:300px">
           <img src="${b64}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;padding:8px" alt="${label}"/>
         </div>
         <p class="font-black uppercase text-center tracking-widest text-gray-400" style="font-size:10px">${label}</p>
       </div>`
    : `<div class="flex flex-col gap-1.5 h-full overflow-hidden">
         <div class="flex-1 rounded-2xl flex items-center justify-center overflow-hidden bg-white border border-gray-100" style="min-height:300px">
           <div class="text-center p-2 opacity-20">
             <p class="font-black uppercase tracking-tighter" style="font-size:8px">SEM FOTO ${label}</p>
           </div>
         </div>
         <p class="font-black uppercase text-center tracking-widest text-gray-400" style="font-size:10px">${label}</p>
       </div>`

  const body = `
  <div class="bg-white text-black">

    <!-- CABEÇALHO -->
    <div class="grid grid-cols-4 border-2 border-black">
      <div class="col-span-1 p-2 border-r-2 border-black flex flex-col justify-center items-center bg-black text-white">
        <div class="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center font-black text-lg mb-0.5">JC</div>
        <p class="font-black uppercase tracking-widest leading-none" style="font-size:8px">JC STUDIO</p>
      </div>
      <div class="col-span-2 p-2 px-3 flex flex-col justify-center">
        <p class="font-black uppercase tracking-widest text-gray-400 mb-0.5" style="font-size:8px;letter-spacing:0.2em">Ficha Técnica de Vestuário</p>
        <h1 class="text-xl font-black uppercase tracking-tight leading-none">${peca.nome || '—'}</h1>
        <p class="font-bold text-gray-500 mt-1 uppercase tracking-widest" style="font-size:10px">${peca.colecao || ''}</p>
      </div>
      <div class="col-span-1 p-2 border-l-2 border-black flex flex-col justify-center items-center bg-gray-50">
        <div class="text-center mb-1.5 border-b border-black/10 pb-1 w-full">
          <p class="font-black uppercase text-gray-400 mb-0.5" style="font-size:8px">Referência</p>
          <p class="font-black text-black leading-none uppercase" style="font-size:14px">${peca.referencia}</p>
        </div>
        <div class="text-center">
          <p class="font-black uppercase text-gray-300" style="font-size:7px">Data Cadastro</p>
          <p class="font-bold text-gray-400 leading-none" style="font-size:9px">${dataCadastro}</p>
        </div>
      </div>
    </div>

    <!-- EQUIPE -->
    <div class="border-x-2 border-b-2 border-black bg-gray-50/30">
      <div class="grid border-b-2 border-black" style="grid-template-columns:repeat(5,1fr)">
        <div class="p-1 border-r-2 border-black">
          <p class="font-black uppercase text-gray-400 mb-0.5 leading-none" style="font-size:8px">Estilista</p>
          <p class="font-bold text-black uppercase truncate" style="font-size:11px">${peca.estilista || '—'}</p>
        </div>
        <div class="p-1 border-r-2 border-black">
          <p class="font-black uppercase text-gray-400 mb-0.5 leading-none" style="font-size:8px">Modelista</p>
          <p class="font-bold text-black uppercase truncate" style="font-size:11px">${peca.modelista || '—'}</p>
        </div>
        <div class="p-1 border-r-2 border-black">
          <p class="font-black uppercase text-gray-400 mb-0.5 leading-none" style="font-size:8px">Pilotista</p>
          <p class="font-bold text-black uppercase truncate" style="font-size:11px">${peca.pilotista || '—'}</p>
        </div>
        <div class="p-1 border-r-2 border-black">
          <p class="font-black uppercase text-gray-400 mb-0.5 leading-none" style="font-size:8px">Oficina</p>
          <p class="font-bold text-black uppercase truncate" style="font-size:11px">${peca.oficina || '—'}</p>
        </div>
        <div class="p-1">
          <p class="font-black uppercase text-gray-400 mb-0.5 leading-none" style="font-size:8px">Resp. Corte</p>
          <p class="font-bold text-black uppercase truncate" style="font-size:11px">${peca.responsavelCorte || '—'}</p>
        </div>
      </div>
      <div class="grid bg-white" style="grid-template-columns:5fr 1fr">
        <div class="p-1 px-3 border-r-2 border-black">
          <p class="font-black uppercase text-gray-400 mb-0.5 leading-none" style="font-size:8px">Grade de Tamanhos Disponíveis</p>
          <p class="font-black text-black uppercase" style="font-size:12px;letter-spacing:0.2em">${peca.gradeCorte || '—'}</p>
        </div>
        <div class="p-1 flex flex-col justify-center items-center bg-gray-50">
          <p class="font-black uppercase text-gray-400 mb-0.5 leading-none" style="font-size:8px">Tam. Piloto</p>
          <p class="font-black text-black leading-none" style="font-size:16px">${peca.tamanhoPiloto || '—'}</p>
        </div>
      </div>
    </div>

    <!-- FOTOS -->
    <div class="border-x-2 border-b-2 border-black p-1 bg-white">
      <div class="grid grid-cols-2 gap-2" style="height:340px">
        ${photoBlock(frenteB64, 'Vista Frente')}
        ${photoBlock(versoB64, 'Vista Verso')}
      </div>
    </div>

    <!-- MATERIAIS -->
    <div class="p-3 border-x-2 border-b-2 border-black space-y-2 bg-white">
      <div class="flex items-center gap-2 mb-1 px-1">
        <div class="h-0.5 w-6 bg-black"></div>
        <p class="font-black uppercase tracking-widest text-black" style="font-size:10px">Matéria Prima (Tecidos)</p>
      </div>
      <table class="w-full text-left border-collapse border-2 border-black">
        <thead>
          <tr class="bg-black text-white">
            <th class="p-1 px-2 font-black uppercase border-r border-white/20 w-16" style="font-size:9px">REF</th>
            <th class="p-1 px-2 font-black uppercase border-r border-white/20" style="font-size:9px">Nome</th>
            <th class="p-1 px-2 font-black uppercase border-r border-white/20" style="font-size:9px">Composição</th>
            <th class="p-1 px-2 font-black uppercase border-r border-white/20 w-16 text-center" style="font-size:9px">Larg</th>
            <th class="p-1 px-2 font-black uppercase border-r border-white/20" style="font-size:9px">Cor</th>
            <th class="p-1 px-2 font-black uppercase text-center w-20 bg-gray-800" style="font-size:9px">Consumo</th>
          </tr>
        </thead>
        <tbody class="font-bold">
          ${materiaisRows}
        </tbody>
      </table>
    </div>

    <!-- AVIAMENTOS -->
    <div class="p-3 border-x-2 border-b-2 border-black space-y-2 bg-white">
      <div class="flex items-center gap-2 mb-1 px-1">
        <div class="h-0.5 w-6 bg-black"></div>
        <p class="font-black uppercase tracking-widest text-black" style="font-size:10px">Aviamentos e Componentes</p>
      </div>
      <table class="w-full text-left border-collapse border-2 border-black">
        <thead>
          <tr class="bg-black text-white">
            <th class="p-1 px-2 font-black uppercase border-r border-white/20 w-16" style="font-size:9px">REF</th>
            <th class="p-1 px-2 font-black uppercase border-r border-white/20" style="font-size:9px">Nome / Marca</th>
            <th class="p-1 px-2 font-black uppercase border-r border-white/20 w-24 text-center" style="font-size:9px">Medida</th>
            <th class="p-1 px-2 font-black uppercase border-r border-white/20" style="font-size:9px">Cor</th>
            <th class="p-1 px-2 font-black uppercase text-center w-24 bg-gray-800" style="font-size:9px">Consumo</th>
          </tr>
        </thead>
        <tbody class="font-bold">
          ${aviamentosRows}
        </tbody>
      </table>
    </div>

    <!-- OBSERVAÇÕES + EQUIPAMENTOS -->
    <div class="grid border-x-2 border-b-2 border-black bg-white" style="grid-template-columns:2fr 1fr">
      <div class="p-3 border-r-2 border-black space-y-3">
        <div class="flex items-center gap-2 mb-1">
          <div class="h-0.5 w-6 bg-black"></div>
          <p class="font-black uppercase tracking-widest text-black" style="font-size:10px">Observações Técnicas de Produção</p>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1 p-2 rounded border border-red-100" style="background:rgba(254,242,242,0.3)">
            <p class="font-black uppercase text-red-600 tracking-tighter" style="font-size:8px">Pontos Críticos</p>
            <p class="leading-tight text-gray-700 font-medium" style="font-size:10px;white-space:pre-wrap">${peca.pontosCriticos || 'Nenhuma criticidade reportada.'}</p>
          </div>
          <div class="space-y-1 p-2 rounded border border-blue-100" style="background:rgba(239,246,255,0.3)">
            <p class="font-black uppercase text-blue-600 tracking-tighter" style="font-size:8px">Instruções de Costura</p>
            <p class="leading-tight text-gray-700 font-medium" style="font-size:10px;white-space:pre-wrap">${peca.caracteristicasCostura || 'Seguir padrão de costura industrial JC.'}</p>
          </div>
        </div>
      </div>
      <div class="p-3 flex flex-col justify-start" style="background:rgba(249,250,251,0.3)">
        <p class="font-black text-gray-400 text-center uppercase tracking-widest mb-2 border-b-2 border-black pb-1" style="font-size:8px">Maquinário Requerido</p>
        <div class="space-y-1.5 overflow-hidden">
          ${equipamentosRows}
        </div>
      </div>
    </div>

    ${notasGerais}

    <!-- RODAPÉ -->
    <div class="p-3 px-8 flex justify-between items-center bg-white border-x-2 border-b-2 border-black">
      <div class="flex gap-6">
        <div class="flex flex-col">
          <p class="font-black text-gray-300 uppercase leading-none mb-0.5" style="font-size:7px">Identificador de Documento</p>
          <p class="font-black text-gray-400 uppercase leading-none" style="font-size:8px">${docId}</p>
        </div>
        <div class="flex flex-col">
          <p class="font-black text-gray-300 uppercase leading-none mb-0.5" style="font-size:7px">Data de Emissão</p>
          <p class="font-black text-gray-400 uppercase leading-none" style="font-size:8px">${emissao}</p>
        </div>
      </div>
      <div class="w-48 border-t-2 border-black text-center pt-1.5">
        <p class="font-black uppercase text-black" style="font-size:8px;letter-spacing:0.2em">Aprovação Técnica</p>
      </div>
    </div>

  </div>`

  return htmlDoc(body)
}

// ─── FICHA DE CORTE ───────────────────────────────────────────────────────────

export function buildFichaCorteePdf(peca: Peca, corte: Corte, _appUrl?: string): string {
  const sizes = (peca.gradeCorte || '')
    .split(/[,/\s]+/)
    .filter(s => s.trim() !== '')

  const emissao = new Date().toLocaleString('pt-BR')

  const sizesHeaderCells = sizes.map(s =>
    `<th class="border border-white/20 p-1 font-black uppercase" style="font-size:12px">${s}</th>`
  ).join('')

  const sizesEmptyCells = sizes.map(() =>
    `<td class="border-2 border-black"></td>`
  ).join('')

  const itemsHtml = (corte.items || []).map((item, idx) => {
    const sizeHeaderRow = sizes.map(s =>
      `<td class="border-r border-black border-b py-1" style="font-size:8px">${s}</td>`
    ).join('')

    const previstoTotal = sizes.reduce((acc, s) => acc + (item.grade?.[s]?.previsto || 0), 0)

    const previstoRow = sizes.map(s =>
      `<td class="border-r border-black border-b px-1" style="font-size:11px">${item.grade?.[s]?.previsto || '—'}</td>`
    ).join('')

    const realRow = sizes.map(() =>
      `<td class="border-r border-black"></td>`
    ).join('')

    const observacoes = idx === (corte.items!.length - 1) && corte.observacoes
      ? `<div class="p-3 border-t-2 border-black flex gap-3" style="background:rgba(254,252,232,0.3)">
           <p class="leading-tight text-gray-700 italic" style="font-size:11px">${corte.observacoes}</p>
         </div>`
      : ''

    return `
    <div class="border-2 border-black" style="break-inside:avoid;margin-bottom:24px">
      <div class="flex">
        <div class="border-r-2 border-black flex flex-col items-center justify-center p-2" style="width:128px;background:rgba(249,250,251,0.5)">
          <p class="font-black uppercase text-gray-300 mb-1" style="font-size:7px">Amostra Física</p>
          <div class="border-2 border-dashed rounded flex items-center justify-center bg-white" style="width:80px;height:64px;border-color:rgba(0,0,0,0.1)">
            <p class="text-gray-200 text-center uppercase px-2 font-black leading-none" style="font-size:7px">Grampear Amostra</p>
          </div>
        </div>
        <div class="flex-1 flex flex-col">
          <div class="grid border-b border-black" style="grid-template-columns:5fr 3fr 2fr 2fr">
            <div class="p-1.5 px-3 border-r border-black">
              <p class="font-black uppercase text-gray-400" style="font-size:7px">Tecido</p>
              <p class="font-black text-black leading-tight uppercase" style="font-size:${(item.nome?.length || 0) > 20 ? '9px' : '11px'}">${item.nome || '—'}</p>
            </div>
            <div class="p-1.5 px-3 border-r border-black">
              <p class="font-black uppercase text-black/40" style="font-size:7px">Cor do Tecido</p>
              <p class="font-black text-black leading-none uppercase truncate" style="font-size:11px">${item.cor || '—'}</p>
            </div>
            <div class="p-1.5 px-3 border-r border-black">
              <p class="font-black uppercase text-gray-400" style="font-size:7px">Largura</p>
              <p class="font-bold text-black leading-none uppercase" style="font-size:11px">${item.largura || '—'}</p>
            </div>
            <div class="p-1.5 px-3" style="background:rgba(249,250,251,0.5)">
              <p class="font-black uppercase text-gray-400 italic" style="font-size:7px">Consumo Final</p>
              <div class="h-4 border-b border-dashed" style="border-color:rgba(0,0,0,0.2)"></div>
            </div>
          </div>
          <table class="w-full text-center border-collapse">
            <thead>
              <tr class="border-t border-black font-black uppercase text-gray-500" style="background:rgba(243,244,246,0.3);font-size:8px">
                <td class="w-14 border-r border-black border-b py-1">GRADE</td>
                ${sizeHeaderRow}
                <td class="border-b border-black bg-gray-200 text-black py-1">TOTAL</td>
              </tr>
            </thead>
            <tbody style="font-size:11px;font-weight:700">
              <tr style="height:28px">
                <td class="border-r border-black border-b bg-gray-50 font-black uppercase text-gray-400" style="font-size:7px">Previsto</td>
                ${previstoRow}
                <td class="border-b border-black bg-gray-100 font-black">${previstoTotal}</td>
              </tr>
              <tr style="height:32px" class="text-black bg-white italic">
                <td class="border-r border-black bg-gray-50 font-black uppercase text-gray-400" style="font-size:7px">Real</td>
                ${realRow}
                <td class="bg-gray-100"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      ${observacoes}
    </div>`
  }).join('')

  const body = `
  <div class="bg-white text-black" style="padding:0">

    <!-- CABEÇALHO -->
    <div class="grid border-2 border-black mb-3" style="grid-template-columns:1fr 2fr 1fr">
      <div class="p-2 border-r-2 border-black flex flex-col justify-center items-center bg-black text-white">
        <div class="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center font-black text-lg mb-0.5">JC</div>
        <p class="font-black uppercase tracking-widest leading-none" style="font-size:8px">JC STUDIO</p>
      </div>
      <div class="p-2 px-3 flex flex-col justify-center">
        <p class="font-black uppercase text-gray-400 mb-0.5" style="font-size:8px;letter-spacing:0.2em">Ficha de Corte Gerencial</p>
        <h1 class="text-lg font-black uppercase tracking-tight leading-none truncate">${peca.nome || '—'}</h1>
        <p class="font-bold text-gray-500 mt-1 uppercase" style="font-size:9px">Ref: ${peca.referencia} | Coleção: ${peca.colecao || '—'}</p>
      </div>
      <div class="p-2 border-l-2 border-black flex flex-col justify-center items-center bg-gray-50">
        <p class="font-black uppercase text-gray-400 mb-0.5" style="font-size:8px">Nº DO CORTE</p>
        <p class="font-black text-black leading-none" style="font-size:14px">${corte.numeroCorte}</p>
      </div>
    </div>

    <!-- EQUIPE -->
    <div class="grid border-2 border-black mb-4" style="grid-template-columns:repeat(5,1fr);background:rgba(249,250,251,0.3)">
      <div class="p-2 border-r-2 border-black">
        <p class="font-black uppercase text-gray-400 mb-0.5 leading-none" style="font-size:8px">Estilista</p>
        <p class="font-bold text-black uppercase truncate" style="font-size:11px">${peca.estilista || '—'}</p>
      </div>
      <div class="p-2 border-r-2 border-black">
        <p class="font-black uppercase text-gray-400 mb-0.5 leading-none" style="font-size:8px">Modelista</p>
        <p class="font-bold text-black uppercase truncate" style="font-size:11px">${peca.modelista || '—'}</p>
      </div>
      <div class="p-2 border-r-2 border-black">
        <p class="font-black uppercase text-gray-400 mb-0.5 leading-none" style="font-size:8px">Resp. Corte</p>
        <p class="font-bold text-black uppercase truncate" style="font-size:11px">${peca.responsavelCorte || '—'}</p>
      </div>
      <div class="p-2 border-r-2 border-black">
        <p class="font-black uppercase text-gray-400 mb-0.5 leading-none" style="font-size:8px">Emissão</p>
        <p class="font-bold text-black uppercase" style="font-size:11px">${formatDateBr(corte.dataCorte)}</p>
      </div>
      <div class="p-2 bg-white">
        <p class="font-black uppercase text-gray-400 mb-0.5 leading-none italic" style="font-size:8px">Data do Corte</p>
        <div class="h-4 border-b border-dashed" style="border-color:rgba(0,0,0,0.2)"></div>
      </div>
    </div>

    <!-- GRADE TOTAL -->
    <div class="mb-6 text-center">
      <div class="flex items-center gap-2 mb-2 px-1">
        <div class="h-0.5 w-10 bg-black"></div>
        <p class="font-black uppercase tracking-widest text-black" style="font-size:10px">Total Geral do Corte (Conferência Final)</p>
      </div>
      <table class="w-full border-collapse border-2 border-black text-center">
        <thead>
          <tr class="bg-black text-white">
            ${sizesHeaderCells}
            <th class="border border-white/20 p-1 font-black uppercase bg-gray-800" style="font-size:12px">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          <tr class="bg-white font-black" style="height:40px;font-size:20px">
            ${sizesEmptyCells}
            <td class="border-2 border-black bg-gray-50"></td>
          </tr>
        </tbody>
      </table>
      <p class="mt-1 font-black uppercase text-gray-400 italic" style="font-size:7px">Preencher ao final do corte para fechamento da quantidade real</p>
    </div>

    <!-- ITENS -->
    <div>
      <div class="flex items-center gap-2 mb-2">
        <div class="h-0.5 w-10 bg-black"></div>
        <p class="font-black uppercase tracking-widest text-black" style="font-size:11px">Detalhamento por Tecido e Cor</p>
      </div>
      ${itemsHtml}
    </div>

    <!-- ASSINATURA -->
    <div class="mt-16 flex justify-end gap-12 text-center">
      <div class="w-48 border-t border-black pt-1">
        <p class="font-black uppercase tracking-tighter" style="font-size:10px">Assinatura Cortador</p>
      </div>
      <div class="w-48 border-t border-black pt-1">
        <p class="font-black uppercase tracking-tighter" style="font-size:10px">Conferência PCP</p>
      </div>
    </div>

    <!-- RODAPÉ -->
    <div class="flex justify-between items-center text-gray-300 uppercase font-black mt-10" style="font-size:8px">
      <span>JC STUDIO - Ficha de Corte Gerencial Estrita</span>
      <span>Emissão: ${emissao}</span>
    </div>

  </div>`

  return htmlDoc(body)
}
