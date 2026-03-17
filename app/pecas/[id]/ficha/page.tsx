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
  referencia: string
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
  referencia: string
  descricao: string
  nome: string
  medida: string
  cor: string
  codFornecedor: string
  composicao: string
  consumo: string
}

interface Equipamento {
  id?: string
  maquina: string
  agulha: string
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
    oficina: '',
    tamanhoPiloto: '',
    gradeCorte: '',
    fotoFrente: '',
    fotoVerso: '',
    caracteristicasCostura: '',
    pontosCriticos: '',
    maquina: '',
    agulha: '',
    observacoesGerais: '',
  })

  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([])

  const [uploading, setUploading] = useState<{ frente: boolean, verso: boolean }>({ frente: false, verso: false })

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, lado: 'frente' | 'verso') => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(prev => ({ ...prev, [lado]: true }))
    
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      })

      const result = await response.json()

      if (response.ok) {
        setFormData(prev => ({ ...prev, [lado === 'frente' ? 'fotoFrente' : 'fotoVerso']: result.url }))
        showToast({ title: 'Sucesso', description: 'Imagem enviada com sucesso!' })
      } else {
        showToast({ title: 'Erro', description: result.error || 'Erro no upload', variant: 'destructive' })
      }
    } catch (error) {
      console.error('Erro no upload:', error)
      showToast({ title: 'Erro', description: 'Falha ao enviar arquivo', variant: 'destructive' })
    } finally {
      setUploading(prev => ({ ...prev, [lado]: false }))
    }
  }

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
            oficina: data.oficina || '',
            tamanhoPiloto: data.tamanhoPiloto || '',
            gradeCorte: data.gradeCorte || '',
            fotoFrente: data.fotoFrente || '',
            fotoVerso: data.fotoVerso || '',
            caracteristicasCostura: data.caracteristicasCostura || '',
            pontosCriticos: data.pontosCriticos || '',
            maquina: data.maquina || '',
            agulha: data.agulha || '',
            observacoesGerais: data.observacoesGerais || '',
          })
          setMateriais(data.materiais || [])
          setAviamentos(data.aviamentos || [])
          setEquipamentos(data.equipamentos || [])
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
          aviamentos,
          equipamentos
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
    setMateriais([...materiais, { referencia: '', descricao: '', nome: '', cor: '', codFornecedor: '', composicao: '', largura: '', consumo: '' }])
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
    setAviamentos([...aviamentos, { referencia: '', descricao: '', nome: '', medida: '', cor: '', codFornecedor: '', composicao: '', consumo: '' }])
  }

  const removeAviamento = (index: number) => {
    setAviamentos(aviamentos.filter((_, i) => i !== index))
  }

  const updateAviamento = (index: number, field: keyof Aviamento, value: string) => {
    const newAviamentos = [...aviamentos]
    newAviamentos[index] = { ...newAviamentos[index], [field]: value }
    setAviamentos(newAviamentos)
  }

  const addEquipamento = () => {
    setEquipamentos([...equipamentos, { maquina: '', agulha: '' }])
  }

  const removeEquipamento = (index: number) => {
    setEquipamentos(equipamentos.filter((_, i) => i !== index))
  }

  const updateEquipamento = (index: number, field: keyof Equipamento, value: string) => {
    const newEquipamentos = [...equipamentos]
    newEquipamentos[index] = { ...newEquipamentos[index], [field]: value }
    setEquipamentos(newEquipamentos)
  }

  if (loading) {
    return <div className="p-20 text-center animate-pulse">Carregando formulário técnico...</div>
  }

  const inputClass = "w-full h-11 px-4 bg-white border border-[--color-border-light] rounded-[16px] text-[15px] font-medium text-[--color-text-primary] placeholder:text-[--color-text-tertiary] focus:outline-none focus:border-[--color-accent] focus:ring-4 focus:ring-[--color-accent]/5 transition-all duration-200"
  const monoClass = "font-mono text-[13px] tracking-tight"

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
          <div className="space-y-10 animate-in fade-in duration-500">
            <SectionHeader title="Identificação da Peça" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Field label="Nome da Peça">
                <input 
                  value={formData.nome} 
                  onChange={e => setFormData({...formData, nome: e.target.value})} 
                  className={inputClass}
                  placeholder="Ex: Blusa Crepe Alcinha"
                />
              </Field>
              <Field label="Referência">
                <input 
                  value={formData.referencia} 
                  onChange={e => setFormData({...formData, referencia: e.target.value})} 
                  className={`${inputClass} ${monoClass} font-bold`}
                  placeholder="Ex: PP-2026-0001"
                />
              </Field>
              <Field label="Coleção">
                <input 
                  value={formData.colecao} 
                  onChange={e => setFormData({...formData, colecao: e.target.value})} 
                  className={inputClass}
                  placeholder="Ex: Inverno 2026"
                />
              </Field>
            </div>

            <SectionHeader title="Equipe de Desenvolvimento" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Field label="Estilista">
                <input value={formData.estilista} onChange={e => setFormData({...formData, estilista: e.target.value})} className={inputClass} placeholder="Nome do estilista" />
              </Field>
              <Field label="Modelista">
                <input value={formData.modelista} onChange={e => setFormData({...formData, modelista: e.target.value})} className={inputClass} placeholder="Nome da modelista" />
              </Field>
              <Field label="Pilotista">
                <input value={formData.pilotista} onChange={e => setFormData({...formData, pilotista: e.target.value})} className={inputClass} placeholder="Nome da pilotista" />
              </Field>
              <Field label="Responsável Corte">
                <input value={formData.responsavelCorte} onChange={e => setFormData({...formData, responsavelCorte: e.target.value})} className={inputClass} placeholder="Nome do cortador" />
              </Field>
            </div>
          </div>
        )}

        {/* ABA MODELAGEM */}
        {activeTab === 'modelagem' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <SectionHeader title="Referências Visuais" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Field label="Frente (ou Desenho Técnico)" hint="Clique abaixo para fazer upload">
                <div className="space-y-4">
                  <div className="relative group cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={e => handleUpload(e, 'frente')} 
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      disabled={uploading.frente}
                    />
                    <div className={`aspect-[4/5] w-full bg-gray-50 rounded-[28px] flex items-center justify-center border-2 border-dashed overflow-hidden transition-all shadow-inner 
                      ${uploading.frente ? 'border-[--color-accent] animate-pulse' : 'border-gray-200 group-hover:border-[--color-accent]/30 group-hover:bg-gray-100/50'}`}>
                       {uploading.frente ? (
                         <div className="text-center">
                           <div className="w-8 h-8 border-4 border-[--color-accent]/30 border-t-[--color-accent] rounded-full animate-spin mx-auto mb-2" />
                           <p className="text-[10px] font-bold uppercase text-[--color-accent]">Enviando...</p>
                         </div>
                       ) : formData.fotoFrente ? (
                         <img src={formData.fotoFrente} className="w-full h-full object-contain p-4" />
                       ) : (
                         <div className="text-center opacity-30">
                           <ImageIcon size={48} className="mx-auto mb-2 text-gray-400" />
                           <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Clique para Upload</p>
                         </div>
                       )}
                    </div>
                  </div>
                  <input 
                    value={formData.fotoFrente} 
                    onChange={e => setFormData({...formData, fotoFrente: e.target.value})} 
                    className={`${inputClass} text-[11px] opacity-50 focus:opacity-100`} 
                    placeholder="Ou cole a URL da imagem aqui..." 
                  />
                </div>
              </Field>

              <Field label="Verso (ou Desenho Técnico)" hint="Clique abaixo para fazer upload">
                <div className="space-y-4">
                  <div className="relative group cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={e => handleUpload(e, 'verso')} 
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      disabled={uploading.verso}
                    />
                    <div className={`aspect-[4/5] w-full bg-gray-50 rounded-[28px] flex items-center justify-center border-2 border-dashed overflow-hidden transition-all shadow-inner 
                      ${uploading.verso ? 'border-[--color-accent] animate-pulse' : 'border-gray-200 group-hover:border-[--color-accent]/30 group-hover:bg-gray-100/50'}`}>
                       {uploading.verso ? (
                         <div className="text-center">
                           <div className="w-8 h-8 border-4 border-[--color-accent]/30 border-t-[--color-accent] rounded-full animate-spin mx-auto mb-2" />
                           <p className="text-[10px] font-bold uppercase text-[--color-accent]">Enviando...</p>
                         </div>
                       ) : formData.fotoVerso ? (
                         <img src={formData.fotoVerso} className="w-full h-full object-contain p-4" />
                       ) : (
                         <div className="text-center opacity-30">
                           <ImageIcon size={48} className="mx-auto mb-2 text-gray-400" />
                           <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Clique para Upload</p>
                         </div>
                       )}
                    </div>
                  </div>
                  <input 
                    value={formData.fotoVerso} 
                    onChange={e => setFormData({...formData, fotoVerso: e.target.value})} 
                    className={`${inputClass} text-[11px] opacity-50 focus:opacity-100`} 
                    placeholder="Ou cole a URL da imagem aqui..." 
                  />
                </div>
              </Field>
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

            <div className="space-y-6">
              {materiais.map((mat, idx) => (
                <div key={idx} className="p-8 bg-white border border-gray-100 rounded-[32px] shadow-sm relative group animate-in slide-in-from-right-4 duration-500">
                  <button type="button" onClick={() => removeMaterial(idx)} className="absolute top-8 right-8 text-red-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={20} /></button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                    <div className="md:col-span-1">
                      <Field label="REF">
                        <input value={mat.referencia} onChange={e => updateMaterial(idx, 'referencia', e.target.value)} className={inputClass} placeholder="Ex: TEC-001" />
                      </Field>
                    </div>
                    <div className="md:col-span-2">
                       <Field label="Nome/Tipo">
                        <input value={mat.nome} onChange={e => updateMaterial(idx, 'nome', e.target.value)} className={inputClass} placeholder="Ex: Fluity" />
                      </Field>
                    </div>

                    <Field label="Cor">
                      <input value={mat.cor} onChange={e => updateMaterial(idx, 'cor', e.target.value)} className={inputClass} placeholder="Ex: Azul Marinho" />
                    </Field>
                    <Field label="Cod. Fornecedor">
                      <input value={mat.codFornecedor} onChange={e => updateMaterial(idx, 'codFornecedor', e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Composição">
                      <input value={mat.composicao} onChange={e => updateMaterial(idx, 'composicao', e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Largura">
                      <input value={mat.largura} onChange={e => updateMaterial(idx, 'largura', e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Consumo p/ Peça">
                      <input value={mat.consumo} onChange={e => updateMaterial(idx, 'consumo', e.target.value)} className={inputClass} />
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

            <div className="space-y-6">
              {aviamentos.map((av, idx) => (
                <div key={idx} className="p-8 bg-white border border-gray-100 rounded-[32px] shadow-sm relative group animate-in slide-in-from-right-4 duration-500">
                  <button type="button" onClick={() => removeAviamento(idx)} className="absolute top-8 right-8 text-red-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={20} /></button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                    <div className="md:col-span-1">
                      <Field label="REF">
                        <input value={av.referencia} onChange={e => updateAviamento(idx, 'referencia', e.target.value)} className={inputClass} placeholder="Ex: AVI-01" />
                      </Field>
                    </div>
                    <div className="md:col-span-2">
                      <Field label="Nome / Marca">
                        <input value={av.nome} onChange={e => updateAviamento(idx, 'nome', e.target.value)} className={inputClass} placeholder="Ex: YKK" />
                      </Field>
                    </div>

                    <Field label="Medida">
                      <input value={av.medida} onChange={e => updateAviamento(idx, 'medida', e.target.value)} className={inputClass} placeholder="Ex: 15cm" />
                    </Field>
                    <Field label="Cor">
                      <input value={av.cor} onChange={e => updateAviamento(idx, 'cor', e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Cod. Fornecedor">
                      <input value={av.codFornecedor} onChange={e => updateAviamento(idx, 'codFornecedor', e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Composição">
                      <input value={av.composicao} onChange={e => updateAviamento(idx, 'composicao', e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Consumo p/ Peça">
                      <input value={av.consumo} onChange={e => updateAviamento(idx, 'consumo', e.target.value)} className={inputClass} />
                    </Field>
                  </div>
                </div>
              ))}
              {aviamentos.length === 0 && <p className="text-center py-10 text-gray-400 italic">Nenhum aviamento adicionado.</p>}
            </div>
          </div>
        )}

        {activeTab === 'costura' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <SectionHeader title="Especificações de Máquinas e Agulhas" />
              <button type="button" onClick={addEquipamento} className="flex items-center gap-2 text-[12px] font-bold text-[--color-accent-peca] hover:bg-[--color-accent-peca]/5 px-4 py-2 rounded-full transition-all">
                <Plus size={16} /> Adicionar Máquina
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {equipamentos.map((eq, idx) => (
                <div key={idx} className="flex items-end gap-3 p-4 bg-gray-50/50 border border-gray-100 rounded-2xl relative group">
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <Field label="Máquina">
                      <input value={eq.maquina} onChange={e => updateEquipamento(idx, 'maquina', e.target.value)} className={inputClass} placeholder="Ex: Reta" />
                    </Field>
                    <Field label="Agulha">
                      <input value={eq.agulha} onChange={e => updateEquipamento(idx, 'agulha', e.target.value)} className={inputClass} placeholder="Ex: 80" />
                    </Field>
                  </div>
                  <button type="button" onClick={() => removeEquipamento(idx)} className="mb-1 p-2 text-red-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {equipamentos.length === 0 && <p className="col-span-2 text-center py-6 text-gray-400 italic text-sm">Nenhuma máquina específica adicionada.</p>}
            </div>

            <SectionHeader title="Processos e Detalhes" />
            <div className="grid grid-cols-1 gap-8">
              <Field label="Características de Costura e Acabamento">
                <textarea 
                  value={formData.caracteristicasCostura} 
                  onChange={e => setFormData({...formData, caracteristicasCostura: e.target.value})} 
                  className={`${inputClass} min-h-[120px] py-4 leading-relaxed resize-none`} 
                  placeholder="Detalhe como deve ser a costura e o acabamento da peça..." 
                />
              </Field>

              <Field label="Pontos Críticos de Execução">
                <textarea 
                  value={formData.pontosCriticos} 
                  onChange={e => setFormData({...formData, pontosCriticos: e.target.value})} 
                  className={`${inputClass} min-h-[100px] py-4 leading-relaxed resize-none bg-red-50/10 border-red-100 focus:border-red-300 focus:ring-red-500/5 text-red-900 placeholder:text-red-300`} 
                  placeholder="Aponte processos que exigem atenção redobrada durante a fabricação..." 
                />
              </Field>

              <Field label="Observações Gerais e Adicionais">
                <textarea 
                  value={formData.observacoesGerais} 
                  onChange={e => setFormData({...formData, observacoesGerais: e.target.value})} 
                  className={`${inputClass} min-h-[160px] py-4 leading-relaxed resize-none bg-gray-50/30`} 
                  placeholder="Instruções gerais sobre a fabricação, embalagem ou qualquer detalhe extra..." 
                />
              </Field>
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
