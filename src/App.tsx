/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Truck, 
  Map as MapIcon, 
  Users, 
  Settings, 
  Bell, 
  Search, 
  Clock, 
  ShieldCheck, 
  Wrench, 
  AlertCircle,
  ChevronRight,
  TrendingUp,
  UserCircle,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type Role = 'Admin' | 'Operador' | 'Técnico';

interface Service {
  id: string;
  type: 'Grúa' | 'Mecánico' | 'Combustible' | 'Cerrajero';
  location: string;
  status: 'En camino' | 'En sitio' | 'Pendiente' | 'Completado';
  priority: 'Baja' | 'Media' | 'Alta';
  time: string;
}

// --- Mock Data ---
const SERVICES: Service[] = [
  { id: 'SRV-001', type: 'Grúa', location: 'Autopista Sur KM 12', status: 'En camino', priority: 'Alta', time: '12 min' },
  { id: 'SRV-002', type: 'Mecánico', location: 'Av. Reforma 450', status: 'En sitio', priority: 'Media', time: '25 min' },
  { id: 'SRV-003', type: 'Combustible', location: 'Calle 50 #12-30', status: 'Pendiente', priority: 'Baja', time: '5 min' },
  { id: 'SRV-004', type: 'Grúa', location: 'Zona Industrial Nte', status: 'En camino', priority: 'Alta', time: '18 min' },
  { id: 'SRV-005', type: 'Cerrajero', location: 'Centro Comercial Plaza', status: 'Completado', priority: 'Baja', time: '1 hr' },
];

const METRICS = {
  servicesToday: 42,
  freeTechnicians: 8,
  avgArrivalTime: '18 min',
  efficiency: '+12%'
};

// --- Components ---

const Sidebar = ({ currentRole, isOpen, setIsOpen }: { currentRole: Role, isOpen: boolean, setIsOpen: (v: boolean) => void }) => {
  const menuItems = useMemo(() => {
    const common = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'map', label: 'Mapa en Vivo', icon: MapIcon },
    ];

    if (currentRole === 'Admin') {
      return [
        ...common,
        { id: 'fleet', label: 'Gestión de Flota', icon: Truck },
        { id: 'users', label: 'Usuarios', icon: Users },
        { id: 'reports', label: 'Reportes Anuales', icon: TrendingUp },
        { id: 'settings', label: 'Configuración', icon: Settings },
      ];
    }

    if (currentRole === 'Operador') {
      return [
        ...common,
        { id: 'dispatch', label: 'Despacho Rápido', icon: ShieldCheck },
        { id: 'active', label: 'Servicios Activos', icon: Clock },
      ];
    }

    // Técnico
    return [
      { id: 'my-jobs', label: 'Mis Asignaciones', icon: Wrench },
      { id: 'map', label: 'Navegación', icon: MapIcon },
      { id: 'alerts', label: 'Avisos', icon: Bell },
    ];
  }, [currentRole]);

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isOpen ? 260 : 0 }}
      className={`fixed lg:relative z-40 h-screen bg-slate-950 text-slate-400 overflow-hidden border-r border-slate-800 transition-all duration-300 ease-in-out`}
    >
      <div className="p-6 flex flex-col h-full w-[260px]">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-yellow-400 p-2 rounded-lg">
            <ShieldCheck className="text-slate-950 w-6 h-6" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight italic">OPTIMAX</span>
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-900 hover:text-yellow-400 transition-all group"
            >
              <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-sm">{item.label}</span>
              {item.id === 'alerts' && (
                <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">3</span>
              )}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-800">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all">
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

const MetricCard = ({ title, value, icon: Icon, trend }: { title: string, value: string | number, icon: any, trend?: string }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50 rounded-2xl">
        <Icon className="w-6 h-6 text-slate-600" />
      </div>
      {trend && (
        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
  </div>
);

const ACTIVE_THEME = {
  'En camino': 'bg-blue-100 text-blue-700',
  'En sitio': 'bg-yellow-100 text-yellow-700',
  'Pendiente': 'bg-slate-100 text-slate-600',
  'Completado': 'bg-green-100 text-green-700',
};

const PRIORITY_COLOR = {
  'Alta': 'text-red-500',
  'Media': 'text-orange-500',
  'Baja': 'text-blue-500',
};

export default function App() {
  const [role, setRole] = useState<Role>('Admin');
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar currentRole={role} isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md border-bottom border-slate-200">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Panel de {role}</h1>
          </div>

          <div className="flex items-center gap-6">
            {/* Role Switcher for Demo */}
            <div className="hidden md:flex bg-slate-100 p-1 rounded-xl gap-1">
              {(['Admin', 'Operador', 'Técnico'] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    role === r ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900">Diego Armando</p>
                <p className="text-[10px] text-slate-500 uppercase font-medium">{role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                <UserCircle className="w-6 h-6 text-slate-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Bienvenido de nuevo, Diego</h2>
              <p className="text-slate-500 mt-1 italic">Optimax protege hoy a +2,400 conductores en red.</p>
            </div>
            <button className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-yellow-400/20 active:scale-95">
              <AlertCircle className="w-5 h-5" />
              Nuevo Incidente
            </button>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard 
              title="Servicios Activos" 
              value={role === 'Técnico' ? 2 : METRICS.servicesToday} 
              icon={LayoutDashboard} 
              trend="+14%" 
            />
            <MetricCard 
              title="Técnicos Disponibles" 
              value={METRICS.freeTechnicians} 
              icon={Users} 
            />
            <MetricCard 
              title="Promedio de Arribo" 
              value={METRICS.avgArrivalTime} 
              icon={Clock} 
              trend="-2 min" 
            />
            <MetricCard 
              title="Satisfacción" 
              value="98.2%" 
              icon={ShieldCheck} 
            />
          </div>

          {/* Main Dashboard Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Map Widget */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden h-full min-h-[400px] flex flex-col">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <MapIcon className="w-5 h-5 text-slate-400" />
                  <h3 className="font-bold text-slate-800">Mapa Georreferenciado</h3>
                </div>
                <div className="flex gap-2">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> Flota Activa
                  </span>
                </div>
              </div>
              <div className="flex-1 bg-slate-900 relative overflow-hidden group">
                {/* Fake Map Grid Background */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
                
                {/* Placeholder Icons for Map */}
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute top-1/3 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"
                />
                
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl">
                    <p className="text-white/60 text-xs font-mono mb-2 uppercase tracking-tighter">Lat: 19.4326 | Lon: -99.1332</p>
                    <p className="text-white font-medium">Ubicación de Unidades en Tiempo Real</p>
                    <p className="text-yellow-400 text-xs mt-1">Sincronizado vía Satélite</p>
                  </div>
                </div>

                {/* Simulated Pins */}
                <div className="absolute top-[40%] right-[30%] bg-blue-500 w-3 h-3 rounded-full border-2 border-white shadow-lg" />
                <div className="absolute bottom-[20%] left-[45%] bg-yellow-400 w-3 h-3 rounded-full border-2 border-slate-900 shadow-lg" />
                <div className="absolute top-[20%] left-[60%] bg-green-500 w-3 h-3 rounded-full border-2 border-white shadow-lg" />
              </div>
            </div>

            {/* Side Panel: Quick Actions/Alerts */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-yellow-400" />
                  Alertas Críticas
                </h3>
                <div className="space-y-4">
                  {[
                    { msg: 'Accidente Múltiple en Km 40', time: 'hace 2m', color: 'bg-red-500' },
                    { msg: 'Falla mecánica: Juan Pérez', time: 'hace 10m', color: 'bg-yellow-500' },
                    { msg: 'Grúa #12 en retorno', time: 'hace 15m', color: 'bg-blue-500' },
                  ].map((alert, i) => (
                    <motion.div 
                      key={i}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700 flex gap-4 items-start"
                    >
                      <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${alert.color}`} />
                      <div>
                        <p className="text-sm font-medium leading-tight">{alert.msg}</p>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">{alert.time}</p>
                      </div>
                    </motion.div>
                  ))};
                </div>
                
                <button className="w-full mt-8 py-3 border border-slate-700 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors">
                  Ver Todas las Alertas
                </button>
              </div>
              {/* Decorative Circle */}
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-yellow-400/10 rounded-full blur-3xl transition-transform group-hover:scale-150" />
            </div>
          </div>

          {/* Services Table */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-800">Servicios Activos</h3>
                <p className="text-xs text-slate-500 mt-0.5 italic">Monitoreo de incidencias en proceso.</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Buscar por ID o Lugar..."
                  className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm w-full md:w-64 focus:ring-2 focus:ring-yellow-400 transition-all outline-none"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID Servicio</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tipo</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ubicación</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Estatus</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Prioridad</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Arribo</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <AnimatePresence mode="popLayout">
                    {SERVICES.map((srv, idx) => (
                      <motion.tr 
                        key={srv.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                      >
                        <td className="px-6 py-4 text-sm font-bold text-slate-900">{srv.id}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {srv.type === 'Grúa' ? <Truck className="w-4 h-4 text-slate-400" /> : <Wrench className="w-4 h-4 text-slate-400" />}
                            <span className="text-sm text-slate-600">{srv.type}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{srv.location}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${ACTIVE_THEME[srv.status]}`}>
                            {srv.status}
                          </span>
                        </td>
                        <td className={`px-6 py-4 text-sm font-bold ${PRIORITY_COLOR[srv.priority]}`}>
                          {srv.priority}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{srv.time}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 hover:bg-white rounded-lg transition-colors group-hover:shadow-sm">
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-slate-50/30 border-t border-slate-50 text-center">
              <button className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors">
                Cargar Más Servicios
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
