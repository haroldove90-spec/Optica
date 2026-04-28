/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
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
  X,
  ShoppingCart,
  Eye,
  CheckCircle2,
  Filter,
  Phone,
  Navigation,
  CreditCard,
  Plus,
  Minus,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type Role = 'Admin' | 'Operador' | 'Técnico';
type View = 'Dashboard' | 'Asistencia' | 'Flota' | 'Optica';

interface Service {
  id: string;
  type: 'Grúa' | 'Cambio de Neumático' | 'Paso de Corriente' | 'Combustible' | 'Cerrajero';
  vehicle: string;
  plate: string;
  location: string;
  status: 'En camino' | 'En sitio' | 'Pendiente' | 'Finalizado';
  priority: 'Baja' | 'Media' | 'Alta';
  time: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface Unit {
  id: string;
  operator: string;
  status: 'Disponible' | 'Ocupado' | 'Fuera de Servicio';
  lastLocation: string;
}

// --- Mock Data ---
const SERVICES: Service[] = [
  { id: 'OX-1021', type: 'Grúa', vehicle: 'Nissan Versa', plate: 'PXV-45-21 (CDMX)', location: 'Periférico Norte, Tlalnepantla', status: 'En camino', priority: 'Alta', time: '12 min' },
  { id: 'OX-1022', type: 'Cambio de Neumático', vehicle: 'VW Jetta', plate: 'MWN-12-89 (EdoMex)', location: 'Circuito Interior, Condesa', status: 'En sitio', priority: 'Media', time: '5 min' },
  { id: 'OX-1023', type: 'Paso de Corriente', vehicle: 'Toyota Hilux', plate: 'GTR-88-10 (N/A)', location: 'Av. Insurgentes Sur 1200', status: 'Pendiente', priority: 'Baja', time: '18 min' },
  { id: 'OX-1024', type: 'Grúa', vehicle: 'Mazda 3', plate: 'ABC-12-34 (CDMX)', location: 'Viaducto Tlalpan', status: 'En camino', priority: 'Alta', time: '22 min' },
  { id: 'OX-1025', type: 'Combustible', vehicle: 'Ford Explorer', plate: 'KLP-09-12 (EdoMex)', location: 'Autopista Méx-Qro KM 32', status: 'Finalizado', priority: 'Baja', time: '1 hr' },
  { id: 'OX-1026', type: 'Cerrajero', vehicle: 'Honda Civic', plate: 'ZXX-55-44 (CDMX)', location: 'Polanco, Av. Horacio', status: 'En sitio', priority: 'Media', time: '15 min' },
  { id: 'OX-1027', type: 'Grúa', vehicle: 'Chevrolet Aveo', plate: 'NML-33-22 (EdoMex)', location: 'Satélite, Torres de Satélite', status: 'Pendiente', priority: 'Alta', time: '30 min' },
  { id: 'OX-1028', type: 'Cambio de Neumático', vehicle: 'Kia Forte', plate: 'TYU-11-99 (CDMX)', location: 'Reforma, Angel de Ind.', status: 'Finalizado', priority: 'Baja', time: '45 min' },
  { id: 'OX-1029', type: 'Paso de Corriente', vehicle: 'Hyundai Accent', plate: 'QWE-77-66 (EdoMex)', location: 'Sta. Fe, Av. Vasco de Q.', status: 'En camino', priority: 'Media', time: '10 min' },
  { id: 'OX-1030', type: 'Grúa', vehicle: 'BMW X5', plate: 'VIP-00-01 (CDMX)', location: 'Lomas de Chapultepec', status: 'En sitio', priority: 'Alta', time: '8 min' },
];

const PRODUCTS: Product[] = [
  { id: 1, name: 'Lentes de Sol Aviador Premium', description: 'Protección UV400, marco de acero inoxidable.', price: 2450, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800' },
  { id: 2, name: 'Armazón Oftálmico Titanium', description: 'Ligero, resistente y diseño minimalista.', price: 3800, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800' },
  { id: 3, name: 'Lentes de Contacto Diarios (30pk)', description: 'Máxima hidratación para ojos sensibles.', price: 1200, image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=800' },
  { id: 4, name: 'Lentes Anti-Blue Light Modern', description: 'Ideal para trabajo prolongado frente a pantallas.', price: 1850, image: 'https://images.unsplash.com/photo-1511499767390-a7335958beba?auto=format&fit=crop&q=80&w=800' },
  { id: 5, name: 'Estuche de Lujo "Optimax Black"', description: 'Protección rígida con acabado en piel sintética.', price: 550, image: 'https://images.unsplash.com/photo-1625591339762-430a30b3564c?auto=format&fit=crop&q=80&w=800' },
];

const UNITS: Unit[] = [
  { id: 'U-01', operator: 'Roberto Sánchez', status: 'Disponible', lastLocation: 'CDMX - Cuauhtémoc' },
  { id: 'U-05', operator: 'Miguel Angel Ruiz', status: 'Ocupado', lastLocation: 'EdoMex - Naucalpan' },
  { id: 'U-12', operator: 'Karla Jimenéz', status: 'Disponible', lastLocation: 'CDMX - Miguel Hidalgo' },
  { id: 'U-08', operator: 'Erik González', status: 'Fuera de Servicio', lastLocation: 'Base Central' },
];

// --- Theme Constants ---
const COLORS = {
  primary: '#00A4AE', // Brand Teal
  primaryDark: '#008b94',
  accent: '#DA6000', // Brand Orange
  warning: '#fbbf24',
  success: '#10b981',
  danger: '#ef4444',
  bg: '#f8fafc',
  sidebarBg: '#00A4AE',
};

// --- Components ---

const Sidebar = ({ 
  currentRole, 
  currentView, 
  setView, 
  isOpen, 
  setIsOpen 
}: { 
  currentRole: Role, 
  currentView: View,
  setView: (v: View) => void,
  isOpen: boolean, 
  setIsOpen: (v: boolean) => void 
}) => {
  const menuItems = useMemo(() => {
    const items = [
      { id: 'Dashboard' as View, label: 'Dashboard', icon: LayoutDashboard },
      { id: 'Asistencia' as View, label: 'Asistencia Vial', icon: AlertCircle },
      { id: 'Flota' as View, label: 'Flota / Proveedores', icon: Truck },
      { id: 'Optica' as View, label: 'Optimax Óptica', icon: Eye },
    ];

    if (currentRole === 'Admin') {
      return [
        ...items,
        { id: 'Reports' as any, label: 'Gestión Usuarios', icon: Users },
        { id: 'Settings' as any, label: 'Configuración', icon: Settings },
      ];
    }
    return items;
  }, [currentRole]);

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <motion.aside 
        initial={false}
        animate={{ 
          x: isOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -280 : 0),
          width: 280 
        }}
        className={`fixed lg:relative z-50 h-screen bg-[#00A4AE] text-white/80 overflow-hidden border-r border-white/10 shadow-2xl transition-all duration-300 ease-in-out lg:translate-x-0 cursor-default`}
      >
        <div className="p-6 flex flex-col h-full w-[280px]">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-xl">
                <img src="https://cossma.com.mx/optimax.png" alt="Optimax Logo" className="h-10 w-auto" />
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 hover:bg-white/10 rounded-full transition-colors text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id in { Dashboard: 1, Asistencia: 1, Flota: 1, Optica: 1 }) {
                    setView(item.id as View);
                    if (window.innerWidth < 1024) setIsOpen(false);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group ${
                  currentView === item.id 
                    ? 'bg-[#DA6000] text-white shadow-lg shadow-black/20' 
                    : 'hover:bg-white/10 hover:text-white text-white/70'
                }`}
              >
                <item.icon className={`w-5 h-5 transition-transform ${currentView === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="font-semibold text-sm">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="pt-6 border-t border-white/10">
            <div className="bg-white/10 p-4 rounded-2xl mb-6 flex items-center gap-3">
              <div className="bg-white p-1 rounded-full">
                <ShieldCheck className="w-4 h-4 text-[#00A4AE]" />
              </div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-white/60">Soporte 24/7 Activo</p>
            </div>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500 hover:text-white transition-all font-bold text-sm text-white/70">
              <LogOut className="w-5 h-5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

const Header = ({ 
  role, 
  setRole, 
  toggleSidebar, 
  cartCount,
  currentView
}: { 
  role: Role, 
  setRole: (r: Role) => void, 
  toggleSidebar: () => void, 
  cartCount: number,
  currentView: string
}) => (
  <header className="sticky top-0 z-30 flex items-center justify-between px-6 lg:px-8 py-4 bg-[#00A4AE] border-b border-white/10 shadow-md">
    <div className="flex items-center gap-4">
      <button 
        onClick={toggleSidebar}
        className="p-2 hover:bg-white/10 rounded-xl transition-colors lg:hidden"
      >
        <Menu className="w-6 h-6 text-white" />
      </button>
      <div className="text-white">
        <h1 className="text-xl font-extrabold tracking-tight leading-none">{currentView}</h1>
        <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest mt-1">Gestión Centralizada</p>
      </div>
    </div>

    <div className="flex items-center gap-4 lg:gap-8">
      {/* Role Switcher */}
      <div className="hidden md:flex bg-white/10 p-1.5 rounded-xl gap-1">
        {(['Admin', 'Operador', 'Técnico'] as Role[]).map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={`px-4 py-1.5 rounded-lg text-[11px] font-black tracking-tight transition-all uppercase ${
              role === r ? 'bg-white text-[#00A4AE] shadow-md' : 'text-white/40 hover:text-white'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4 lg:gap-6 pl-4 lg:pl-8 border-l border-white/10">
        <button className="relative p-2 text-white/70 hover:text-white transition-colors group">
          <ShoppingCart className="w-6 h-6 transition-transform group-hover:scale-110" />
          {cartCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              key={cartCount}
              className="absolute -top-1 -right-1 bg-[#DA6000] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#00A4AE] shadow-sm"
            >
              {cartCount}
            </motion.span>
          )}
        </button>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white">Diego Armando</p>
            <p className="text-[10px] text-white/60 uppercase font-black tracking-tighter">Verified {role}</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center overflow-hidden border border-white/20">
            <UserCircle className="w-7 h-7 text-white" />
          </div>
        </div>
      </div>
    </div>
  </header>
);

const SectionHeader = ({ title, subtitle, action }: { title: string, subtitle: string, action?: React.ReactNode }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
    <div>
      <h2 className="text-3xl font-black tracking-tight text-slate-900 drop-shadow-sm">{title}</h2>
      <p className="text-slate-500 mt-1 font-medium italic">{subtitle}</p>
    </div>
    {action}
  </div>
);

export default function App() {
  const [role, setRole] = useState<Role>('Admin');
  const [view, setView] = useState<View>('Dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const filteredServices = useMemo(() => {
    return SERVICES.filter(s => 
      s.plate.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const addToCart = (product: string) => {
    setCartCount(prev => prev + 1);
    setToast(`¡${product} añadido al carrito!`);
  };

  const renderContent = () => {
    switch (view) {
      case 'Dashboard':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHeader 
              title="Panel Principal" 
              subtitle="Monitoreo de rendimiento y métricas operativas diarias." 
              action={
                <button className="flex items-center gap-2 bg-[#DA6000] hover:bg-[#c55600] text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-orange-900/20 active:scale-95 group">
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                  Nueva Asignación
                </button>
              }
            />

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Servicios Activos', value: '8', icon: AlertCircle, color: 'text-[#00A4AE]', bg: 'bg-[#00A4AE]/10', trend: '+2 hoy' },
                { label: 'Ingresos del Día', value: '$12,500', icon: CreditCard, color: 'text-green-600', bg: 'bg-green-100', trend: '$ MXN' },
                { label: 'Alertas de Flota', value: '2', icon: Bell, color: 'text-red-600', bg: 'bg-red-100', trend: 'Críticas' },
                { label: 'SLA Promedio', value: '18 min', icon: Clock, color: 'text-[#DA6000]', bg: 'bg-[#DA6000]/10', trend: '-2% vs ayer' },
              ].map((m, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 ${m.bg} rounded-2xl`}>
                      <m.icon className={`w-6 h-6 ${m.color}`} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.trend}</span>
                  </div>
                  <h3 className="text-slate-500 text-xs font-bold uppercase tracking-tight mb-1">{m.label}</h3>
                  <p className="text-3xl font-black text-slate-900">{m.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Dashboard Visuals */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 flex flex-col h-[500px]">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                      <Navigation className="w-5 h-5 text-[#00A4AE]" />
                    </div>
                    <h3 className="text-lg font-black text-slate-800">Mapa Satelital de Operaciones</h3>
                  </div>
                  <div className="flex bg-slate-50 p-1 rounded-xl">
                    <button className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-white shadow-sm text-[#00A4AE]">TODO</button>
                    <button className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-400">FILTRAR</button>
                  </div>
                </div>
                <div className="flex-1 bg-slate-950 rounded-[28px] relative overflow-hidden group">
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }} 
                      transition={{ duration: 4, repeat: Infinity }}
                      className="w-48 h-48 bg-[#00A4AE]/20 rounded-full blur-[80px]" 
                    />
                    <div className="relative z-10">
                      <p className="text-[#00A4AE] font-mono text-[10px] uppercase tracking-[0.3em] mb-4">Live Tracking v4.2</p>
                      <h4 className="text-white text-xl font-black mb-2 italic">Ciudad de México & Zona Metrop.</h4>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#00A4AE] rounded-[32px] p-8 text-white relative overflow-hidden flex flex-col justify-between group">
                <div className="relative z-10">
                  <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-white/50" />
                    Proyección de Servicios
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-tight">
                        <span className="text-white/70">Grúas (Especializadas)</span>
                        <span className="text-white">88%</span>
                      </div>
                      <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: '88%' }} className="h-full bg-[#DA6000]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-tight">
                        <span className="text-white/70">Mecánica menor</span>
                        <span className="text-white">64%</span>
                      </div>
                      <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: '64%' }} className="h-full bg-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Asistencia':
        return (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <SectionHeader 
              title="Asistencia Vial" 
              subtitle="Control total sobre las incidencias en curso."
              action={
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Placa, Tipo, Ubicación..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-11 pr-6 py-4 bg-white border border-slate-200 rounded-[24px] text-sm w-full md:w-80 focus:ring-4 focus:ring-[#00A4AE]/10 shadow-sm focus:border-[#00A4AE] transition-all outline-none"
                    />
                  </div>
                  <button className="p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm">
                    <Filter className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              }
            />

            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Servicio / Placa</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vehículo</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ubicación</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Estatus</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Arribo</th>
                      <th className="px-8 py-5"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <AnimatePresence mode="popLayout">
                      {filteredServices.map((srv, idx) => (
                        <motion.tr 
                          key={srv.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          className="hover:bg-slate-50/50 transition-colors group"
                        >
                          <td className="px-8 py-6">
                            <div className="flex flex-col">
                              <span className="text-sm font-black text-[#00A4AE] tracking-tight">{srv.id}</span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{srv.plate}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <button className="p-3 bg-white border border-slate-100 rounded-2xl hover:border-[#DA6000] hover:text-[#DA6000] transition-all shadow-sm">
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'Flota':
          return (
            <div className="animate-in slide-in-from-right-4 duration-500">
               <SectionHeader 
                  title="Flota y Proveedores" 
                  subtitle="Monitoreo de unidades y disponibilidad de operadores."
                />
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {UNITS.map((unit, i) => (
                    <motion.div 
                      key={unit.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden"
                    >
                      <button className="w-full mt-6 py-3 bg-[#DA6000] text-white hover:bg-[#c55600] rounded-2xl text-xs font-black transition-all uppercase tracking-tighter">
                        Ver Historial
                      </button>
                    </motion.div>
                  ))}
                </div>
            </div>
          );

      case 'Optica':
        return (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <SectionHeader 
              title="Optimax Óptica" 
              subtitle="Protección visual de alta gama para nuestros conductores y red de socios."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {PRODUCTS.map((p) => (
                <div key={p.id} className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm flex flex-col group p-8">
                  <div className="h-48 overflow-hidden rounded-2xl mb-6">
                    <img src={p.image} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-black text-slate-900 mb-2">{p.name}</h4>
                  <button 
                    onClick={() => addToCart(p.name)}
                    className="w-full bg-[#DA6000] hover:bg-[#c55600] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all mt-auto"
                  >
                    <Plus className="w-5 h-5" />
                    Añadir al Carrito
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <div>Seleccione una opción del menú.</div>;
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans selection:bg-blue-100 selection:text-[#00A4AE] overflow-hidden">
      <Sidebar 
        currentRole={role} 
        currentView={view}
        setView={setView}
        isOpen={isSidebarOpen} 
        setIsOpen={setSidebarOpen} 
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header 
          role={role} 
          setRole={setRole} 
          toggleSidebar={() => setSidebarOpen(true)} 
          cartCount={cartCount}
          currentView={view}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden relative p-4 md:p-8 lg:p-12">
          <div className="max-w-7xl mx-auto w-full pb-20">
            {renderContent()}
          </div>
          
          <AnimatePresence>
            {toast && (
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-[#00A4AE] text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4"
              >
                <p className="text-sm font-bold tracking-tight">{toast}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

