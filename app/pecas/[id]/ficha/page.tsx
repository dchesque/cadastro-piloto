'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { showToast } from '@/components/ui/toast'
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Image as ImageIcon,
  User,
  ClipboardList,
  Scissors,
  Package,
  Settings
} from 'lucide-react'
import Link from 'next/link'
import { Field } from '@/components/ui/field'

interface Material {
  id?: string
  descricao: string
  nome: string
  cor: string
  codFornecedor: string
  composicao: string
  largura: string
  consumo: string
}

interface Aviamento {
  id?: string
  descricao: string
  nome: string
  medida: string
  cor: string
  codFornecedor: string
  composicao: string
  consumo: string
}

export default function FichaTecnicaPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('geral')

  // Estado do Formulário
  const [formData, setFormData] = useState({
    nome: '',
    referencia: '',
    colecao: '',
    estilista: '',
    modelista: '',
    pilotista: '',
    responsavelCorte: '',
    tamanhoPiloto: '',
    gradeCorte: '',
    fotoFrente: '',
    fotoVerso: '',
    caracteristicasCostura: '',
    pontosCriticos: '',
    maquina: '',
    agulha: '',
  })

  const [materiais, setMateriais] = useState<Material[]>([])
  const [aviamentos, setAviamentos] = useState<Aviamento[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/pecas/${id}`)
        const result = await response.json()
        if (response.ok) {
          const data = result.data
          setFormData({
            nome: data.nome || '',
            referencia: data.referencia || '',
            colecao: data.colecao || '',
            estilista: data.estilista || '',
            modelista: data.modelista || '',
            pilotista: data.pilotista || '',
            responsavelCorte: data.responsavelCorte || '',
            tamanhoPiloto: data.tamanhoPiloto || '',
            gradeCorte: data.gradeCorte || '',
            fotoFrente: data.fotoFrente || '',
            fotoVerso: data.fotoVerso || '',
            caracteristicasCostura: data.caracteristicasCostura || '',
            pontosCriticos: data.pontosCriticos || '',
            maquina: data.maquina || '',
            agulha: data.agulha || '',
          })
          setMateriais(data.materiais || [])
          setAviamentos(data.aviamentos || [])
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const response = await fetch(`/api/pecas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          materiais,
          aviamentos
        }),
      })

      if (response.ok) {
        showToast({ title: 'Sucesso', description: 'Ficha técnica atualizada com sucesso' })
        router.push(`/pecas/${id}`)
      } else {
        showToast({ title: 'Erro', description: 'Erro ao salvar a ficha técnica', variant: 'destructive' })
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      showToast({ title: 'Erro', description: 'Falha na conexão com o servidor', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const addMaterial = () => {
    setMateriais([...materiais, { descricao: '', nome: '', cor: '', codFornecedor: '', composicao: '', largura: '', consumo: '' }])
  }

  const removeMaterial = (index: number) => {
    setMateriais(materiais.filter((_, i) => i !== index))
  }

  const updateMaterial = (index: number, field: keyof Material, value: string) => {
    const newMateriais = [...materiais]
    newMateriais[index] = { ...newMateriais[index], [field]: value }
    setMateriais(newMateriais)
  }

  const addAviamento = () => {
    setAviamentos([...aviamentos, { descricao: '', nome: '', medida: '', cor: '', codFornecedor: '', composicao: '', consumo: '' }])
  }

  const removeAviamento = (index: number) => {
    setAviamentos(aviamentos.filter((_, i) => i !== index))
  }

  const updateAviamento = (index: number, field: keyof Aviamento, value: string) => {
    const newAviamentos = [...aviamentos]
    newAviamentos[index] = { ...newAviamentos[index], [field]: value }
    setAviamentos(newAviamentos)
  }

  if (loading) {
    return <div className="p-20 text-center animate-pulse">Carregando formulário técnico...</div>
  }

  return (
    <form onSubmit={handleSave} className="max-w-[1000px] mx-auto space-y-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <Link href={`/pecas/${id}`} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[--color-text-tertiary] hover:text-[--color-accent-peca] transition-all group mb-2">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Voltar para Ficha
          </Link>
          <h1 className="text-3xl font-light text-[--color-text-primary] tracking-tight">Preencher Ficha Técnica Completa</h1>
          <p className="text-[14px] text-[--color-text-secondary]">Detalhamento profissional da Peça Piloto {formData.referencia}</p>
        </div>
        <button 
          type="submit" 
          disabled={saving}
          className="btn-premium btn-primary h-12 px-8 shadow-xl shadow-[--color-accent-peca]/10"
        >
          {saving ? 'Salvando...' : <><Save size={18} /> Salvar Ficha Completa</>}
        </button>
      </header>

      {/* Tabs Navigation */}
      <nav className="flex gap-2 p-1.5 bg-gray-100/50 rounded-2xl border border-gray-100">
        <TabButton id="geral" active={activeTab} setActive={setActiveTab} icon={<ClipboardList size={16} />} label="Geral e Equipe" />
        <TabButton id="modelagem" active={activeTab} setActive={setActiveTab} icon={<Scissors size={16} />} label="Modelagem e Fotos" />
        <TabButton id="tecidos" active={activeTab} setActive={setActiveTab} icon={<Package size={16} />} label="Matéria Prima" />
        <TabButton id="aviamentos" active={activeTab} setActive={setActiveTab} icon={<Settings size={16} />} label="Aviamentos" />
        <TabButton id="costura" active={activeTab} setActive={setActiveTab} icon={<User size={16} />} label="Costura e Detalhes" />
      </nav>

      <div className="bg-white border border-[--color-border-light] rounded-[32px] p-8 sm:p-10 shadow-sm min-h-[500px]">
        {/* ABA GERAL */}
        {activeTab === 'geral' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <SectionHeader title="Identificação e Responsáveis" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Nome da Peça">
                <input value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} className="input-premium" />
              </Field>
              <Field label="Coleção">
                <input value={formData.colecao} onChange={e => setFormData({...formData, colecao: e.target.value})} className="input-premium" />
              </Field>
              <Field label="Estilista">
                <input value={formData.estilista} onChange={e => setFormData({...formData, estilista: e.target.value})} className="input-premium" />
              </Field>
              <Field label="Modelista">
                <input value={formData.modelista} onChange={e => setFormData({...formData, modelista: e.target.value})} className="input-premium" />
              </Field>
              <Field label="Pilotista">
                <input value={formData.pilotista} onChange={e => setFormData({...formData, pilotista: e.target.value})} className="input-premium" />
              </Field>
              <Field label="Responsável Corte">
                <input value={formData.responsavelCorte} onChange={e => setFormData({...formData, responsavelCorte: e.target.value})} className="input-premium" />
              </Field>
            </div>
          </div>
        )}

        {/* ABA MODELAGEM */}
        {activeTab === 'modelagem' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <SectionHeader title="Modelagem e Imagens" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <Field label="Grade de Tamanhos (Corte)">
                  <input placeholder="Ex: P, M, G, GG" value={formData.gradeCorte} onChange={e => setFormData({...formData, gradeCorte: e.target.value})} className="input-premium" />
                </Field>
                <Field label="Tamanho da Peça Piloto">
                  <input placeholder="Ex: M" value={formData.tamanhoPiloto} onChange={e => setFormData({...formData, tamanhoPiloto: e.target.value})} className="input-premium" />
                </Field>
              </div>
              <div className="space-y-6">
                <Field label="URL Foto Frente">
                  <div className="flex gap-2">
                    <input value={formData.fotoFrente} onChange={e => setFormData({...formData, fotoFrente: e.target.value})} className="input-premium" placeholder="https://..." />
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 overflow-hidden">
                       {formData.fotoFrente ? <img src={formData.fotoFrente} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-gray-300" />}
                    </div>
                  </div>
                </Field>
                <Field label="URL Foto Verso">
                  <div className="flex gap-2">
                    <input value={formData.fotoVerso} onChange={e => setFormData({...formData, fotoVerso: e.target.value})} className="input-premium" placeholder="https://..." />
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 overflow-hidden">
                       {formData.fotoVerso ? <img src={formData.fotoVerso} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-gray-300" />}
                    </div>
                  </div>
                </Field>
              </div>
            </div>
          </div>
        )}

        {/* ABA TECIDOS */}
        {activeTab === 'tecidos' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <SectionHeader title="Lista de Tecidos / Matéria Prima" />
              <button type="button" onClick={addMaterial} className="flex items-center gap-2 text-[12px] font-bold text-[--color-accent-peca] hover:bg-[--color-accent-peca]/5 px-4 py-2 rounded-full transition-all">
                <Plus size={16} /> Adicionar Tecido
              </button>
            </div>

            <div className="space-y-4">
              {materiais.map((mat, idx) => (
                <div key={idx} className="p-6 bg-gray-50 border border-gray-100 rounded-[24px] relative group overflow-hidden">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <input placeholder="Descrição do Material" value={mat.descricao} onChange={e => updateMaterial(idx, 'descricao', e.target.value)} className="w-full bg-transparent text-[16px] font-bold focus:outline-none mb-4" />
                    </div>
                    <div className="flex justify-end">
                      <button type="button" onClick={() => removeMaterial(idx)} className="p-2 text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <Field label="Nome/Tipo">
                      <input value={mat.nome} onChange={e => updateMaterial(idx, 'nome', e.target.value)} className="input-premium bg-white" />
                    </Field>
                    <Field label="Cor">
                      <input value={mat.cor} onChange={e => updateMaterial(idx, 'cor', e.target.value)} className="input-premium bg-white" />
                    </Field>
                    <Field label="Cod. Fornecedor">
                      <input value={mat.codFornecedor} onChange={e => updateMaterial(idx, 'codFornecedor', e.target.value)} className="input-premium bg-white" />
                    </Field>
                    <Field label="Composição">
                      <input value={mat.composicao} onChange={e => updateMaterial(idx, 'composicao', e.target.value)} className="input-premium bg-white" />
                    </Field>
                    <Field label="Largura">
                      <input value={mat.largura} onChange={e => updateMaterial(idx, 'largura', e.target.value)} className="input-premium bg-white" placeholder="Ex: 1,50m" />
                    </Field>
                    <Field label="Consumo p/ Peça">
                      <input value={mat.consumo} onChange={e => updateMaterial(idx, 'consumo', e.target.value)} className="input-premium bg-white" />
                    </Field>
                  </div>
                </div>
              ))}
              {materiais.length === 0 && <p className="text-center py-10 text-gray-400 italic">Nenhum tecido adicionado.</p>}
            </div>
          </div>
        )}

        {/* ABA AVIAMENTOS */}
        {activeTab === 'aviamentos' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <SectionHeader title="Lista de Aviamentos" />
              <button type="button" onClick={addAviamento} className="flex items-center gap-2 text-[12px] font-bold text-[--color-accent-peca] hover:bg-[--color-accent-peca]/5 px-4 py-2 rounded-full transition-all">
                <Plus size={16} /> Adicionar Aviamento
              </button>
            </div>

            <div className="space-y-4">
              {aviamentos.map((av, idx) => (
                <div key={idx} className="p-6 bg-gray-50 border border-gray-100 rounded-[24px] relative group overflow-hidden">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="sm:col-span-3">
                      <input placeholder="Descrição do Aviamento (Ex: Botão banho ouro)" value={av.descricao} onChange={e => updateAviamento(idx, 'descricao', e.target.value)} className="w-full bg-transparent text-[16px] font-bold focus:outline-none mb-4" />
                    </div>
                    <div className="flex justify-end">
                      <button type="button" onClick={() => removeAviamento(idx)} className="p-2 text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <Field label="Nome">
                      <input value={av.nome} onChange={e => updateAviamento(idx, 'nome', e.target.value)} className="input-premium bg-white" />
                    </Field>
                    <Field label="Medida">
                      <input value={av.medida} onChange={e => updateAviamento(idx, 'medida', e.target.value)} className="input-premium bg-white" />
                    </Field>
                    <Field label="Cor">
                      <input value={av.cor} onChange={e => updateAviamento(idx, 'cor', e.target.value)} className="input-premium bg-white" />
                    </Field>
                    <Field label="Cod. Fornecedor">
                      <input value={av.codFornecedor} onChange={e => updateAviamento(idx, 'codFornecedor', e.target.value)} className="input-premium bg-white" />
                    </Field>
                    <Field label="Composição">
                      <input value={av.composicao} onChange={e => updateAviamento(idx, 'composicao', e.target.value)} className="input-premium bg-white" />
                    </Field>
                    <Field label="Consumo p/ Peça">
                      <input value={av.consumo} onChange={e => updateAviamento(idx, 'consumo', e.target.value)} className="input-premium bg-white" />
                    </Field>
                  </div>
                </div>
              ))}
              {aviamentos.length === 0 && <p className="text-center py-10 text-gray-400 italic">Nenhum aviamento adicionado.</p>}
            </div>
          </div>
        )}

        {/* ABA COSTURA */}
        {activeTab === 'costura' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <SectionHeader title="Especificações de Costura e Acabamento" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Máquina">
                <input value={formData.maquina} onChange={e => setFormData({...formData, maquina: e.target.value})} className="input-premium" placeholder="Ex: Reta Eletrônica" />
              </Field>
              <Field label="Agulha">
                <input value={formData.agulha} onChange={e => setFormData({...formData, agulha: e.target.value})} className="input-premium" placeholder="Ex: 80" />
              </Field>
              <div className="md:col-span-2">
                <Field label="Características de Costura e Acabamento">
                  <textarea value={formData.caracteristicasCostura} onChange={e => setFormData({...formData, caracteristicasCostura: e.target.value})} className="input-premium min-h-[100px] py-4" placeholder="Detalhe como deve ser a costura e o acabamento..." />
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field label="Pontos Críticos de Execução">
                  <textarea value={formData.pontosCriticos} onChange={e => setFormData({...formData, pontosCriticos: e.target.value})} className="input-premium min-h-[100px] py-4 border-red-50 focus:border-red-200" placeholder="Aponte processos que exigem atenção redobrada..." />
                </Field>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  )
}

function TabButton({ id, active, setActive, icon, label }: { id: string, active: string, setActive: (v: string) => void, icon: React.ReactNode, label: string }) {
  const isSelected = active === id
  return (
    <button
      type="button"
      onClick={() => setActive(id)}
      className={`
        flex-1 flex items-center justify-center gap-2 h-11 px-4 
        text-[12px] font-bold rounded-[14px] transition-all duration-300
        ${isSelected 
          ? 'bg-white text-[--color-text-primary] shadow-sm' 
          : 'text-[--color-text-tertiary] hover:text-[--color-text-secondary] hover:bg-white/50'}
      `}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4 mb-2">
      <h2 className="text-[14px] font-bold uppercase tracking-widest text-[--color-text-tertiary]">{title}</h2>
      <div className="flex-1 h-[1px] bg-gray-100" />
    </div>
  )
}
