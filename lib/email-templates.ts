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

const headerStyle = 'font-family:Arial,sans-serif;'
const tdLabel = 'font-size:8px;color:#999;text-transform:uppercase;letter-spacing:0.1em;'
const tdValue = 'font-size:11px;font-weight:700;color:#000;'

function teamRow(peca: Peca) {
  const cols = [
    { label: 'Estilista', value: peca.estilista },
    { label: 'Modelista', value: peca.modelista },
    { label: 'Pilotista', value: peca.pilotista },
    { label: 'Oficina', value: peca.oficina },
    { label: 'Resp. Corte', value: peca.responsavelCorte },
  ]
  return `
    <tr>
      ${cols.map((c, i) => `
        <td style="padding:8px 12px;${i < cols.length - 1 ? 'border-right:1px solid #e5e7eb;' : ''}">
          <div style="${tdLabel}">${c.label}</div>
          <div style="${tdValue}">${c.value || '—'}</div>
        </td>
      `).join('')}
    </tr>
  `
}

function sectionHeader(title: string) {
  return `
    <tr>
      <td colspan="5" style="background:#000;color:#fff;padding:6px 12px;font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:0.15em;">
        ${title}
      </td>
    </tr>
  `
}

function materiaisTable(materiais: Tecido[]) {
  if (!materiais || materiais.length === 0) return ''
  return `
    <tr><td colspan="5" style="padding:0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="${headerStyle}border-top:1px solid #e5e7eb;">
        ${sectionHeader('Tecidos e Materiais')}
        <tr style="background:#f9fafb;">
          <th style="padding:6px 12px;font-size:8px;font-weight:900;text-transform:uppercase;color:#6b7280;text-align:left;border-bottom:1px solid #e5e7eb;">Ref.</th>
          <th style="padding:6px 12px;font-size:8px;font-weight:900;text-transform:uppercase;color:#6b7280;text-align:left;border-bottom:1px solid #e5e7eb;">Nome</th>
          <th style="padding:6px 12px;font-size:8px;font-weight:900;text-transform:uppercase;color:#6b7280;text-align:left;border-bottom:1px solid #e5e7eb;">Composição</th>
          <th style="padding:6px 12px;font-size:8px;font-weight:900;text-transform:uppercase;color:#6b7280;text-align:left;border-bottom:1px solid #e5e7eb;">Largura</th>
          <th style="padding:6px 12px;font-size:8px;font-weight:900;text-transform:uppercase;color:#6b7280;text-align:left;border-bottom:1px solid #e5e7eb;">Consumo</th>
        </tr>
        ${materiais.map((m, i) => `
          <tr style="${i % 2 === 1 ? 'background:#f9fafb;' : ''}">
            <td style="padding:6px 12px;font-size:10px;color:#374151;">${m.referencia || '—'}</td>
            <td style="padding:6px 12px;font-size:10px;font-weight:600;color:#000;">${m.nome || '—'}${m.cor ? ` / ${m.cor}` : ''}</td>
            <td style="padding:6px 12px;font-size:10px;color:#374151;">${m.composicao || '—'}</td>
            <td style="padding:6px 12px;font-size:10px;color:#374151;">${m.largura || '—'}</td>
            <td style="padding:6px 12px;font-size:10px;color:#374151;">${m.consumo || '—'}</td>
          </tr>
        `).join('')}
      </table>
    </td></tr>
  `
}

function aviamentosTable(aviamentos: Aviamento[]) {
  if (!aviamentos || aviamentos.length === 0) return ''
  return `
    <tr><td colspan="5" style="padding:0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="${headerStyle}border-top:1px solid #e5e7eb;">
        ${sectionHeader('Aviamentos')}
        <tr style="background:#f9fafb;">
          <th style="padding:6px 12px;font-size:8px;font-weight:900;text-transform:uppercase;color:#6b7280;text-align:left;border-bottom:1px solid #e5e7eb;">Ref.</th>
          <th style="padding:6px 12px;font-size:8px;font-weight:900;text-transform:uppercase;color:#6b7280;text-align:left;border-bottom:1px solid #e5e7eb;">Nome</th>
          <th style="padding:6px 12px;font-size:8px;font-weight:900;text-transform:uppercase;color:#6b7280;text-align:left;border-bottom:1px solid #e5e7eb;">Medida</th>
          <th style="padding:6px 12px;font-size:8px;font-weight:900;text-transform:uppercase;color:#6b7280;text-align:left;border-bottom:1px solid #e5e7eb;">Cor</th>
          <th style="padding:6px 12px;font-size:8px;font-weight:900;text-transform:uppercase;color:#6b7280;text-align:left;border-bottom:1px solid #e5e7eb;">Consumo</th>
        </tr>
        ${aviamentos.map((a, i) => `
          <tr style="${i % 2 === 1 ? 'background:#f9fafb;' : ''}">
            <td style="padding:6px 12px;font-size:10px;color:#374151;">${a.referencia || '—'}</td>
            <td style="padding:6px 12px;font-size:10px;font-weight:600;color:#000;">${a.nome || '—'}</td>
            <td style="padding:6px 12px;font-size:10px;color:#374151;">${a.medida || '—'}</td>
            <td style="padding:6px 12px;font-size:10px;color:#374151;">${a.cor || '—'}</td>
            <td style="padding:6px 12px;font-size:10px;color:#374151;">${a.consumo || '—'}</td>
          </tr>
        `).join('')}
      </table>
    </td></tr>
  `
}

export function buildFichaTecnicaHtml(peca: Peca, appUrl: string): string {
  const dataFormatada = new Date().toLocaleDateString('pt-BR')
  const docId = `FT-${peca.id.slice(-8).toUpperCase()}`

  const fotosBlock = (peca.fotoFrente || peca.fotoVerso) ? `
    <tr><td colspan="5" style="padding:12px;border-top:1px solid #e5e7eb;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          ${peca.fotoFrente ? `<td style="padding:4px;text-align:center;"><div style="font-size:8px;color:#9ca3af;text-transform:uppercase;margin-bottom:4px;">Frente</div><img src="${appUrl}${peca.fotoFrente}" alt="Frente" style="max-width:200px;max-height:200px;border-radius:8px;border:1px solid #e5e7eb;" /></td>` : ''}
          ${peca.fotoVerso ? `<td style="padding:4px;text-align:center;"><div style="font-size:8px;color:#9ca3af;text-transform:uppercase;margin-bottom:4px;">Verso</div><img src="${appUrl}${peca.fotoVerso}" alt="Verso" style="max-width:200px;max-height:200px;border-radius:8px;border:1px solid #e5e7eb;" /></td>` : ''}
        </tr>
      </table>
    </td></tr>
  ` : ''

  const equipamentosBlock = (peca.equipamentos && peca.equipamentos.length > 0) ? `
    <tr><td colspan="5" style="padding:0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="${headerStyle}border-top:1px solid #e5e7eb;">
        ${sectionHeader('Equipamentos')}
        ${peca.equipamentos.map((e, i) => `
          <tr style="${i % 2 === 1 ? 'background:#f9fafb;' : ''}">
            <td style="padding:6px 12px;${tdLabel}">Máquina</td>
            <td style="padding:6px 12px;font-size:10px;font-weight:600;">${e.maquina || '—'}</td>
            <td style="padding:6px 12px;${tdLabel}">Agulha</td>
            <td colspan="2" style="padding:6px 12px;font-size:10px;font-weight:600;">${e.agulha || '—'}</td>
          </tr>
        `).join('')}
      </table>
    </td></tr>
  ` : ''

  const obsTecnicas = (peca.pontosCriticos || peca.caracteristicasCostura) ? `
    <tr><td colspan="5" style="padding:0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="${headerStyle}border-top:1px solid #e5e7eb;">
        ${sectionHeader('Observações Técnicas')}
        <tr>
          ${peca.pontosCriticos ? `<td style="padding:10px 12px;vertical-align:top;border-right:1px solid #e5e7eb;"><div style="${tdLabel}">Pontos Críticos</div><div style="font-size:10px;color:#374151;margin-top:4px;white-space:pre-wrap;">${peca.pontosCriticos}</div></td>` : ''}
          ${peca.caracteristicasCostura ? `<td style="padding:10px 12px;vertical-align:top;"><div style="${tdLabel}">Características de Costura</div><div style="font-size:10px;color:#374151;margin-top:4px;white-space:pre-wrap;">${peca.caracteristicasCostura}</div></td>` : ''}
        </tr>
      </table>
    </td></tr>
  ` : ''

  const obsGerais = peca.observacoesGerais ? `
    <tr><td colspan="5" style="padding:10px 12px;border-top:1px solid #e5e7eb;">
      <div style="${tdLabel}">Observações Gerais</div>
      <div style="font-size:10px;color:#374151;margin-top:4px;white-space:pre-wrap;">${peca.observacoesGerais}</div>
    </td></tr>
  ` : ''

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ficha Técnica – ${peca.nome || peca.referencia}</title>
</head>
<body style="margin:0;padding:20px;background:#f3f4f6;${headerStyle}">
  <table width="600" cellpadding="0" cellspacing="0" style="margin:0 auto;background:#fff;border:2px solid #000;border-radius:0;">

    <!-- HEADER -->
    <tr>
      <td width="80" style="background:#000;padding:16px;text-align:center;vertical-align:middle;">
        <div style="width:40px;height:40px;background:#fff;color:#000;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;font-weight:900;font-size:14px;font-family:Arial,sans-serif;margin-bottom:4px;">JC</div>
        <div style="font-size:7px;font-weight:900;color:#fff;letter-spacing:0.2em;text-transform:uppercase;">JC Studio</div>
      </td>
      <td style="padding:16px 20px;vertical-align:middle;">
        <div style="font-size:8px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.2em;margin-bottom:4px;">Ficha Técnica de Vestuário</div>
        <div style="font-size:22px;font-weight:900;color:#000;text-transform:uppercase;line-height:1.1;">${peca.nome || '—'}</div>
        <div style="font-size:11px;color:#6b7280;margin-top:4px;">${peca.colecao || '—'}</div>
      </td>
      <td width="130" style="border-left:2px solid #000;padding:12px;text-align:center;vertical-align:middle;">
        <div style="${tdLabel}">Referência</div>
        <div style="font-size:18px;font-weight:900;color:#000;">${peca.referencia}</div>
        <div style="font-size:8px;color:#9ca3af;margin-top:6px;">${tdLabel}Tamanho Piloto</div>
        <div style="font-size:12px;font-weight:700;">${peca.tamanhoPiloto || '—'}</div>
      </td>
    </tr>

    <!-- GRADE -->
    ${peca.gradeCorte ? `
    <tr>
      <td colspan="5" style="padding:6px 12px;background:#f9fafb;border-top:1px solid #e5e7eb;">
        <span style="${tdLabel}">Grade de Corte: </span>
        <span style="font-size:10px;font-weight:700;">${peca.gradeCorte}</span>
      </td>
    </tr>` : ''}

    <!-- EQUIPE -->
    <tr><td colspan="5" style="padding:0;border-top:2px solid #000;">
      <table width="100%" cellpadding="0" cellspacing="0" style="${headerStyle}background:#f9fafb;">
        ${teamRow(peca)}
      </table>
    </td></tr>

    <!-- FOTOS -->
    ${fotosBlock}

    <!-- MATERIAIS -->
    ${materiaisTable(peca.materiais || [])}

    <!-- AVIAMENTOS -->
    ${aviamentosTable(peca.aviamentos || [])}

    <!-- EQUIPAMENTOS -->
    ${equipamentosBlock}

    <!-- OBSERVAÇÕES TÉCNICAS -->
    ${obsTecnicas}

    <!-- OBSERVAÇÕES GERAIS -->
    ${obsGerais}

    <!-- FOOTER -->
    <tr>
      <td colspan="5" style="padding:10px 12px;border-top:2px solid #000;background:#f9fafb;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:8px;color:#9ca3af;">${docId}</td>
            <td style="font-size:8px;color:#9ca3af;text-align:center;">Emitido em: ${dataFormatada}</td>
            <td style="text-align:right;"><a href="${appUrl}/pecas/${peca.id}" style="font-size:8px;color:#000;text-decoration:underline;">Ver online</a></td>
          </tr>
        </table>
      </td>
    </tr>

  </table>
</body>
</html>`
}

export function buildFichaCorteHtml(peca: Peca, corte: Corte, appUrl: string): string {
  const dataFormatada = new Date().toLocaleDateString('pt-BR')
  const dataCorte = corte.dataCorte ? new Date(corte.dataCorte).toLocaleDateString('pt-BR') : '—'
  const docId = `FC-${corte.id.slice(-8).toUpperCase()}`

  const itensBlock = (corte.items && corte.items.length > 0) ? corte.items.map((item, i) => {
    const grade = item.grade as Record<string, { previsto: number; real: number }> | null
    const tamanhos = grade ? Object.keys(grade) : []

    return `
      <tr><td colspan="5" style="padding:0;border-top:1px solid #e5e7eb;">
        <table width="100%" cellpadding="0" cellspacing="0" style="${headerStyle}">
          <tr style="background:#f9fafb;">
            <td colspan="5" style="padding:8px 12px;">
              <span style="font-size:11px;font-weight:700;color:#000;">${item.nome || '—'}</span>
              ${item.cor ? `<span style="font-size:10px;color:#6b7280;margin-left:8px;">Cor: ${item.cor}</span>` : ''}
              ${item.largura ? `<span style="font-size:10px;color:#6b7280;margin-left:8px;">Largura: ${item.largura}</span>` : ''}
              ${item.fornecedor ? `<span style="font-size:10px;color:#6b7280;margin-left:8px;">Forn.: ${item.fornecedor}</span>` : ''}
            </td>
          </tr>
          ${tamanhos.length > 0 ? `
          <tr>
            ${tamanhos.map(t => `<td style="padding:6px 12px;text-align:center;border-right:1px solid #e5e7eb;"><div style="${tdLabel}">${t}</div><div style="font-size:12px;font-weight:700;">${grade![t]?.previsto ?? 0}</div></td>`).join('')}
          </tr>` : ''}
        </table>
      </td></tr>
    `
  }).join('') : '<tr><td colspan="5" style="padding:12px;color:#9ca3af;font-size:10px;text-align:center;">Nenhum item</td></tr>'

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ficha de Corte – ${corte.numeroCorte}</title>
</head>
<body style="margin:0;padding:20px;background:#f3f4f6;${headerStyle}">
  <table width="600" cellpadding="0" cellspacing="0" style="margin:0 auto;background:#fff;border:2px solid #000;">

    <!-- HEADER -->
    <tr>
      <td width="80" style="background:#000;padding:16px;text-align:center;vertical-align:middle;">
        <div style="width:40px;height:40px;background:#fff;color:#000;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;font-weight:900;font-size:14px;font-family:Arial,sans-serif;margin-bottom:4px;">JC</div>
        <div style="font-size:7px;font-weight:900;color:#fff;letter-spacing:0.2em;text-transform:uppercase;">JC Studio</div>
      </td>
      <td style="padding:16px 20px;vertical-align:middle;">
        <div style="font-size:8px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.2em;margin-bottom:4px;">Ficha de Corte</div>
        <div style="font-size:20px;font-weight:900;color:#000;text-transform:uppercase;">${peca.nome || '—'}</div>
        <div style="font-size:11px;color:#6b7280;">${peca.referencia} · ${peca.colecao || '—'}</div>
      </td>
      <td width="130" style="border-left:2px solid #000;padding:12px;text-align:center;vertical-align:middle;">
        <div style="${tdLabel}">Nº do Corte</div>
        <div style="font-size:16px;font-weight:900;color:#000;">${corte.numeroCorte}</div>
        <div style="font-size:8px;color:#9ca3af;margin-top:6px;">${tdLabel}Data do Corte</div>
        <div style="font-size:11px;font-weight:700;">${dataCorte}</div>
      </td>
    </tr>

    <!-- EQUIPE -->
    <tr><td colspan="5" style="padding:0;border-top:2px solid #000;">
      <table width="100%" cellpadding="0" cellspacing="0" style="${headerStyle}background:#f9fafb;">
        ${teamRow(peca)}
      </table>
    </td></tr>

    ${corte.observacoes ? `
    <tr>
      <td colspan="5" style="padding:8px 12px;border-top:1px solid #e5e7eb;">
        <div style="${tdLabel}">Observações</div>
        <div style="font-size:10px;color:#374151;margin-top:2px;">${corte.observacoes}</div>
      </td>
    </tr>` : ''}

    <!-- SEÇÃO ITENS -->
    <tr><td colspan="5" style="padding:0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="${headerStyle}border-top:1px solid #e5e7eb;">
        ${sectionHeader('Tecidos do Corte')}
        ${itensBlock}
      </table>
    </td></tr>

    <!-- FOOTER -->
    <tr>
      <td colspan="5" style="padding:10px 12px;border-top:2px solid #000;background:#f9fafb;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:8px;color:#9ca3af;">${docId}</td>
            <td style="font-size:8px;color:#9ca3af;text-align:center;">Emitido em: ${dataFormatada}</td>
            <td style="text-align:right;"><a href="${appUrl}/pecas/${peca.id}/corte/${corte.id}/imprimir" style="font-size:8px;color:#000;text-decoration:underline;">Ver online</a></td>
          </tr>
        </table>
      </td>
    </tr>

  </table>
</body>
</html>`
}
