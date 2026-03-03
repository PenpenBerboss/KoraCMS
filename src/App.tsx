/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Rss, 
  Image as ImageIcon, 
  ShoppingBag, 
  Users, 
  Settings, 
  CreditCard, 
  Globe, 
  Plus, 
  Search, 
  Bell, 
  Menu, 
  X,
  ChevronRight,
  TrendingUp,
  Package,
  Eye,
  LogOut,
  Smartphone,
  WifiOff,
  Languages,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, DashboardStats } from './types';

// Mock Auth State
const INITIAL_USER: User | null = null;

export default function App() {
  const [user, setUser] = useState<User | null>(INITIAL_USER);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({ pages: 0, posts: 0, products: 0, revenue: 0 });
  const [isLowBandwidth, setIsLowBandwidth] = useState(false);
  const [lang, setLang] = useState<'fr' | 'en'>('fr');
  const [showPublicPreview, setShowPublicPreview] = useState(false);

  // Simulation de chargement des stats
  useEffect(() => {
    if (user) {
      setStats({
        pages: 12,
        posts: 45,
        products: 8,
        revenue: 1250000
      });
    }
  }, [user]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      id: 1,
      fullName: 'Mamadou Diallo',
      email: 'contact@pme-afrique.com',
      role: 'admin',
      companyId: 1,
      permissions: ['manage_users', 'manage_pages', 'manage_blog', 'manage_products', 'manage_payments', 'manage_settings']
    });
  };

  const hasPermission = (permission: string) => {
    return user?.permissions.includes(permission) || user?.role === 'admin';
  };

  if (showPublicPreview) {
    return <PublicSitePreview onClose={() => setShowPublicPreview(false)} lang={lang} />;
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} lang={lang} setLang={setLang} />;
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside 
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="w-72 bg-slate-900 text-white flex flex-col z-50 fixed lg:relative h-full"
          >
            <div className="p-6 flex items-center gap-3 border-b border-slate-800">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center font-bold text-xl">K</div>
              <div>
                <h1 className="font-bold text-lg leading-none">KoraCMS</h1>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest">PME Afrique Edition</span>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              <NavItem icon={<LayoutDashboard size={20} />} label={lang === 'fr' ? 'Tableau de bord' : 'Dashboard'} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
              
              <div className="pt-4 pb-2 px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{lang === 'fr' ? 'Contenu' : 'Content'}</div>
              {hasPermission('manage_pages') && (
                <NavItem icon={<FileText size={20} />} label={lang === 'fr' ? 'Pages' : 'Pages'} active={activeTab === 'pages'} onClick={() => setActiveTab('pages')} />
              )}
              {hasPermission('manage_blog') && (
                <NavItem icon={<Rss size={20} />} label={lang === 'fr' ? 'Blog' : 'Blog'} active={activeTab === 'blog'} onClick={() => setActiveTab('blog')} />
              )}
              <NavItem icon={<ImageIcon size={20} />} label={lang === 'fr' ? 'Médias' : 'Media'} active={activeTab === 'media'} onClick={() => setActiveTab('media')} />
              
              <div className="pt-4 pb-2 px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{lang === 'fr' ? 'Commerce' : 'Business'}</div>
              {hasPermission('manage_products') && (
                <NavItem icon={<ShoppingBag size={20} />} label={lang === 'fr' ? 'Produits & Services' : 'Products & Services'} active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
              )}
              {hasPermission('manage_payments') && (
                <NavItem icon={<CreditCard size={20} />} label={lang === 'fr' ? 'Paiements' : 'Payments'} active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} />
              )}
              
              <div className="pt-4 pb-2 px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{lang === 'fr' ? 'Administration' : 'Admin'}</div>
              {hasPermission('manage_users') && (
                <NavItem icon={<Users size={20} />} label={lang === 'fr' ? 'Utilisateurs' : 'Users'} active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
              )}
              {hasPermission('manage_settings') && (
                <NavItem icon={<Settings size={20} />} label={lang === 'fr' ? 'Paramètres' : 'Settings'} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
              )}
            </nav>

            <div className="p-4 border-t border-slate-800">
              <button 
                onClick={() => setUser(null)}
                className="flex items-center gap-3 w-full p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <LogOut size={20} />
                <span className="text-sm font-medium">{lang === 'fr' ? 'Déconnexion' : 'Logout'}</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg lg:hidden">
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
              <Globe size={16} />
              <a href="#" className="hover:text-emerald-600 font-medium">pme-afrique.com</a>
              <ChevronRight size={14} />
              <span className="capitalize">{activeTab}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            {/* View Site Button */}
            <button 
              onClick={() => setShowPublicPreview(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all"
            >
              <Eye size={16} />
              <span className="hidden sm:inline">{lang === 'fr' ? 'Voir le site' : 'View site'}</span>
            </button>

            {/* Low Bandwidth Toggle */}
            <button 
              onClick={() => setIsLowBandwidth(!isLowBandwidth)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${isLowBandwidth ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-600 border border-transparent'}`}
              title={lang === 'fr' ? 'Mode faible bande passante' : 'Low bandwidth mode'}
            >
              <WifiOff size={14} />
              <span className="hidden sm:inline">{lang === 'fr' ? 'Bande passante' : 'Bandwidth'}</span>
            </button>

            {/* Language Toggle */}
            <button 
              onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 flex items-center gap-2"
            >
              <Languages size={18} />
              <span className="text-xs font-bold uppercase">{lang}</span>
            </button>

            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-none">{user.fullName}</p>
                <p className="text-[10px] text-slate-500 uppercase mt-1">{user.role}</p>
              </div>
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold border-2 border-white shadow-sm">
                MD
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && <DashboardView stats={stats} lang={lang} />}
            {activeTab === 'pages' && hasPermission('manage_pages') && <PagesView lang={lang} />}
            {activeTab === 'products' && hasPermission('manage_products') && <ProductsView lang={lang} />}
            {activeTab === 'payments' && hasPermission('manage_payments') && <PaymentsView lang={lang} />}
            {activeTab === 'users' && hasPermission('manage_users') && <UsersView lang={lang} />}
            {activeTab === 'settings' && hasPermission('manage_settings') && <SettingsView lang={lang} />}
          </AnimatePresence>
        </div>
      </main>

      {/* Floating WhatsApp Support Button */}
      <a 
        href="https://wa.me/221770000000" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50"
      >
        <MessageCircle size={28} />
      </a>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all ${active ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
      {active && <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
    </button>
  );
}

function LoginPage({ onLogin, lang, setLang }: { onLogin: (e: React.FormEvent) => void, lang: string, setLang: (l: 'fr' | 'en') => void }) {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10"
      >
        <div className="p-8 md:p-12">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center font-bold text-white text-xl">K</div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">KoraCMS</h1>
            </div>
            <button 
              onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
              className="text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors uppercase"
            >
              {lang === 'fr' ? 'English' : 'Français'}
            </button>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              {lang === 'fr' ? 'Bienvenue sur votre CMS' : 'Welcome to your CMS'}
            </h2>
            <p className="text-slate-500 text-sm">
              {lang === 'fr' ? 'Gérez votre présence en ligne en toute simplicité.' : 'Manage your online presence with ease.'}
            </p>
          </div>

          <form onSubmit={onLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{lang === 'fr' ? 'Email Professionnel' : 'Professional Email'}</label>
              <input 
                type="email" 
                defaultValue="contact@pme-afrique.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="nom@entreprise.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{lang === 'fr' ? 'Mot de passe' : 'Password'}</label>
              <input 
                type="password" 
                defaultValue="password"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                <span className="text-xs text-slate-600">{lang === 'fr' ? 'Se souvenir de moi' : 'Remember me'}</span>
              </label>
              <a href="#" className="text-xs font-semibold text-emerald-600 hover:underline">{lang === 'fr' ? 'Mot de passe oublié ?' : 'Forgot password?'}</a>
            </div>
            <button 
              type="submit"
              className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-900/20 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {lang === 'fr' ? 'Se connecter' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              {lang === 'fr' ? 'Pas encore de compte ?' : "Don't have an account?"}{' '}
              <a href="#" className="font-bold text-emerald-600 hover:underline">{lang === 'fr' ? 'Créer une entreprise' : 'Register company'}</a>
            </p>
          </div>
        </div>
      </motion.div>
      
      <div className="absolute bottom-8 text-slate-500 text-xs font-medium flex items-center gap-4">
        <span>© 2024 KoraCMS Africa</span>
        <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
        <span>Made for SMEs</span>
      </div>
    </div>
  );
}

function DashboardView({ stats, lang }: { stats: DashboardStats, lang: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{lang === 'fr' ? 'Tableau de bord' : 'Dashboard'}</h2>
          <p className="text-slate-500 text-sm">{lang === 'fr' ? 'Voici un aperçu de votre activité aujourd\'hui.' : 'Here is an overview of your activity today.'}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            <Eye size={18} />
            {lang === 'fr' ? 'Voir le site' : 'View site'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-900/10 hover:bg-emerald-700 transition-colors">
            <Plus size={18} />
            {lang === 'fr' ? 'Nouveau contenu' : 'New content'}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<TrendingUp className="text-emerald-600" />} 
          label={lang === 'fr' ? 'Chiffre d\'affaires' : 'Revenue'} 
          value={`${stats.revenue.toLocaleString()} FCFA`} 
          trend="+12.5%" 
          color="bg-emerald-50" 
        />
        <StatCard 
          icon={<FileText className="text-blue-600" />} 
          label={lang === 'fr' ? 'Pages actives' : 'Active Pages'} 
          value={stats.pages.toString()} 
          trend="+2" 
          color="bg-blue-50" 
        />
        <StatCard 
          icon={<Rss className="text-amber-600" />} 
          label={lang === 'fr' ? 'Articles de blog' : 'Blog Posts'} 
          value={stats.posts.toString()} 
          trend="+5" 
          color="bg-amber-50" 
        />
        <StatCard 
          icon={<Package className="text-purple-600" />} 
          label={lang === 'fr' ? 'Produits' : 'Products'} 
          value={stats.products.toString()} 
          trend="0" 
          color="bg-purple-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">{lang === 'fr' ? 'Activité récente' : 'Recent Activity'}</h3>
            <button className="text-xs font-bold text-emerald-600 hover:underline">{lang === 'fr' ? 'Tout voir' : 'View all'}</button>
          </div>
          <div className="divide-y divide-slate-50">
            <ActivityItem 
              title={lang === 'fr' ? 'Nouvelle commande reçue' : 'New order received'} 
              time="Il y a 10 min" 
              user="Client: Moussa Sarr" 
              amount="45,000 FCFA" 
              status="pending" 
            />
            <ActivityItem 
              title={lang === 'fr' ? 'Article publié' : 'Post published'} 
              time="Il y a 2h" 
              user="Par: Mamadou Diallo" 
              amount="Blog" 
              status="success" 
            />
            <ActivityItem 
              title={lang === 'fr' ? 'Paiement Mobile Money réussi' : 'Mobile Money payment success'} 
              time="Il y a 5h" 
              user="Orange Money" 
              amount="12,500 FCFA" 
              status="success" 
            />
          </div>
        </div>

        {/* Quick Actions / Mobile Ready */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-2">{lang === 'fr' ? 'Application Mobile' : 'Mobile App'}</h3>
              <p className="text-slate-400 text-sm mb-6">{lang === 'fr' ? 'Gérez votre boutique depuis votre smartphone, même avec une faible connexion.' : 'Manage your shop from your smartphone, even with a weak connection.'}</p>
              <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors">
                <Smartphone size={18} />
                {lang === 'fr' ? 'Télécharger l\'APK' : 'Download APK'}
              </button>
            </div>
            <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl"></div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">{lang === 'fr' ? 'Support Local' : 'Local Support'}</h3>
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl mb-3">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <MessageCircle size={20} />
              </div>
              <div>
                <p className="text-sm font-bold">{lang === 'fr' ? 'Assistance WhatsApp' : 'WhatsApp Support'}</p>
                <p className="text-xs text-slate-500">Réponse en moins de 2h</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 text-center">
              {lang === 'fr' ? 'Besoin d\'aide pour configurer vos paiements ?' : 'Need help setting up your payments?'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ icon, label, value, trend, color }: { icon: React.ReactNode, label: string, value: string, trend: string, color: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
          {trend}
        </span>
      </div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
      <h4 className="text-xl font-bold text-slate-900">{value}</h4>
    </div>
  );
}

function ActivityItem({ title, time, user, amount, status }: { title: string, time: string, user: string, amount: string, status: 'pending' | 'success' | 'failed' }) {
  return (
    <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`w-2 h-2 rounded-full ${status === 'success' ? 'bg-emerald-500' : status === 'pending' ? 'bg-amber-500' : 'bg-red-500'}`}></div>
        <div>
          <p className="text-sm font-bold text-slate-900">{title}</p>
          <p className="text-xs text-slate-500">{user} • {time}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-slate-900">{amount}</p>
      </div>
    </div>
  );
}

function PagesView({ lang }: { lang: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">{lang === 'fr' ? 'Gestion des Pages' : 'Page Management'}</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-900/10 hover:bg-emerald-700 transition-colors">
          <Plus size={18} />
          {lang === 'fr' ? 'Créer une page' : 'Create page'}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{lang === 'fr' ? 'Titre' : 'Title'}</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Slug</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <PageRow title="Accueil" slug="/" status="published" lang={lang} />
            <PageRow title="À Propos" slug="/a-propos" status="published" lang={lang} />
            <PageRow title="Services" slug="/services" status="published" lang={lang} />
            <PageRow title="Contact" slug="/contact" status="draft" lang={lang} />
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function PageRow({ title, slug, status, lang }: { title: string, slug: string, status: 'published' | 'draft', lang: string }) {
  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4">
        <p className="text-sm font-bold text-slate-900">{title}</p>
      </td>
      <td className="px-6 py-4">
        <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">{slug}</code>
      </td>
      <td className="px-6 py-4">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
          {status === 'published' ? (lang === 'fr' ? 'Publié' : 'Published') : 'Brouillon'}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">
            <Eye size={16} />
          </button>
          <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">
            <Settings size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

function ProductsView({ lang }: { lang: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">{lang === 'fr' ? 'Catalogue Produits' : 'Product Catalog'}</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-900/10 hover:bg-emerald-700 transition-colors">
          <Plus size={18} />
          {lang === 'fr' ? 'Ajouter un produit' : 'Add product'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ProductCard name="Huile de Baobab Bio" price="15,000 FCFA" stock={24} image="https://picsum.photos/seed/baobab/400/300" lang={lang} />
        <ProductCard name="Savon Noir Artisanal" price="2,500 FCFA" stock={150} image="https://picsum.photos/seed/soap/400/300" lang={lang} />
        <ProductCard name="Panier en Osier" price="8,000 FCFA" stock={12} image="https://picsum.photos/seed/basket/400/300" lang={lang} />
        <ProductCard name="Beurre de Karité" price="5,000 FCFA" stock={0} image="https://picsum.photos/seed/shea/400/300" lang={lang} />
      </div>
    </motion.div>
  );
}

function ProductCard({ name, price, stock, image, lang }: { name: string, price: string, stock: number, image: string, lang: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group">
      <div className="h-48 overflow-hidden relative">
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
        {stock === 0 && (
          <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
            <span className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              {lang === 'fr' ? 'Rupture de stock' : 'Out of stock'}
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h4 className="font-bold text-slate-900 mb-1">{name}</h4>
        <p className="text-emerald-600 font-bold text-lg mb-4">{price}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">Stock: <span className={stock > 0 ? 'text-slate-900 font-bold' : 'text-red-500 font-bold'}>{stock}</span></span>
          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
            <Settings size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function PaymentsView({ lang }: { lang: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">{lang === 'fr' ? 'Paiements & Transactions' : 'Payments & Transactions'}</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
            <Smartphone size={16} />
            <span className="text-xs font-bold">Mobile Money Active</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">{lang === 'fr' ? 'Historique des transactions' : 'Transaction History'}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{lang === 'fr' ? 'Méthode' : 'Method'}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Référence</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Montant</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <TransactionRow date="03 Mars 2024" method="Orange Money" ref="OM-89234" amount="15,000 FCFA" status="success" />
              <TransactionRow date="02 Mars 2024" method="MTN MoMo" ref="MTN-11209" amount="2,500 FCFA" status="success" />
              <TransactionRow date="02 Mars 2024" method="Carte Bancaire" ref="STR-9901" amount="45,000 FCFA" status="pending" />
              <TransactionRow date="01 Mars 2024" method="Wave" ref="WV-4451" amount="8,000 FCFA" status="success" />
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

function TransactionRow({ date, method, ref, amount, status }: { date: string, method: string, ref: string, amount: string, status: 'success' | 'pending' | 'failed' }) {
  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4 text-sm text-slate-600">{date}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center">
            <Smartphone size={12} className="text-slate-500" />
          </div>
          <span className="text-sm font-medium text-slate-900">{method}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-xs font-mono text-slate-500">{ref}</td>
      <td className="px-6 py-4 text-sm font-bold text-slate-900">{amount}</td>
      <td className="px-6 py-4">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${status === 'success' ? 'bg-emerald-100 text-emerald-700' : status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
          {status}
        </span>
      </td>
    </tr>
  );
}

function UsersView({ lang }: { lang: string }) {
  const users = [
    { id: 1, name: 'Mamadou Diallo', email: 'admin@kora.com', role: 'admin', status: 'active' },
    { id: 2, name: 'Awa Ndiaye', email: 'awa@kora.com', role: 'editor', status: 'active' },
    { id: 3, name: 'Ibrahima Fall', email: 'ibrahima@kora.com', role: 'contributor', status: 'inactive' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">{lang === 'fr' ? 'Gestion des Utilisateurs' : 'User Management'}</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-900/10 hover:bg-emerald-700 transition-colors">
          <Plus size={18} />
          {lang === 'fr' ? 'Ajouter un utilisateur' : 'Add user'}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Rôle</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-slate-900">{u.name}</p>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{u.email}</td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : u.role === 'editor' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${u.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">
                      <Settings size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role Permissions Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RoleInfoCard 
          role="Admin" 
          description={lang === 'fr' ? 'Accès complet à toutes les fonctionnalités.' : 'Full access to all features.'} 
          color="border-purple-200 bg-purple-50"
        />
        <RoleInfoCard 
          role="Editor" 
          description={lang === 'fr' ? 'Peut gérer les pages, le blog et les produits.' : 'Can manage pages, blog, and products.'} 
          color="border-blue-200 bg-blue-50"
        />
        <RoleInfoCard 
          role="Contributor" 
          description={lang === 'fr' ? 'Peut uniquement rédiger des articles de blog.' : 'Can only write blog posts.'} 
          color="border-slate-200 bg-slate-50"
        />
      </div>
    </motion.div>
  );
}

function RoleInfoCard({ role, description, color }: { role: string, description: string, color: string }) {
  return (
    <div className={`p-4 rounded-xl border ${color}`}>
      <h4 className="font-bold text-slate-900 mb-1">{role}</h4>
      <p className="text-xs text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}

function SettingsView({ lang }: { lang: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl space-y-8"
    >
      <div>
        <h2 className="text-2xl font-bold text-slate-900">{lang === 'fr' ? 'Paramètres de l\'entreprise' : 'Company Settings'}</h2>
        <p className="text-slate-500 text-sm">{lang === 'fr' ? 'Configurez l\'identité de votre marque et vos coordonnées.' : 'Configure your brand identity and contact details.'}</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">{lang === 'fr' ? 'Identité Visuelle' : 'Visual Identity'}</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Logo</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                    <ImageIcon size={24} />
                  </div>
                  <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors">
                    {lang === 'fr' ? 'Changer le logo' : 'Change logo'}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{lang === 'fr' ? 'Couleur Primaire' : 'Primary Color'}</label>
                  <div className="flex items-center gap-2">
                    <input type="color" defaultValue="#10b981" className="w-10 h-10 rounded-lg border-none cursor-pointer" />
                    <code className="text-xs text-slate-500">#10B981</code>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{lang === 'fr' ? 'Couleur Secondaire' : 'Secondary Color'}</label>
                  <div className="flex items-center gap-2">
                    <input type="color" defaultValue="#0f172a" className="w-10 h-10 rounded-lg border-none cursor-pointer" />
                    <code className="text-xs text-slate-500">#0F172A</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">{lang === 'fr' ? 'Coordonnées & Réseaux' : 'Contact & Socials'}</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{lang === 'fr' ? 'Numéro WhatsApp' : 'WhatsApp Number'}</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">+221</span>
              <input type="text" defaultValue="77 000 00 00" className="w-full pl-14 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Public</label>
            <input type="email" defaultValue="contact@pme-afrique.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Adresse Physique</label>
            <textarea defaultValue="Avenue Cheikh Anta Diop, Dakar, Sénégal" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all h-24 resize-none" />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors">
          {lang === 'fr' ? 'Annuler' : 'Cancel'}
        </button>
        <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-900/20 hover:bg-emerald-700 transition-colors">
          {lang === 'fr' ? 'Enregistrer les modifications' : 'Save Changes'}
        </button>
      </div>
    </motion.div>
  );
}

function PublicSitePreview({ onClose, lang }: { onClose: () => void, lang: string }) {
  return (
    <div className="fixed inset-0 bg-white z-[100] overflow-y-auto font-sans text-slate-900">
      {/* Admin Bar */}
      <div className="bg-slate-900 text-white px-6 py-2 flex items-center justify-between sticky top-0 z-[110]">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{lang === 'fr' ? 'Mode Prévisualisation' : 'Preview Mode'}</span>
          <div className="h-4 w-px bg-slate-700"></div>
          <span className="text-xs font-medium">pme-afrique.com</span>
        </div>
        <button 
          onClick={onClose}
          className="flex items-center gap-2 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-xs font-bold transition-colors"
        >
          <X size={14} />
          {lang === 'fr' ? 'Quitter la prévisualisation' : 'Exit Preview'}
        </button>
      </div>

      {/* Public Header */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center font-bold text-white">K</div>
          <span className="font-bold text-xl tracking-tight">Kora Demo PME</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-semibold text-emerald-600">{lang === 'fr' ? 'Accueil' : 'Home'}</a>
          <a href="#" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">{lang === 'fr' ? 'Services' : 'Services'}</a>
          <a href="#" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">{lang === 'fr' ? 'Boutique' : 'Shop'}</a>
          <a href="#" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Blog</a>
          <a href="#" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Contact</a>
        </nav>
        <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-emerald-900/10 hover:bg-emerald-700 transition-all">
          {lang === 'fr' ? 'Commander' : 'Order Now'}
        </button>
      </header>

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center px-6 md:px-20 overflow-hidden bg-slate-50">
        <div className="max-w-2xl relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-slate-900 leading-[1.1] mb-6"
          >
            {lang === 'fr' ? 'Le meilleur de l\'artisanat local' : 'The best of local craftsmanship'}
          </motion.h1>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            {lang === 'fr' ? 'Découvrez nos produits naturels et authentiques, fabriqués avec passion au Sénégal.' : 'Discover our natural and authentic products, made with passion in Senegal.'}
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-emerald-600 text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-emerald-900/20 hover:bg-emerald-700 transition-all">
              {lang === 'fr' ? 'Découvrir nos produits' : 'Explore products'}
            </button>
            <button className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-full font-bold hover:bg-slate-50 transition-all">
              {lang === 'fr' ? 'En savoir plus' : 'Learn more'}
            </button>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-1/2 h-full hidden lg:block">
          <img 
            src="https://picsum.photos/seed/africa/800/800" 
            alt="Hero" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 to-transparent"></div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 md:px-20 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Smartphone size={32} />
          </div>
          <h3 className="text-xl font-bold mb-3">{lang === 'fr' ? 'Paiement Mobile' : 'Mobile Payment'}</h3>
          <p className="text-slate-500">{lang === 'fr' ? 'Payez facilement via Orange Money ou MTN MoMo.' : 'Pay easily via Orange Money or MTN MoMo.'}</p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Globe size={32} />
          </div>
          <h3 className="text-xl font-bold mb-3">{lang === 'fr' ? 'Livraison Partout' : 'Delivery Everywhere'}</h3>
          <p className="text-slate-500">{lang === 'fr' ? 'Nous livrons dans toute la sous-région.' : 'We deliver throughout the sub-region.'}</p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Users size={32} />
          </div>
          <h3 className="text-xl font-bold mb-3">{lang === 'fr' ? 'Impact Local' : 'Local Impact'}</h3>
          <p className="text-slate-500">{lang === 'fr' ? 'Soutenez les artisans et producteurs locaux.' : 'Support local artisans and producers.'}</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-20 px-6 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center font-bold text-white">K</div>
              <span className="font-bold text-2xl tracking-tight">Kora Demo PME</span>
            </div>
            <p className="text-slate-400 max-w-sm">
              {lang === 'fr' ? 'La référence de l\'artisanat moderne en Afrique de l\'Ouest.' : 'The reference for modern craftsmanship in West Africa.'}
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Contact</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li>Dakar, Sénégal</li>
              <li>+221 77 000 00 00</li>
              <li>contact@pme-afrique.com</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Social</h4>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors cursor-pointer">F</div>
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors cursor-pointer">I</div>
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors cursor-pointer">W</div>
            </div>
          </div>
        </div>
        <div className="pt-12 border-t border-slate-800 text-center text-slate-500 text-xs">
          © 2024 Kora Demo PME. Propulsé par KoraCMS.
        </div>
      </footer>
    </div>
  );
}
