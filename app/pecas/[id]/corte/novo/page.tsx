'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  PlusCircle,
  Scissors,
  Package,
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { showToast } from '@/components/ui/toast'

interface PecaPiloto {
  id: string
  referencia: string
  nome: string
  gradeCorte: string | null
  materiais: any[]
}

export default function NovaFichaCortePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  
  const [peca, setPeca] = useState<PecaPiloto | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Dados do formulário
  const [numeroCorte, setNumeroCorte] = useState('')
  const [dataCorte, setDataCorte] = useState(new Date().toISOString().split('T')[0])
  const [observacoes, setObservacoes] = useState('')
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar dados da peça
        const pecaRes = await fetch(`/api/pecas/${id}`)
        const pecaResult = await pecaRes.json()
        
        // Buscar cortes existentes para calcular o próximo número
        const cortesRes = await fetch(`/api/pecas/${id}/corte`)
        const cortesResult = await cortesRes.json()
        
        if (pecaRes.ok) {
          setPeca(pecaResult.data)
          
          // Lógica de geração do número do corte: CRT + REF + MM + AAAA + SEQ(3)
          const agora = new Date()
          const mes = String(agora.getMonth() + 1).padStart(2, '0')
          const ano = String(agora.getFullYear())
          const ref = pecaResult.data.referencia || 'REF'
          
          // Calcular sequência (total de cortes + 1)
          const sequencia = String((cortesResult.data?.length || 0) + 1).padStart(3, '0')
          
          setNumeroCorte(`CRT-${ref}-${mes}${ano}-${sequencia}`)
        }
      } catch (error) {
        console.error('Erro ao inicializar dados:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleAddMaterialFromFicha = (material: any) => {
    const sizes = peca?.gradeCorte?.split(/[,/\s]+/).filter(s => s.trim() !== '') || []
    const gradeInicial: any = {}
    sizes.forEach(s => {
      gradeInicial[s.trim()] = { previsto: 0, real: 0 }
    })

    setItems([...items, {
      tecidoOriginalId: material.id,
      nome: material.nome,
      fornecedor: material.codFornecedor || material.fornecedor,
      cor: material.cor || '',
      largura: material.largura || '',
      grade: gradeInicial
    }])
  }

  const handleUpdateItem = (index: number, field: string, value: any) => {
    const newItems = [...items]
    newItems[index][field] = value
    setItems(newItems)
  }

  const handleUpdateGrade = (itemIndex: number, size: string, field: 'previsto' | 'real', value: number) => {
    const newItems = [...items]
    newItems[itemIndex].grade[size][field] = value
    setItems(newItems)
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!numeroCorte.trim() || items.length === 0) {
      showToast({ 
        title: 'Atenção', 
        description: 'Preencha o número do corte e adicione pelo menos um tecido.', 
        variant: 'destructive' 
      })
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/pecas/${id}/corte`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numeroCorte,
          dataCorte,
          observacoes,
          items
        })
      })

      if (response.ok) {
        showToast({ title: 'Sucesso', description: 'Ficha de Corte criada!' })
        router.push(`/pecas/${id}`)
      } else {
        throw new Error()
      }
    } catch (error) {
      showToast({ title: 'Erro', description: 'Falha ao salvar a ficha de corte.', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const sizes = peca?.gradeCorte?.split(/[,/\s]+/).filter(s => s.trim() !== '') || []

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 animate-in fade-in duration-500">
      <header className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <Link href={`/pecas/${id}`}>
            <button className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-black hover:shadow-sm transition-all">
              <ArrowLeft size={18} />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-black uppercase tracking-tight">Nova Ficha de Corte</h1>
            <p className="text-gray-400 text-sm">Preencha as quantidades e prepare o corte.</p>
          </div>
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={saving}
          className="bg-black text-white hover:bg-gray-800 rounded-2xl h-12 px-8 font-bold flex items-center gap-2 shadow-lg shadow-black/10 transition-all active:scale-95"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
          Gerar Ficha
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lado Esquerdo: Cabeçalho do Corte e Seleção de Materiais */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm space-y-6">
            <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-black/40 mb-4">
              <Layers size={14} /> Informações Gerais
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Número do Corte</label>
                <Input 
                  value={numeroCorte}
                  onChange={(e) => setNumeroCorte(e.target.value)}
                  placeholder="Ex: 001/2026"
                  className="h-12 rounded-2xl bg-gray-50/50 border-gray-100 focus:bg-white transition-all font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Data do Corte</label>
                <Input 
                  type="date"
                  value={dataCorte}
                  onChange={(e) => setDataCorte(e.target.value)}
                  className="h-12 rounded-2xl bg-gray-50/50 border-gray-100 focus:bg-white transition-all font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Observações</label>
                <textarea 
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  className="w-full min-h-[100px] rounded-2xl bg-gray-50/50 border border-gray-100 p-3 text-sm focus:bg-white transition-all"
                  placeholder="Alguma nota importante para o cortador?"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
            <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-black/40 mb-6">
              <Package size={14} /> Adicionar da Ficha Técnica
            </h2>
            <div className="space-y-3">
              {peca?.materiais?.map((mat, i) => (
                <button
                  key={i}
                  onClick={() => handleAddMaterialFromFicha(mat)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-2xl hover:bg-white hover:border-black/10 hover:shadow-sm transition-all text-left group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-black uppercase truncate">{mat.nome}</p>
                    <p className="text-[10px] text-gray-400 uppercase truncate">{mat.cor || 'Cor não definida'}</p>
                  </div>
                  <PlusCircle size={18} className="text-gray-300 group-hover:text-black transition-colors" />
                </button>
              ))}
              {(!peca?.materiais || peca.materiais.length === 0) && (
                <p className="text-center py-4 text-xs text-gray-400 italic">Nenhum tecido técnico vinculado à peça.</p>
              )}
            </div>
          </div>
        </div>

        {/* Lado Direito: Listagem Dinâmica de Tecidos e Cores */}
        <div className="lg:col-span-2 space-y-6">
          {sizes.length === 0 && peca && (
            <div className="flex items-start gap-3 p-5 bg-yellow-50 border border-yellow-200 rounded-[32px] text-yellow-800">
              <AlertTriangle size={18} className="shrink-0 mt-0.5 text-yellow-500" />
              <div>
                <p className="text-xs font-black uppercase tracking-wide mb-0.5">Grade de tamanhos não cadastrada</p>
                <p className="text-xs leading-relaxed">
                  Esta peça não possui grade de tamanhos. Adicione a grade na ficha da peça antes de criar um corte — sem ela, as quantidades por tamanho não poderão ser preenchidas.
                </p>
                <a
                  href={`/pecas/${id}`}
                  className="inline-block mt-3 text-[10px] font-black uppercase tracking-widest text-yellow-700 underline underline-offset-2 hover:text-yellow-900 transition-colors"
                >
                  Ir para a ficha da peça →
                </a>
              </div>
            </div>
          )}

          {items.length === 0 ? (
            <div className="bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-[32px] py-40 flex flex-col items-center justify-center text-center px-10">
              <div className="w-16 h-16 bg-white text-gray-200 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                <Scissors size={32} />
              </div>
              <h3 className="text-gray-900 font-bold uppercase tracking-tight">Comece adicionando tecidos</h3>
              <p className="text-gray-400 text-sm mt-1">Selecione os tecidos da peça ao lado para preencher as quantidades por cor.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item, idx) => (
                <div key={idx} className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm animate-in zoom-in-95 duration-300 relative group overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleRemoveItem(idx)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 mt-2">
                    <div className="md:col-span-2">
                      <label className="text-[9px] font-black uppercase text-gray-300 block mb-1">Tecido / Nome Fantasia</label>
                      <Input 
                        value={item.nome}
                        onChange={(e) => handleUpdateItem(idx, 'nome', e.target.value)}
                        className="font-bold uppercase h-10 px-0 bg-transparent border-0 border-b border-gray-100 rounded-none focus-visible:ring-0 focus:border-black transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase text-gray-300 block mb-1">Cor</label>
                      <Input 
                        value={item.cor}
                        onChange={(e) => handleUpdateItem(idx, 'cor', e.target.value)}
                        className="font-bold text-blue-600 h-10 px-0 bg-transparent border-0 border-b border-gray-100 rounded-none focus-visible:ring-0 focus:border-black transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase text-gray-300 block mb-1">Largura</label>
                      <Input 
                        value={item.largura}
                        onChange={(e) => handleUpdateItem(idx, 'largura', e.target.value)}
                        className="font-bold h-10 px-0 bg-transparent border-0 border-b border-gray-100 rounded-none focus-visible:ring-0 focus:border-black transition-colors"
                      />
                    </div>
                  </div>

                  {/* Grade de Quantidades */}
                  {sizes.length === 0 ? (
                    <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl text-yellow-800">
                      <AlertTriangle size={16} className="shrink-0 mt-0.5 text-yellow-500" />
                      <p className="text-xs leading-relaxed">
                        Sem grade de tamanhos cadastrada — as colunas de quantidade não podem ser exibidas.
                      </p>
                    </div>
                  ) : (
                  <div className="overflow-x-auto pb-4">
                    <table className="w-full border-separate border-spacing-x-1">
                      <thead>
                        <tr>
                          {sizes.map((s, si) => (
                            <th key={si} className="bg-gray-50 rounded-t-lg py-2 text-[9px] font-black text-gray-400 uppercase min-w-[60px]">{s}</th>
                          ))}
                          <th className="bg-black text-white rounded-t-lg py-2 text-[9px] font-black uppercase min-w-[70px]">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-gray-50/50">
                          {sizes.map((s, si) => (
                            <td key={si} className="p-2">
                              <div className="flex flex-col gap-1">
                                <span className="text-[8px] font-black uppercase text-gray-400 tracking-tighter">Prev.</span>
                                <input 
                                  type="number"
                                  value={item.grade[s].previsto || ''}
                                  onChange={(e) => handleUpdateGrade(idx, s, 'previsto', parseInt(e.target.value) || 0)}
                                  className="w-full h-8 text-center font-bold text-sm bg-white border border-gray-100 rounded-lg focus:outline-none focus:border-black transition-all"
                                  placeholder="0"
                                />
                              </div>
                            </td>
                          ))}
                          <td className="p-2 align-bottom">
                            <div className="h-8 flex items-center justify-center font-black text-black">
                              {sizes.reduce((acc, s) => acc + (item.grade[s].previsto || 0), 0)}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  )}
                </div>
              ))}
              
              <div className="flex justify-center pt-4">
                <button 
                  onClick={() => handleAddMaterialFromFicha({ nome: 'Novo Tecido', cor: '', largura: '' })}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-dashed border-gray-200 text-gray-400 rounded-2xl font-bold text-xs hover:border-black/20 hover:text-black transition-all"
                >
                  <PlusCircle size={16} />
                  Adicionar Tecido Personalizado
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
