import { readFileSync } from 'fs'
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

interface Peca {
  id: string
  referencia: string
  nome?: string | null
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
  materiais?: Tecido[]
  aviamentos?: Aviamento[]
  equipamentos?: Equipamento[]
  createdAt?: string | Date
}

interface CorteItem {
  nome?: string | null
  cor?: string | null
  largura?: string | null
  fornecedor?: string | null
  grade?: Record<string, { previsto: number; real: number }> | null
}

interface Corte {
  id: string
  numeroCorte: string
  dataCorte?: string | Date
  observacoes?: string | null
  items?: CorteItem[]
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function imgToBase64(filePath: string): string | null {
  try {
    const abs = path.join(process.cwd(), 'public', filePath)
    const buf = readFileSync(abs)
    const ext = path.extname(filePath).slice(1).toLowerCase()
    const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`
    return `data:${mime};base64,${buf.toString('base64')}`
  } catch {
    return null
  }
}

const baseStyle = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, Helvetica, sans-serif; background: #fff; color: #000; font-size: 11px; }
  .page { width: 190mm; margin: 0 auto; }
  .header { display: grid; grid-template-columns: 80px 1fr 130px; border: 2px solid #000; }
  .header-logo { background: #000; color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px 8px; }
  .header-logo .jc { width: 38px; height: 38px; background: #fff; color: #000; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 15px; margin-bottom: 4px; }
  .header-logo .studio { font-size: 7px; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; }
  .header-center { padding: 12px 16px; display: flex; flex-direction: column; justify-content: center; }
  .header-center .doc-type { font-size: 8px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; color: #9ca3af; margin-bottom: 4px; }
  .header-center .nome { font-size: 20px; font-weight: 900; text-transform: uppercase; line-height: 1.1; }
  .header-center .colecao { font-size: 11px; color: #6b7280; margin-top: 4px; }
  .header-ref { border-left: 2px solid #000; padding: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f9fafb; text-align: center; }
  .header-ref .ref-label { font-size: 7px; font-weight: 900; text-transform: uppercase; color: #9ca3af; letter-spacing: 0.1em; }
  .header-ref .ref-value { font-size: 18px; font-weight: 900; }
  .header-ref .sub-label { font-size: 7px; font-weight: 900; color: #9ca3af; text-transform: uppercase; margin-top: 6px; }
  .header-ref .sub-value { font-size: 12px; font-weight: 700; }
  .team { display: grid; grid-template-columns: repeat(5, 1fr); border: 2px solid #000; border-top: none; background: #f9fafb; }
  .team-cell { padding: 7px 10px; }
  .team-cell:not(:last-child) { border-right: 1px solid #000; }
  .team-label { font-size: 7px; font-weight: 900; text-transform: uppercase; color: #9ca3af; letter-spacing: 0.1em; margin-bottom: 2px; }
  .team-value { font-size: 11px; font-weight: 700; text-transform: uppercase; }
  .section-title { background: #000; color: #fff; padding: 5px 12px; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.15em; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #f9fafb; padding: 6px 10px; font-size: 8px; font-weight: 900; text-transform: uppercase; color: #6b7280; text-align: left; border-bottom: 1px solid #e5e7eb; }
  td { padding: 6px 10px; font-size: 10px; border-bottom: 1px solid #f3f4f6; }
  tr:nth-child(even) td { background: #f9fafb; }
  .obs-block { display: grid; grid-template-columns: 1fr 1fr; gap: 0; border: 1px solid #e5e7eb; margin-top: 0; }
  .obs-cell { padding: 8px 12px; }
  .obs-cell:first-child { border-right: 1px solid #e5e7eb; }
  .obs-label { font-size: 7px; font-weight: 900; text-transform: uppercase; color: #9ca3af; margin-bottom: 4px; }
  .obs-value { font-size: 10px; color: #374151; white-space: pre-wrap; line-height: 1.5; }
  .footer { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; border-top: 2px solid #000; background: #f9fafb; font-size: 8px; color: #9ca3af; margin-top: 8px; }
  .footer a { color: #000; }
  .grade-row { margin-top: 8px; padding: 6px 12px; background: #f9fafb; border: 1px solid #e5e7eb; font-size: 10px; }
  .photos { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 12px; border: 1px solid #e5e7eb; margin-top: 0; }
  .photo-block { text-align: center; }
  .photo-label { font-size: 7px; font-weight: 900; text-transform: uppercase; color: #9ca3af; margin-bottom: 4px; }
  img.photo { max-width: 100%; max-height: 180px; object-fit: contain; border: 1px solid #e5e7eb; border-radius: 6px; }
  .mt { margin-top: 8px; }
`

// ─── Ficha Técnica ─────────────────────────────────────────────────────────

export function buildFichaTecnicaPdf(peca: Peca, appUrl: string): string {
  const dataHoje = new Date().toLocaleDateString('pt-BR')
  const docId = `FT-${peca.id.slice(-8).toUpperCase()}`
  const materiais = peca.materiais || []
  const aviamentos = peca.aviamentos || []
  const equipamentos = peca.equipamentos || []

  const frenteB64 = peca.fotoFrente ? imgToBase64(peca.fotoFrente) : null
  const versoB64 = peca.fotoVerso ? imgToBase64(peca.fotoVerso) : null

  const fotosBlock = (frenteB64 || versoB64) ? `
    <div class="photos mt">
      ${frenteB64 ? `<div class="photo-block"><div class="photo-label">Frente</div><img class="photo" src="${frenteB64}" /></div>` : ''}
      ${versoB64 ? `<div class="photo-block"><div class="photo-label">Verso</div><img class="photo" src="${versoB64}" /></div>` : ''}
    </div>` : ''

  const materiaisBlock = materiais.length > 0 ? `
    <div class="mt">
      <div class="section-title">Tecidos e Materiais</div>
      <table>
        <thead><tr><th>Ref.</th><th>Nome / Cor</th><th>Composição</th><th>Largura</th><th>Consumo</th></tr></thead>
        <tbody>
          ${materiais.map(m => `<tr>
            <td>${m.referencia || '—'}</td>
            <td style="font-weight:700">${m.nome || '—'}${m.cor ? ` / ${m.cor}` : ''}</td>
            <td>${m.composicao || '—'}</td>
            <td>${m.largura || '—'}</td>
            <td>${m.consumo || '—'}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>` : ''

  const aviamentosBlock = aviamentos.length > 0 ? `
    <div class="mt">
      <div class="section-title">Aviamentos</div>
      <table>
        <thead><tr><th>Ref.</th><th>Nome</th><th>Medida</th><th>Cor</th><th>Consumo</th></tr></thead>
        <tbody>
          ${aviamentos.map(a => `<tr>
            <td>${a.referencia || '—'}</td>
            <td style="font-weight:700">${a.nome || '—'}</td>
            <td>${a.medida || '—'}</td>
            <td>${a.cor || '—'}</td>
            <td>${a.consumo || '—'}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>` : ''

  const equipamentosBlock = equipamentos.length > 0 ? `
    <div class="mt">
      <div class="section-title">Equipamentos</div>
      <table>
        <thead><tr><th>Máquina</th><th>Agulha</th></tr></thead>
        <tbody>
          ${equipamentos.map(e => `<tr><td style="font-weight:700">${e.maquina || '—'}</td><td>${e.agulha || '—'}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>` : ''

  const obsTecnicas = (peca.pontosCriticos || peca.caracteristicasCostura) ? `
    <div class="mt">
      <div class="section-title">Observações Técnicas</div>
      <div class="obs-block">
        ${peca.pontosCriticos ? `<div class="obs-cell"><div class="obs-label">Pontos Críticos</div><div class="obs-value">${peca.pontosCriticos}</div></div>` : '<div class="obs-cell"></div>'}
        ${peca.caracteristicasCostura ? `<div class="obs-cell"><div class="obs-label">Características de Costura</div><div class="obs-value">${peca.caracteristicasCostura}</div></div>` : '<div class="obs-cell"></div>'}
      </div>
    </div>` : ''

  const obsGeraisBlock = peca.observacoesGerais ? `
    <div class="mt">
      <div class="section-title">Observações Gerais</div>
      <div style="padding:8px 12px;border:1px solid #e5e7eb;font-size:10px;color:#374151;white-space:pre-wrap;line-height:1.5">${peca.observacoesGerais}</div>
    </div>` : ''

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><style>${baseStyle}</style></head>
<body>
<div class="page">

  <div class="header">
    <div class="header-logo">
      <div class="jc">JC</div>
      <div class="studio">JC Studio</div>
    </div>
    <div class="header-center">
      <div class="doc-type">Ficha Técnica de Vestuário</div>
      <div class="nome">${peca.nome || '—'}</div>
      <div class="colecao">${peca.colecao || '—'}</div>
    </div>
    <div class="header-ref">
      <div class="ref-label">Referência</div>
      <div class="ref-value">${peca.referencia}</div>
      <div class="sub-label">Tamanho Piloto</div>
      <div class="sub-value">${peca.tamanhoPiloto || '—'}</div>
    </div>
  </div>

  ${peca.gradeCorte ? `<div class="grade-row"><span style="font-size:8px;font-weight:900;text-transform:uppercase;color:#9ca3af">Grade de Corte: </span><span style="font-weight:700">${peca.gradeCorte}</span></div>` : ''}

  <div class="team">
    <div class="team-cell"><div class="team-label">Estilista</div><div class="team-value">${peca.estilista || '—'}</div></div>
    <div class="team-cell"><div class="team-label">Modelista</div><div class="team-value">${peca.modelista || '—'}</div></div>
    <div class="team-cell"><div class="team-label">Pilotista</div><div class="team-value">${peca.pilotista || '—'}</div></div>
    <div class="team-cell"><div class="team-label">Oficina</div><div class="team-value">${peca.oficina || '—'}</div></div>
    <div class="team-cell"><div class="team-label">Resp. Corte</div><div class="team-value">${peca.responsavelCorte || '—'}</div></div>
  </div>

  ${fotosBlock}
  ${materiaisBlock}
  ${aviamentosBlock}
  ${equipamentosBlock}
  ${obsTecnicas}
  ${obsGeraisBlock}

  <div class="footer">
    <span>${docId}</span>
    <span>Emitido em: ${dataHoje}</span>
    <a href="${appUrl}/pecas/${peca.id}">Ver online</a>
  </div>

</div>
</body></html>`
}

// ─── Ficha de Corte ────────────────────────────────────────────────────────

export function buildFichaCorteePdf(peca: Peca, corte: Corte, appUrl: string): string {
  const dataHoje = new Date().toLocaleDateString('pt-BR')
  const dataCorte = corte.dataCorte ? new Date(corte.dataCorte).toLocaleDateString('pt-BR') : '—'
  const docId = `FC-${corte.id.slice(-8).toUpperCase()}`
  const sizes = peca.gradeCorte?.split(/[,/\s]+/).filter(s => s.trim() !== '') || []
  const items = corte.items || []

  const itensBlock = items.map((item, idx) => {
    const grade = item.grade as Record<string, { previsto: number; real: number }> | null
    const total = sizes.reduce((acc, s) => acc + (grade?.[s]?.previsto || 0), 0)
    return `
      <div style="border:2px solid #000;margin-top:${idx === 0 ? '0' : '8px'};break-inside:avoid">
        <div style="display:grid;grid-template-columns:80px 1fr;border-bottom:1px solid #000">
          <div style="background:#f9fafb;border-right:1px solid #000;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8px;text-align:center">
            <div style="font-size:7px;font-weight:900;text-transform:uppercase;color:#d1d5db;margin-bottom:4px">Amostra</div>
            <div style="width:56px;height:48px;border:2px dashed #e5e7eb;border-radius:4px;display:flex;align-items:center;justify-content:center">
              <div style="font-size:6px;color:#d1d5db;text-transform:uppercase;text-align:center;font-weight:900;line-height:1.2">Grampear<br>Amostra</div>
            </div>
          </div>
          <div>
            <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;border-bottom:1px solid #e5e7eb">
              <div style="padding:6px 10px;border-right:1px solid #e5e7eb"><div style="font-size:7px;font-weight:900;text-transform:uppercase;color:#9ca3af">Tecido</div><div style="font-size:12px;font-weight:900;text-transform:uppercase">${item.nome || '—'}</div></div>
              <div style="padding:6px 10px;border-right:1px solid #e5e7eb"><div style="font-size:7px;font-weight:900;text-transform:uppercase;color:#9ca3af">Cor</div><div style="font-size:11px;font-weight:700">${item.cor || '—'}</div></div>
              <div style="padding:6px 10px;border-right:1px solid #e5e7eb"><div style="font-size:7px;font-weight:900;text-transform:uppercase;color:#9ca3af">Largura</div><div style="font-size:11px;font-weight:700">${item.largura || '—'}</div></div>
              <div style="padding:6px 10px;background:#fafafa"><div style="font-size:7px;font-weight:900;text-transform:uppercase;color:#9ca3af;font-style:italic">Consumo Final</div><div style="height:14px;border-bottom:1px dashed #d1d5db;margin-top:4px"></div></div>
            </div>
            <table style="width:100%;border-collapse:collapse;text-align:center">
              <thead>
                <tr style="background:#f3f4f6">
                  <th style="padding:4px 8px;font-size:7px;font-weight:900;text-transform:uppercase;color:#6b7280;text-align:left;border-right:1px solid #e5e7eb">Grade</th>
                  ${sizes.map(s => `<th style="padding:4px 6px;font-size:8px;font-weight:900;text-transform:uppercase;color:#374151;border-right:1px solid #e5e7eb">${s}</th>`).join('')}
                  <th style="padding:4px 8px;font-size:8px;font-weight:900;text-transform:uppercase;background:#e5e7eb">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr style="height:28px">
                  <td style="padding:4px 8px;font-size:7px;font-weight:900;text-transform:uppercase;color:#9ca3af;background:#fafafa;text-align:left;border-right:1px solid #e5e7eb">Previsto</td>
                  ${sizes.map(s => `<td style="font-size:12px;font-weight:700;border-right:1px solid #e5e7eb">${grade?.[s]?.previsto || '—'}</td>`).join('')}
                  <td style="font-size:12px;font-weight:900;background:#f3f4f6">${total}</td>
                </tr>
                <tr style="height:28px">
                  <td style="padding:4px 8px;font-size:7px;font-weight:900;text-transform:uppercase;color:#9ca3af;background:#fafafa;text-align:left;border-right:1px solid #e5e7eb">Real</td>
                  ${sizes.map(_ => `<td style="border-right:1px solid #e5e7eb"></td>`).join('')}
                  <td style="background:#f3f4f6"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        ${(idx === items.length - 1 && corte.observacoes) ? `<div style="padding:8px 12px;background:#fefce8;font-size:10px;color:#713f12;font-style:italic">${corte.observacoes}</div>` : ''}
      </div>`
  }).join('')

  const totalGeral = `
    <div style="margin-top:12px;break-inside:avoid">
      <div class="section-title" style="margin-bottom:4px">Total Geral do Corte (Conferência Final)</div>
      <table style="border:2px solid #000;text-align:center">
        <thead>
          <tr style="background:#000;color:#fff">
            ${sizes.map(s => `<th style="padding:5px 10px;font-size:10px;font-weight:900;border-right:1px solid rgba(255,255,255,0.2)">${s}</th>`).join('')}
            <th style="padding:5px 10px;font-size:10px;font-weight:900;background:#374151">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          <tr style="height:32px">
            ${sizes.map(_ => `<td style="border:1px solid #000;border-top:2px solid #000"></td>`).join('')}
            <td style="border:2px solid #000;background:#f9fafb"></td>
          </tr>
        </tbody>
      </table>
      <div style="font-size:7px;font-weight:900;text-transform:uppercase;color:#9ca3af;margin-top:3px;font-style:italic">Preencher ao final do corte para fechamento da quantidade real</div>
    </div>`

  const assinaturas = `
    <div style="display:flex;justify-content:flex-end;gap:40px;margin-top:32px;text-align:center;break-inside:avoid">
      <div style="width:160px;border-top:1px solid #000;padding-top:4px"><div style="font-size:9px;font-weight:900;text-transform:uppercase">Assinatura Cortador</div></div>
      <div style="width:160px;border-top:1px solid #000;padding-top:4px"><div style="font-size:9px;font-weight:900;text-transform:uppercase">Conferência PCP</div></div>
    </div>`

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><style>${baseStyle}</style></head>
<body>
<div class="page">

  <div class="header">
    <div class="header-logo">
      <div class="jc">JC</div>
      <div class="studio">JC Studio</div>
    </div>
    <div class="header-center">
      <div class="doc-type">Ficha de Corte Gerencial</div>
      <div class="nome">${peca.nome || '—'}</div>
      <div class="colecao">Ref: ${peca.referencia} · ${peca.colecao || '—'}</div>
    </div>
    <div class="header-ref">
      <div class="ref-label">Nº do Corte</div>
      <div class="ref-value" style="font-size:14px">${corte.numeroCorte}</div>
      <div class="sub-label">Data do Corte</div>
      <div class="sub-value">${dataCorte}</div>
    </div>
  </div>

  <div class="team">
    <div class="team-cell"><div class="team-label">Estilista</div><div class="team-value">${peca.estilista || '—'}</div></div>
    <div class="team-cell"><div class="team-label">Modelista</div><div class="team-value">${peca.modelista || '—'}</div></div>
    <div class="team-cell"><div class="team-label">Resp. Corte</div><div class="team-value">${peca.responsavelCorte || '—'}</div></div>
    <div class="team-cell"><div class="team-label">Emissão</div><div class="team-value">${dataHoje}</div></div>
    <div class="team-cell"><div class="team-label">Data do Corte</div><div class="team-value" style="border-bottom:1px dashed #d1d5db;padding-bottom:2px"></div></div>
  </div>

  ${totalGeral}

  <div style="margin-top:12px">
    <div class="section-title" style="margin-bottom:8px">Detalhamento por Tecido e Cor</div>
    ${itensBlock || '<div style="padding:16px;text-align:center;color:#9ca3af;font-size:10px">Nenhum item</div>'}
  </div>

  ${assinaturas}

  <div class="footer">
    <span>${docId}</span>
    <span>Emitido em: ${dataHoje}</span>
    <a href="${appUrl}/pecas/${peca.id}/corte/${corte.id}/imprimir">Ver online</a>
  </div>

</div>
</body></html>`
}
