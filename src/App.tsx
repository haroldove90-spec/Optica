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
type UserRole = 'Administrador' | 'Optometrista' | 'Cliente';

interface Patient {
  id: string;
  name: string;
  lastExam: string;
  prescription: {
    od: { esf: string; cil: string; eje: string; add: string; dp: string };
    oi: { esf: string; cil: string; eje: string; add: string; dp: string };
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
      od: { esf: '-2.50', cil: '-0.75', eje: '10°', add: '+2.00', dp: '31.5' },
      oi: { esf: '-2.25', cil: '-0.50', eje: '175°', add: '+2.00', dp: '32.0' }
    },
    status: 'Activo' 
  },
  { 
    id: 'P-1085', 
    name: 'Carlos Ruiz', 
    lastExam: '10 Abr 2024', 
    prescription: {
      od: { esf: '+1.00', cil: '-1.25', eje: '90°', add: '+1.75', dp: '33.0' },
      oi: { esf: '+1.25', cil: '-1.00', eje: '85°', add: '+1.75', dp: '33.5' }
    },
    status: 'Seguimiento' 
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
  
  if (role === 'Cliente') return null;

  const menuItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Administrador', 'Optometrista'] as UserRole[] },
    { id: 'Expedientes', label: 'Expediente Clínico', icon: ClipboardList, roles: ['Administrador', 'Optometrista'] as UserRole[] },
    { id: 'Inventario', label: 'Inventario', icon: Boxes, roles: ['Administrador'] as UserRole[] },
    { id: 'Tienda', label: 'Tienda eCommerce', icon: ShoppingBag, roles: ['Administrador'] as UserRole[] },
    { id: 'Configuracion', label: 'Configuración', icon: Settings, roles: ['Administrador'] as UserRole[] },
  ];

  const filteredItems = menuItems.filter(item => (item.roles as string[]).includes(role));

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
        animate={{ x: isMobile ? (isOpen ? 0 : -280) : 0 }}
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
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Verificado</span>
            </div>
            <p className="text-[10px] text-white/40 leading-none">Sistema de Gestión Óptica v1.4</p>
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

interface CardProps {
  children: React.ReactNode;
  className?: string;
  key?: React.Key;
}

const Card = ({ children, className = "" }: CardProps) => (
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

  // Role gating logic
  useEffect(() => {
    if (role === 'Cliente') setView('Tienda');
    else if (role === 'Optometrista' && (view === 'Inventario' || view === 'Tienda' || view === 'Configuracion')) {
      setView('Dashboard');
    }
  }, [role]);

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
    setToast(`${product.name} añadido`);
  };

  const renderModule = () => {
    switch (view) {
      case 'Dashboard':
        return (
          <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Hola, {role}</h2>
                <p className="text-slate-500 font-medium mt-1">Tu óptica está funcionando correctamente hoy.</p>
              </div>
              {role === 'Administrador' && (
                <button className="flex items-center gap-2 bg-[#004b93] text-white px-8 py-4 rounded-[20px] font-bold shadow-xl hover:shadow-2xl transition-all">
                  <Plus className="w-5 h-5" /> Nueva Venta
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Citas Hoy', value: '14', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Ventas (MXN)', value: '$52,400', icon: CreditCard, color: 'text-[#DA6000]', bg: 'bg-orange-50' },
                { label: 'Entregas', value: '7', icon: PackageCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Expedientes', value: '1,248', icon: UserPlus, color: 'text-purple-600', bg: 'bg-purple-50' },
              ].map((m, i) => (
                <Card key={i} className="group hover:scale-[1.02] transition-transform cursor-pointer">
                  <div className={`w-12 h-12 ${m.bg} rounded-2xl flex items-center justify-center mb-6`}>
                    <m.icon className={`w-6 h-6 ${m.color}`} />
                  </div>
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{m.label}</p>
                  <p className="text-2xl font-black text-slate-900">{m.value}</p>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <h3 className="text-xl font-black text-slate-900 mb-8">Agenda del día</h3>
                  <div className="space-y-4">
                    {[
                      { patient: 'Laura Martínez', time: '14:30', service: 'Examen', status: 'En espera' },
                      { patient: 'Carlos Ruiz', time: '15:15', service: 'Prueba', status: 'Pendiente' },
                    ].map((app, i) => (
                      <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-slate-100">
                        <div className="flex items-center gap-5">
                          <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center font-black text-[#004b93] border border-slate-200">{app.time}</div>
                          <div>
                            <p className="font-black text-slate-900">{app.patient}</p>
                            <p className="text-xs text-slate-400 font-bold uppercase">{app.service}</p>
                          </div>
                        </div>
                        <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase bg-[#DA6000] text-white">{app.status}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
              <Card className="bg-[#004b93] text-white">
                <h3 className="text-xl font-black mb-8 italic">"Precisión en cada diagnóstico."</h3>
                <div className="space-y-6">
                  <div className="p-5 bg-white/5 rounded-3xl border border-white/10">
                    <p className="text-[10px] uppercase text-[#DA6000] font-black mb-1">Nota Administrativa</p>
                    <p className="text-sm">Llegaron los nuevos armazones Ray-Ban. Revisar inventario.</p>
                  </div>
                  <button className="w-full py-4 bg-white text-[#004b93] font-black rounded-2xl hover:scale-95 transition-all uppercase text-xs">Ver Reportes</button>
                </div>
              </Card>
            </div>
          </div>
        );

      case 'Expedientes':
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-slate-900">Expediente Clínico</h2>
            <Card className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase">Paciente</th>
                      <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase text-center bg-blue-50/50">Ojo Derecho (OD)</th>
                      <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase text-center bg-indigo-50/50">Ojo Izquierdo (OI)</th>
                      <th className="px-8 py-6"></th>
                    </tr>
                    <tr className="bg-slate-50/50 text-[9px] font-black text-slate-400 uppercase">
                      <th className="px-8 py-2">Info</th>
                      <th className="px-6 py-2">
                        <div className="grid grid-cols-5 text-center">
                          <span>Esf</span><span>Cil</span><span>Eje</span><span>Add</span><span>DP</span>
                        </div>
                      </th>
                      <th className="px-6 py-2">
                        <div className="grid grid-cols-5 text-center">
                          <span>Esf</span><span>Cil</span><span>Eje</span><span>Add</span><span>DP</span>
                        </div>
                      </th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {PATIENTS.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-8">
                          <p className="font-black text-slate-800">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{p.id}</p>
                        </td>
                        <td className="px-6 py-8 bg-blue-50/10">
                          <div className="grid grid-cols-5 text-center gap-1">
                            <span className="font-mono text-xs font-bold text-blue-700">{p.prescription.od.esf}</span>
                            <span className="font-mono text-xs font-bold text-blue-700">{p.prescription.od.cil}</span>
                            <span className="font-mono text-xs font-bold text-blue-700">{p.prescription.od.eje}</span>
                            <span className="font-mono text-xs font-bold text-blue-700">{p.prescription.od.add}</span>
                            <span className="font-mono text-xs font-bold text-blue-700">{p.prescription.od.dp}</span>
                          </div>
                        </td>
                        <td className="px-6 py-8 bg-indigo-50/10">
                          <div className="grid grid-cols-5 text-center gap-1">
                            <span className="font-mono text-xs font-bold text-indigo-700">{p.prescription.oi.esf}</span>
                            <span className="font-mono text-xs font-bold text-indigo-700">{p.prescription.oi.cil}</span>
                            <span className="font-mono text-xs font-bold text-indigo-700">{p.prescription.oi.eje}</span>
                            <span className="font-mono text-xs font-bold text-indigo-700">{p.prescription.oi.add}</span>
                            <span className="font-mono text-xs font-bold text-indigo-700">{p.prescription.oi.dp}</span>
                          </div>
                        </td>
                        <td className="px-8 py-8 text-right">
                          <button className="bg-[#004b93] text-white px-4 py-2 rounded-xl font-bold text-[10px] uppercase">Detalle</button>
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
            <h2 className="text-3xl font-black text-slate-900">Nuestra Tienda</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {PRODUCTS.map(p => (
                <div key={p.id} className="bg-white rounded-[40px] p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
                  <div className="h-56 rounded-[32px] overflow-hidden bg-slate-50 mb-6">
                    <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                  </div>
                  <h4 className="font-black text-slate-800 text-lg mb-2">{p.name}</h4>
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
                    <p className="text-2xl font-black text-slate-900">${p.price.toLocaleString()}</p>
                    <button onClick={() => addToCart(p)} className="bg-[#DA6000] p-4 rounded-[22px] text-white shadow-lg shadow-[#DA6000]/20 hover:scale-105 transition-all">
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <div className="text-center p-20 text-slate-300 font-black uppercase">Próximamente</div>;
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans overflow-hidden">
      <Sidebar 
        currentView={view} 
        setView={setView} 
        isOpen={isSidebarOpen} 
        setIsOpen={setSidebarOpen} 
        role={role}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-24 bg-white border-b border-slate-200 flex items-center justify-between px-8 lg:px-12">
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-3 bg-slate-50 rounded-2xl">
              <Menu className="w-7 h-7 text-slate-600" />
            </button>
            <h1 className="text-xl font-black text-[#004b93] tracking-tighter">{role === 'Cliente' ? 'Óptica Optimax' : view}</h1>
          </div>

          <div className="flex items-center gap-6">
             <div className="hidden md:flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-400 uppercase">Cambiar Vista</span>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="bg-transparent text-xs font-black text-[#DA6000] outline-none cursor-pointer text-right uppercase"
                >
                  <option value="Administrador">Admin</option>
                  <option value="Optometrista">Optometrista</option>
                  <option value="Cliente">Cliente (Catálogo)</option>
                </select>
             </div>

             <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
                <button className="relative p-3 bg-slate-50 rounded-2xl text-slate-600">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-[#DA6000] text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">{cartCount}</span>}
                </button>
                <div className="w-10 h-10 rounded-2xl bg-[#004b93] flex items-center justify-center text-white font-black shadow-lg">H</div>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="max-w-7xl mx-auto mb-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={view + role}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
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
                exit={{ opacity: 0, x: '-50%' }}
                className="fixed bottom-12 left-1/2 bg-[#004b93] text-white px-8 py-5 rounded-[28px] shadow-2xl flex items-center gap-4 z-[100]"
              >
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <p className="text-xs font-black uppercase tracking-widest">{toast}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
