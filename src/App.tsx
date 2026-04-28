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
  LogOut, 
  Menu, 
  X, 
  ShoppingCart, 
  Plus, 
  Filter, 
  Clock, 
  ChevronRight,
  PackageCheck,
  CreditCard,
  UserPlus,
  ArrowRight,
  Stethoscope,
  Boxes,
  ShieldCheck,
  UserCog
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type View = 'Dashboard' | 'Expedientes' | 'Inventario' | 'Tienda' | 'Configuracion';
type UserRole = 'Administrador' | 'Optometrista' | 'Paciente';

interface Patient {
  id: string;
  name: string;
  lastExam: string;
  prescription: {
    od: { esf: string; cil: string; eje: string };
    oi: { esf: string; cil: string; eje: string };
  };
  status: 'Activo' | 'Seguimiento' | 'Urgente';
}

interface Product {
  id: number;
  name: string;
  category: 'Sol' | 'Armazones' | 'Lentes de Contacto';
  price: number;
  image: string;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
}

// --- Mock Data ---
const PATIENTS: Patient[] = [
  { 
    id: 'P-1024', 
    name: 'Laura Martínez', 
    lastExam: '15 Mar 2024', 
    prescription: {
      od: { esf: '-2.50', cil: '-0.75', eje: '10°' },
      oi: { esf: '-2.25', cil: '-0.50', eje: '175°' }
    },
    status: 'Activo' 
  },
  { 
    id: 'P-1085', 
    name: 'Carlos Ruiz', 
    lastExam: '10 Abr 2024', 
    prescription: {
      od: { esf: '+1.00', cil: '-1.25', eje: '90°' },
      oi: { esf: '+1.25', cil: '-1.00', eje: '85°' }
    },
    status: 'Seguimiento' 
  },
  { 
    id: 'P-1102', 
    name: 'Sofía Guevara', 
    lastExam: '28 Feb 2024', 
    prescription: {
      od: { esf: '-1.75', cil: 'S/C', eje: '0°' },
      oi: { esf: '-1.75', cil: 'S/C', eje: '0°' }
    },
    status: 'Activo' 
  },
  { 
    id: 'P-1140', 
    name: 'Roberto Gómez', 
    lastExam: '20 Abr 2024', 
    prescription: {
      od: { esf: '-0.50', cil: '-0.25', eje: '45°' },
      oi: { esf: '-0.75', cil: '-0.50', eje: '135°' }
    },
    status: 'Urgente' 
  },
];

const PRODUCTS: Product[] = [
  { id: 1, name: 'Ray-Ban Classic Aviator', category: 'Sol', price: 3450, stock: 12, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600' },
  { id: 2, name: 'Oakley Holbrook Prizm', category: 'Sol', price: 2900, stock: 8, image: 'https://images.unsplash.com/photo-1511499767390-a7335958beba?auto=format&fit=crop&q=80&w=600' },
  { id: 3, name: 'Armazón Giorgio Armani Titanium', category: 'Armazones', price: 5800, stock: 5, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=600' },
  { id: 4, name: 'Lentes de Contacto Acuvue Moist', category: 'Lentes de Contacto', price: 950, stock: 45, image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=600' },
  { id: 5, name: 'Prada Cinema Eyewear', category: 'Sol', price: 4200, stock: 3, image: 'https://images.unsplash.com/photo-1625591339762-430a30b3564c?auto=format&fit=crop&q=80&w=600' },
  { id: 6, name: 'Armazón Minimalista Silhoutte', category: 'Armazones', price: 6100, stock: 7, image: 'https://images.unsplash.com/photo-1511499767390-a7335958beba?auto=format&fit=crop&q=80&w=600' },
];

// --- Theme Config ---
const PRIMARY_COLOR = '#004b93'; // Optimax Blue
const ACCENT_COLOR = '#DA6000';  // Corporate Orange

// --- Hook for screen size ---
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
};

// --- Components ---

const Sidebar = ({ currentView, setView, isOpen, setIsOpen, role }: { 
  currentView: View, setView: (v: View) => void, isOpen: boolean, setIsOpen: (o: boolean) => void, role: UserRole 
}) => {
  const isMobile = useIsMobile();
  
  const menuItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Administrador', 'Optometrista', 'Paciente'] },
    { id: 'Expedientes', label: 'Expediente Clínico', icon: ClipboardList, roles: ['Administrador', 'Optometrista', 'Paciente'] },
    { id: 'Inventario', label: 'Inventario', icon: Boxes, roles: ['Administrador'] },
    { id: 'Tienda', label: 'eCommerce', icon: ShoppingBag, roles: ['Administrador', 'Optometrista', 'Paciente'] },
    { id: 'Configuracion', label: 'Configuración', icon: Settings, roles: ['Administrador'] },
  ] as const;

  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <>
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <motion.aside 
        initial={false}
        animate={{ 
          x: isMobile ? (isOpen ? 0 : -280) : 0 
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed lg:relative z-50 h-screen w-[280px] bg-[#004b93] text-white flex flex-col shadow-2xl lg:translate-x-0"
      >
        <div className="p-8 flex-1">
          <div className="flex items-center justify-between mb-12">
            <div className="bg-white p-2.5 rounded-2xl shadow-xl">
              <img src="https://cossma.com.mx/optimax.png" alt="Optimax" className="h-7 w-auto px-1" />
            </div>
            <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 hover:bg-white/10 rounded-xl">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="space-y-1.5">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id);
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group ${
                  currentView === item.id 
                    ? 'bg-white text-[#004b93] shadow-lg font-bold' 
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm tracking-tight">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-8">
          <div className="bg-white/5 p-5 rounded-[24px] border border-white/10 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Sistema Online</span>
            </div>
            <p className="text-xs text-white/50 leading-relaxed italic">"Precisión visual para una vida mejor."</p>
          </div>
          <button className="flex items-center gap-3 px-5 py-4 w-full text-white/70 hover:text-white hover:bg-white/5 rounded-2xl transition-all text-sm font-bold">
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </motion.aside>
    </>
  );
};

const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-[32px] border border-slate-200 shadow-sm p-8 ${className}`}>
    {children}
  </div>
);

export default function App() {
  const [view, setView] = useState<View>('Dashboard');
  const [role, setRole] = useState<UserRole>('Administrador');
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
      return [...prev, { ...product, quantity: 1 }];
    });
    setToast(`${product.name} añadido al carrito`);
  };

  const renderModule = () => {
    switch (view) {
      case 'Dashboard':
        return (
          <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Bienvenido, Harold</h2>
                <p className="text-slate-500 font-medium mt-2">Resumen operativo para hoy, {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}.</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 bg-[#004b93] text-white px-8 py-4 rounded-[20px] font-bold shadow-xl shadow-blue-900/10 hover:translate-y-[-2px] transition-all">
                  <Plus className="w-5 h-5" /> Nueva Venta
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Citas Hoy', value: '14', trend: '+2 reservadas', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Ventas (MXN)', value: '$52.4k', trend: '+12% hoy', icon: CreditCard, color: 'text-[#DA6000]', bg: 'bg-orange-50' },
                { label: 'Entregas', value: '7', trend: '3 por confirmar', icon: PackageCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Expedientes', value: '1,248', trend: '+5 nuevos', icon: UserPlus, color: 'text-purple-600', bg: 'bg-purple-50' },
              ].map((m, i) => (
                <Card key={i} className="group hover:border-[#004b93]/30 transition-all cursor-default">
                  <div className={`w-12 h-12 ${m.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <m.icon className={`w-6 h-6 ${m.color}`} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{m.label}</p>
                  <p className="text-3xl font-black text-slate-900">{m.value}</p>
                  <div className="flex items-center gap-1.5 mt-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{m.trend}</span>
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-black text-slate-900">Agenda Próxima</h3>
                    <button className="p-2 hover:bg-slate-50 rounded-xl transition-all">
                      <Filter className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {[
                      { patient: 'Laura Martínez', time: '14:30', service: 'Examen Completo', status: 'En Clínica' },
                      { patient: 'Carlos Ruiz', time: '15:15', service: 'Prueba de Lentes', status: 'Pendiente' },
                      { patient: 'Sofía Guevara', time: '16:00', service: 'Ajuste de Armazón', status: 'Pendiente' },
                    ].map((app, i) => (
                      <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-slate-100 hover:border-[#004b93]/20 transition-all group">
                        <div className="flex items-center gap-5">
                          <div className="bg-white w-14 h-14 rounded-2xl flex flex-col items-center justify-center border border-slate-200 shadow-sm">
                            <span className="text-sm font-black text-[#004b93]">{app.time}</span>
                          </div>
                          <div>
                            <p className="font-black text-slate-900">{app.patient}</p>
                            <p className="text-xs text-slate-400 font-bold uppercase">{app.service}</p>
                          </div>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${app.status === 'En Clínica' ? 'bg-[#DA6000] text-white' : 'bg-slate-200 text-slate-600'}`}>
                          {app.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <Card className="bg-[#004b93] text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Stethoscope className="w-32 h-32" />
                </div>
                <h3 className="text-xl font-black mb-10 relative z-10">Resumen Clínico</h3>
                <div className="space-y-8 relative z-10">
                  <div>
                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest mb-3 text-white/60">
                      <span>Eficiencia Óptica</span>
                      <span>92%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="h-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
                    </div>
                  </div>
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#DA6000] mb-2">Nota del Día</p>
                    <p className="text-xs leading-relaxed text-white/80">Hoy recibimos 5 nuevos armazones de la línea Prada. Asegurar actualización en eCommerce.</p>
                  </div>
                  <button className="w-full py-4 bg-white text-[#004b93] font-black text-sm uppercase rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                    Reporte Completo <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            </div>
          </div>
        );

      case 'Expedientes':
        return (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Expedientes Clínicos</h2>
                <p className="text-slate-500 font-medium">Gestión de graduaciones y salud visual.</p>
              </div>
              <button className="bg-[#004b93] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg">
                <Plus className="w-5 h-5" /> Nuevo Paciente
              </button>
            </div>

            <Card className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Paciente</th>
                      <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center bg-blue-50/50">Graduación OD (Esf, Cil, Eje)</th>
                      <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center bg-indigo-50/50">Graduación OI (Esf, Cil, Eje)</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Estatus</th>
                      <th className="px-8 py-6"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {PATIENTS.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-8">
                          <p className="font-black text-slate-900">{p.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                             <Clock className="w-3 h-3 text-slate-400" />
                             <span className="text-[10px] font-bold text-slate-400 uppercase">{p.lastExam}</span>
                          </div>
                        </td>
                        <td className="px-6 py-8 text-center bg-blue-50/20">
                          <div className="flex justify-center gap-1.5">
                            <span className="px-2 py-1 bg-white text-[#004b93] font-mono text-[11px] font-black rounded border border-blue-100">{p.prescription.od.esf}</span>
                            <span className="px-2 py-1 bg-white text-[#004b93] font-mono text-[11px] font-black rounded border border-blue-100">{p.prescription.od.cil}</span>
                            <span className="px-2 py-1 bg-white text-[#004b93] font-mono text-[11px] font-black rounded border border-blue-100">{p.prescription.od.eje}</span>
                          </div>
                        </td>
                        <td className="px-6 py-8 text-center bg-indigo-50/20">
                           <div className="flex justify-center gap-1.5">
                            <span className="px-2 py-1 bg-white text-indigo-700 font-mono text-[11px] font-black rounded border border-indigo-100">{p.prescription.oi.esf}</span>
                            <span className="px-2 py-1 bg-white text-indigo-700 font-mono text-[11px] font-black rounded border border-indigo-100">{p.prescription.oi.cil}</span>
                            <span className="px-2 py-1 bg-white text-indigo-700 font-mono text-[11px] font-black rounded border border-indigo-100">{p.prescription.oi.eje}</span>
                          </div>
                        </td>
                        <td className="px-8 py-8 text-center">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${
                            p.status === 'Activo' ? 'bg-emerald-100 text-emerald-600' : 
                            p.status === 'Urgente' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-[#DA6000]'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-8 py-8 text-right">
                          <button className="bg-slate-100 text-slate-600 p-3 rounded-xl hover:bg-[#004b93] hover:text-white transition-all font-bold text-xs uppercase tracking-tight">
                            Ver Detalle
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
          <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">eCommerce Óptico</h2>
                <p className="text-slate-500 font-medium">Catálogo premium de armazones y accesorios.</p>
              </div>
              <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
                {['Todos', 'Armazones', 'Sol', 'Lentes'].map(t => (
                  <button key={t} className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-tighter transition-all ${t === 'Todos' ? 'bg-white text-[#004b93] shadow-sm' : 'text-slate-500 hover:text-[#004b93]'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {PRODUCTS.map(p => (
                <div key={p.id} className="bg-white rounded-[40px] p-6 border border-slate-200 shadow-sm hover:shadow-2xl hover:border-[#004b93]/20 transition-all group">
                  <div className="relative h-56 rounded-[32px] overflow-hidden bg-slate-50 mb-6">
                    <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-[18px] border border-white/50 shadow-sm">
                      <p className="text-[10px] font-black text-[#004b93] uppercase tracking-widest">{p.category}</p>
                    </div>
                  </div>
                  <h4 className="font-black text-slate-900 text-lg mb-2 line-clamp-2 leading-tight h-10">{p.name}</h4>
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase mb-0.5">Precio Neto</p>
                      <p className="text-2xl font-black text-slate-900">${p.price.toLocaleString()}</p>
                    </div>
                    <button 
                      onClick={() => addToCart(p)}
                      className="bg-[#DA6000] p-4 rounded-[22px] text-white shadow-xl shadow-[#DA6000]/20 hover:scale-105 active:scale-95 transition-all"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-[50vh] text-slate-300">
            <Boxes className="w-20 h-20 mb-6 opacity-20" />
            <p className="text-xl font-black uppercase tracking-widest">Módulo en Desarrollo</p>
            <p className="text-sm font-bold mt-2">Esta sección estará disponible en la próxima actualización.</p>
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
        role={role}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-24 bg-white border-b border-slate-200 flex items-center justify-between px-8 lg:px-12 backdrop-blur-sm bg-white/80">
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-3 hover:bg-slate-50 rounded-2xl transition-all">
              <Menu className="w-7 h-7 text-slate-600" />
            </button>
            <div className="flex items-center gap-4">
              <div className="hidden sm:block">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Módulo Actual</span>
                <h1 className="text-lg font-black text-[#004b93] tracking-tighter leading-none">{view}</h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden xl:flex relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar paciente, receta o producto..." 
                className="pl-11 pr-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm w-80 focus:ring-4 focus:ring-[#004b93]/5 focus:border-[#004b93] transition-all outline-none"
              />
            </div>

            <div className="flex items-center gap-4 border-l border-slate-200 pl-8">
              <button className="relative p-3.5 bg-slate-50 rounded-2xl text-slate-600 hover:text-[#004b93] transition-all group">
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#DA6000] text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">{cartCount}</span>
                )}
              </button>

              <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-[20px] border border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-[#004b93] flex items-center justify-center text-white font-black shadow-lg">H</div>
                <div className="hidden lg:block">
                  <p className="text-xs font-black text-slate-900 leading-none mb-1">Harold Optik</p>
                  <div className="flex items-center gap-1.5">
                    <UserCog className="w-3 h-3 text-[#DA6000]" />
                    <select 
                      value={role} 
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="bg-transparent text-[10px] font-black text-slate-400 uppercase tracking-tighter outline-none cursor-pointer hover:text-[#004b93]"
                    >
                      <option value="Administrador">Administrador</option>
                      <option value="Optometrista">Optometrista</option>
                      <option value="Paciente">Paciente</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 lg:p-12 relative">
          <div className="max-w-7xl mx-auto w-full pb-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={view + role}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "circOut" }}
              >
                {renderModule()}
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {toast && (
              <motion.div 
                initial={{ opacity: 0, y: 50, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, scale: 0.9, x: '-50%' }}
                className="fixed bottom-12 left-1/2 z-[100] bg-[#004b93] text-white px-8 py-5 rounded-[28px] shadow-2xl flex items-center gap-4 border border-white/10 backdrop-blur-xl"
              >
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <p className="text-xs font-black uppercase tracking-widest">{toast}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Tab Bar for rapid access */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-200 px-8 flex items-center justify-around z-40">
        {[
          { v: 'Dashboard', i: LayoutDashboard },
          { v: 'Expedientes', i: ClipboardList },
          { v: 'Tienda', i: ShoppingBag }
        ].map(item => (
          <button 
            key={item.v}
            onClick={() => setView(item.v as View)}
            className={`flex flex-col items-center gap-1 transition-all ${view === item.v ? 'text-[#004b93]' : 'text-slate-300'}`}
          >
            <item.i className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-tighter">{item.v}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
