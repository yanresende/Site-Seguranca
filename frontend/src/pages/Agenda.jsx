import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react';

export default function Agenda() {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());

  // Horários de atendimento (8h às 18h)
  const horarios = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  // Dias da semana (exemplo simplificado)
  const diasSemana = [
    { nome: 'Seg', dia: '23' },
    { nome: 'Ter', dia: '24' },
    { nome: 'Qua', dia: '25' },
    { nome: 'Qui', dia: '26' },
    { nome: 'Sex', dia: '27' },
  ];

  return (
    <div className="space-y-6">
      {/* CABEÇALHO DA AGENDA */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Fevereiro 2026</h1>
          <div className="flex bg-gray-50 rounded-lg p-1">
            <button className="p-2 hover:bg-white hover:shadow-sm rounded-md transition"><ChevronLeft size={20}/></button>
            <button className="p-2 hover:bg-white hover:shadow-sm rounded-md transition"><ChevronRight size={20}/></button>
          </div>
          <button className="text-sm font-medium text-blue-600 px-3">Hoje</button>
        </div>
        
        <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100">
          <Plus size={20} /> Nova Consulta
        </button>
      </div>

      {/* GRID DO CALENDÁRIO */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-6 border-b border-gray-100 bg-gray-50/50">
          <div className="p-4 border-r border-gray-100"></div> {/* Espaço para as horas */}
          {diasSemana.map((d, i) => (
            <div key={i} className="p-4 text-center border-r border-gray-100 last:border-0">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{d.nome}</p>
              <p className={`text-xl font-bold ${d.dia === '25' ? 'text-blue-600' : 'text-gray-700'}`}>{d.dia}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-6 relative h-[600px] overflow-y-auto">
          {/* COLUNA DE HORAS */}
          <div className="col-span-1 border-r border-gray-100 bg-gray-50/30">
            {horarios.map(hora => (
              <div key={hora} className="h-20 border-b border-gray-100 p-2 text-right text-xs font-medium text-gray-400">
                {hora}
              </div>
            ))}
          </div>

          {/* COLUNAS DE DIAS (Exemplo de Consultas Agendadas) */}
          {[1, 2, 3, 4, 5].map(dia => (
            <div key={dia} className="col-span-1 border-r border-gray-100 last:border-0 relative">
              {horarios.map(hora => (
                <div key={hora} className="h-20 border-b border-gray-100 hover:bg-blue-50/30 transition cursor-pointer"></div>
              ))}
              
              {/* EXEMPLO DE CONSULTA MARCADA */}
              {dia === 3 && (
                <AppointmentCard 
                  top="top-[160px]" 
                  height="h-32" 
                  name="Marcos Silva" 
                  type="Retorno" 
                  color="bg-blue-100 border-blue-200 text-blue-700" 
                />
              )}
              {dia === 5 && (
                <AppointmentCard 
                  top="top-[320px]" 
                  height="h-20" 
                  name="Ana Souza" 
                  type="Check-up" 
                  color="bg-green-100 border-green-200 text-green-700" 
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AppointmentCard({ top, height, name, type, color }) {
  return (
    <div className={`absolute left-1 right-1 ${top} ${height} ${color} border rounded-lg p-2 text-xs shadow-sm overflow-hidden z-10 hover:brightness-95 cursor-pointer`}>
      <p className="font-bold truncate">{name}</p>
      <p className="opacity-80 flex items-center gap-1"><Clock size={10}/> {type}</p>
    </div>
  );
}