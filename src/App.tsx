import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  User, 
  LayoutDashboard, 
  ShieldCheck, 
  Search, 
  Bell, 
  ShoppingCart,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { UserProvider, useUser } from './context/UserContext';
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Dashboard from './pages/Dashboard';
import Privacy from './pages/Privacy';
import AdminAnalytics from './pages/AdminAnalytics';
import Login from './pages/Login';
import AIAssistantWidget from './components/AIAssistantWidget';

function Navbar() {
  const { user, logout } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Sparkles },
    { path: '/products', label: 'Shop', icon: ShoppingBag },
    { path: '/cart', label: 'Cart', icon: ShoppingCart },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/privacy', label: 'Privacy', icon: ShieldCheck },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">AuraRec</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                  location.pathname === item.path ? 'text-blue-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full"></span>
            </button>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                  <img src={user.image} alt={user.username} className="w-full h-full object-cover" />
                </Link>
                <button onClick={logout} className="text-xs text-slate-400 hover:text-white">Logout</button>
              </div>
            ) : (
              <Link to="/login" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Login
              </Link>
            )}
            
            <button className="md:hidden p-2 text-slate-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900 border-b border-white/10"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-4 text-base font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductListing />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/admin" element={<AdminAnalytics />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </main>
          <AIAssistantWidget />
          <ToastContainer position="bottom-right" theme="dark" />
        </div>
      </Router>
    </UserProvider>
  );
}
