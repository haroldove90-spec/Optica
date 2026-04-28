/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  ShoppingBag, 
  Settings, 
  Search, 
  Bell, 
  UserCircle, 
  LogOut, 
  Menu, 
  X, 
  ShoppingCart, 
  Eye, 
  Calendar, 
  TrendingUp, 
  Plus, 
  Filter, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  PackageCheck,
  CreditCard,
  UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type View = 'Dashboard' | 'Expedientes' | 'Tienda' | 'Configuracion';

interface Patient {
  id: string;
  name: string;
  lastExam: string;
  od: string; // Right Eye
  oi: string; // Left Eye
  status: 'Activo' | 'Seguimiento';
}

interface Product {
  id: number;
  name: string;
  category: 'Sol' | 'Armazones' | 'Lentes de Contacto';
  price: number;
  image: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

// --- Mock Data ---
const PATIENTS: Patient[] = [
  { id: 'P-001', name: 'Laura Martínez', lastExam: '2024-03-15', od: '-2.50', oi: '-2.25', status: 'Activo' },
  { id: 'P-002', name: 'Carlos Ruiz', lastExam: '2024-04-10', od: '+1.00', oi: '+1.25', status: 'Seguimiento' },
  { id: 'P-003', name: 'Sofía Guevara', lastExam: '2024-02-28', od: '-1.75', oi: '-1.75', status: 'Activo' },
  { id: 'P-004', name: 'Roberto Gómez', lastExam: '2024-04-20', od: '-0.50', oi: '-0.75', status: 'Activo' },
  { id: 'P-005', name: 'Elena Torres', lastExam: '2023-11-12', od: '-3.00', oi: '-3.00', status: 'Seguimiento' },
];

const PRODUCTS: Product[] = [
  { id: 1, name: 'Ray-Ban Classic Aviator', category: 'Sol', price: 3450, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600' },
  { id: 2, name: 'Oakley Holbrook Prizm', category: 'Sol', price: 2900, image: 'https://images.unsplash.com/photo-1511499767390-a7335958beba?auto=format&fit=crop&q=80&w=600' },
  { id: 3, name: 'Armazón Giorgio Armani Titanium', category: 'Armazones', price: 5800, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=600' },
  { id: 4, name: 'Lentes de Contacto Acuvue Moist', category: 'Lentes de Contacto', price: 950, image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=600' },
  { id: 5, name: 'Prada Cinema Eyewear', category: 'Sol', price: 4200, image: 'https://images.unsplash.com/photo-1625591339762-430a30b3564c?auto=format&fit=crop&q=80&w=600' },
  { id: 6, name: 'Armazón Minimalista Silhoutte', category: 'Armazones', price: 6100, image: 'https://images.unsplash.com/photo-1511499767390-a7335958beba?auto=format&fit=crop&q=80&w=600' },
];

// --- Theme Colors ---
const COLORS = {
  primary: '#004b93', // Corporate Blue
  secondary: '#DA6000', // Acento Naranja
  bg: '#f8fafc',
  white: '#ffffff',
  slate: '#64748b',
};

// --- Components ---

const Sidebar = ({ currentView, setView, isOpen, setIsOpen }: { 
  currentView: View, setView: (v: View) => void, isOpen: boolean, setIsOpen: (o: boolean) => void 
}) => {
  const menuItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'Expedientes', label: 'Expediente Clínico', icon: ClipboardList },
    { id: 'Tienda', label: 'Tienda / eCommerce', icon: ShoppingBag },
    { id: 'Configuracion', label: 'Configuración', icon: Settings },
  ] as const;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <motion.aside 
        initial={false}
        animate={{ 
          x: isOpen ? 0 : -280,
          width: 280 
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed lg:relative z-50 h-screen bg-[#004b93] text-white flex flex-col shadow-2xl lg:translate-x-0"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-10">
            <div className="bg-white p-2 rounded-xl shadow-inner">
              <img src="https://cossma.com.mx/optimax.png" alt="Optimax Logo" className="h-8 w-auto px-1" />
            </div>
            <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id);
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group ${
                  currentView === item.id 
                    ? 'bg-white text-[#004b93] shadow-lg font-bold' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 transition-transform ${currentView === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-4">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <p className="text-[10px] uppercase font-black tracking-widest text-[#DA6000] mb-1">Plan Premium</p>
            <p className="text-xs text-white/60">Renovación en 15 días</p>
          </div>
          <button className="flex items-center gap-3 px-4 py-3 w-full text-white/70 hover:text-white transition-colors text-sm font-semibold">
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </motion.aside>
    </>
  );
};

const Header = ({ 
  toggleSidebar, 
  cartCount, 
  title 
}: { 
  toggleSidebar: () => void, 
  cartCount: number, 
  title: string 
}) => (
  <header className="sticky top-0 z-30 flex items-center justify-between px-6 lg:px-10 py-5 bg-white border-b border-slate-200 shadow-sm">
    <div className="flex items-center gap-4">
      <button onClick={toggleSidebar} className="p-2 hover:bg-slate-100 rounded-xl transition-colors lg:hidden">
        <Menu className="w-6 h-6 text-slate-600" />
      </button>
      <div>
        <h1 className="text-lg font-black text-slate-800 tracking-tight leading-none">{title}</h1>
        <p className="text-[10px] font-bold text-[#004b93] uppercase tracking-[0.2em] mt-1.5">Optimax System v1.0</p>
      </div>
    </div>

    <div className="flex items-center gap-6">
      <div className="hidden md:flex relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Buscar paciente o producto..." 
          className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#004b93]/10 focus:border-[#004b93] transition-all outline-none w-64"
        />
      </div>

      <div className="flex items-center gap-2 lg:gap-4 pl-4 lg:pl-6 border-l border-slate-200">
        <button className="relative p-2.5 bg-slate-50 text-slate-600 hover:text-[#004b93] rounded-xl transition-all shadow-xs group">
          <ShoppingCart className="w-5.5 h-5.5 group-hover:scale-110 transition-transform" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#DA6000] text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-in zoom-in">
              {cartCount}
            </span>
          )}
        </button>
        
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-[#004b93] text-white flex items-center justify-center font-black group-hover:bg-[#DA6000] transition-colors shadow-lg">
            H
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-sm font-black text-slate-800">Harold Optik</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Administrador</p>
          </div>
        </div>
      </div>
    </div>
  </header>
);

const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string, key?: React.Key }) => (
  <div className={`bg-white rounded-[24px] border border-slate-200 shadow-sm p-6 ${className}`}>
    {children}
  </div>
);

export default function App() {
  const [view, setView] = useState<View>('Dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
    setToast(`¡${product.name} añadido!`);
  };

  const renderContent = () => {
    switch (view) {
      case 'Dashboard':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header section in dashboard */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Bienvenido, Harold</h2>
                <p className="text-slate-500 font-medium">Este es el resumen de tu óptica hoy, {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}.</p>
              </div>
              <button className="flex items-center gap-2 bg-[#DA6000] text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-[#c55600] transition-all shadow-xl shadow-[#DA6000]/20 active:scale-95 group">
                <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Registrar Cita
              </button>
            </div>

            {/* Main Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Citas Hoy', value: '12', sub: '3 pendientes', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Ventas Totales', value: '$45,210', sub: '+15% vs ayer', icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Pedidos Listos', value: '8', sub: 'Por entregar', icon: PackageCheck, color: 'text-orange-600', bg: 'bg-orange-50' },
                { label: 'Nuevos Pacientes', value: '5', sub: '+2 este mes', icon: UserPlus, color: 'text-purple-600', bg: 'bg-purple-50' },
              ].map((m, i) => (
                <Card key={i} className="hover:border-[#004b93]/30 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 ${m.bg} rounded-2xl transition-transform group-hover:scale-110`}>
                      <m.icon className={`w-6 h-6 ${m.color}`} />
                    </div>
                    < TrendingUp className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="text-xs font-black uppercase text-slate-400 tracking-widest mb-1">{m.label}</p>
                  <p className="text-2xl font-black text-slate-900">{m.value}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase mt-2">{m.sub}</p>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activity / Appointments */}
              <div className="lg:col-span-2">
                <Card>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-slate-900">Agenda de Citas</h3>
                    <button className="text-xs font-bold text-[#004b93] hover:underline uppercase">Ver Calendario</button>
                  </div>
                  <div className="space-y-4">
                    {[
                      {time: '14:30', name: 'Laura Martínez', type: 'Examen de la vista', status: 'En espera'},
                      {time: '15:15', name: 'Carlos Ruiz', type: 'Entrega de armazones', status: 'Programado'},
                      {time: '16:00', name: 'Sofía Guevara', type: 'Ajuste de lentes', status: 'Programado'},
                    ].map((app, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-[#004b93]/20 transition-all">
                        <div className="bg-white px-3 py-2 rounded-xl text-[#004b93] font-black text-sm shadow-sm border border-slate-100">
                          {app.time}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-black text-slate-800">{app.name}</p>
                          <p className="text-xs text-slate-500 font-medium">{app.type}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${app.status === 'En espera' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-[#004b93]'}`}>
                          {app.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Status / Stock Alert */}
              <Card className="bg-[#004b93] text-white border-0 shadow-xl shadow-[#004b93]/20 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                <h3 className="text-lg font-black mb-6 flex items-center gap-2 relative z-10">
                  <PackageCheck className="w-5 h-5 text-[#DA6000]" />
                  Alertas de Stock
                </h3>
                <div className="space-y-6 relative z-10">
                  <div>
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-tighter mb-2">
                      <span>Líquidos de Limpieza</span>
                      <span className="text-[#DA6000]">Bajo (12%)</span>
                    </div>
                    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-[#DA6000] w-[12%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-tighter mb-2">
                      <span>Armazones Eco-Lite</span>
                      <span>Crítico (5%)</span>
                    </div>
                    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-red-400 w-[5%]" />
                    </div>
                  </div>
                  <button className="w-full mt-4 py-3 bg-white text-[#004b93] font-black text-xs uppercase rounded-xl hover:bg-slate-100 transition-all shadow-lg active:scale-95">
                    Hacer Pedido
                  </button>
                </div>
              </Card>
            </div>
          </div>
        );

      case 'Expedientes':
        return (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Expedientes Clínicos</h2>
                <p className="text-slate-500 font-medium">Historial completo de graduaciones y exámenes.</p>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <input 
                  type="text" 
                  placeholder="Buscar paciente..." 
                  className="flex-1 md:w-64 px-4 py-3.5 bg-white border border-slate-200 rounded-[20px] text-sm focus:ring-4 focus:ring-[#004b93]/5 outline-none shadow-sm" 
                />
                <button className="p-4 bg-white border border-slate-200 rounded-[20px] hover:bg-slate-50 shadow-sm transition-all text-[#004b93]">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>

            <Card className="overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Paciente</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Último Examen</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">OD (Der)</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">OI (Izq)</th>
                      <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Estatus</th>
                      <th className="px-8 py-5"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {PATIENTS.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-6">
                          <div>
                            <p className="text-sm font-black text-slate-800">{p.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{p.id}</p>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-sm text-slate-600 font-medium">{p.lastExam}</td>
                        <td className="px-8 py-6 text-center">
                          <span className="font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-bold">{p.od}</span>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className="font-mono bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-xs font-bold">{p.oi}</span>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${p.status === 'Activo' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button className="p-2.5 rounded-xl hover:bg-white hover:shadow-md transition-all text-slate-400 hover:text-[#004b93]">
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        );

      case 'Tienda':
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Catálogo de Productos</h2>
                <p className="text-slate-500 font-medium">Lentes de sol, armazones y accesorios de marca.</p>
              </div>
              <div className="flex gap-4 p-1 bg-slate-100 rounded-2xl">
                {['Todos', 'Sol', 'Armazones', 'Accesorios'].map(cat => (
                  <button key={cat} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${cat === 'Todos' ? 'bg-white text-[#004b93] shadow-sm' : 'text-slate-500 hover:text-[#004b93]'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {PRODUCTS.map((p) => (
                <div key={p.id} className="bg-white rounded-[32px] overflow-hidden border border-slate-200 shadow-sm flex flex-col group p-6 hover:shadow-xl hover:border-[#004b93]/20 transition-all">
                  <div className="relative h-56 rounded-2xl overflow-hidden mb-6 bg-slate-50">
                    <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 shadow-sm">
                      <p className="text-[10px] font-black text-[#004b93] uppercase tracking-widest">{p.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <h4 className="font-black text-slate-900 mb-2 leading-tight h-10 line-clamp-2">{p.name}</h4>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Precio MXN</p>
                        <p className="text-xl font-black text-slate-900">${p.price.toLocaleString()}</p>
                      </div>
                      <button 
                        onClick={() => addToCart(p)}
                        className="bg-[#DA6000] p-3.5 rounded-2xl text-white shadow-lg shadow-[#DA6000]/20 hover:scale-110 active:scale-95 transition-all"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
            <Settings className="w-16 h-16 mb-4 opacity-20" />
            <h3 className="text-xl font-black">Módulo en Construcción</h3>
            <p className="font-medium">Estamos trabajando para habilitar esta sección pronto.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans selection:bg-blue-100 selection:text-[#004b93] overflow-hidden">
      <Sidebar 
        currentView={view} 
        setView={setView} 
        isOpen={isSidebarOpen} 
        setIsOpen={setSidebarOpen} 
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header 
          title={view === 'Dashboard' ? 'Optimax - Gestión Óptica' : view} 
          toggleSidebar={() => setSidebarOpen(true)} 
          cartCount={cartCount} 
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-10 relative">
          <div className="max-w-7xl mx-auto w-full pb-20">
            {renderContent()}
          </div>

          <AnimatePresence>
            {toast && (
              <motion.div 
                initial={{ opacity: 0, y: 50, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, y: 20, x: '-50%' }}
                className="fixed bottom-10 left-1/2 z-[100] bg-[#004b93] text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4 border border-white/10 backdrop-blur-lg"
              >
                <div className="w-2 h-2 bg-[#DA6000] rounded-full animate-pulse" />
                <p className="text-sm font-black tracking-tight uppercase tracking-widest">{toast}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Quick Access Mobile Tab Bar (Optional/Alternative) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex items-center justify-around px-4 z-40">
        <button onClick={() => setView('Dashboard')} className={`p-2 ${view === 'Dashboard' ? 'text-[#004b93]' : 'text-slate-400'}`}>
          <LayoutDashboard className="w-6 h-6" />
        </button>
        <button onClick={() => setView('Expedientes')} className={`p-2 ${view === 'Expedientes' ? 'text-[#004b93]' : 'text-slate-400'}`}>
          <ClipboardList className="w-6 h-6" />
        </button>
        <button onClick={() => setView('Tienda')} className={`p-2 ${view === 'Tienda' ? 'text-[#004b93]' : 'text-slate-400'}`}>
          <ShoppingBag className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
