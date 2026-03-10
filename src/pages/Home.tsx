import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import axios from 'axios';
import { Sparkles, TrendingUp, ArrowRight, Star, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function Home() {
  const { user } = useUser();
  const [recommended, setRecommended] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recRes, trendRes] = await Promise.all([
          axios.get(`/api/recommendations/${user?.id || 1}`),
          axios.get('/api/products')
        ]);
        setRecommended(recRes.data);
        setTrending(trendRes.data.products.slice(0, 6));
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1920" 
            className="w-full h-full object-cover opacity-40"
            alt="Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3 h-3" />
              <span>AI-Powered Personalization</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              Shop Smarter with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">AuraRec</span>
            </h1>
            <p className="text-xl text-slate-400 mb-10 leading-relaxed">
              Experience a shopping journey tailored uniquely to you. Our hybrid ML engine learns your preferences in real-time to deliver the perfect match.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/products" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 group">
                <span>Start Exploring</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/dashboard" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all text-center">
                View Your Insights
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recommended Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Sparkles className="text-emerald-400 w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Recommended For You</h2>
              <p className="text-sm text-slate-400">Based on your browsing history and preferences</p>
            </div>
          </div>
          <Link to="/products" className="text-blue-400 hover:text-blue-300 text-sm font-bold flex items-center space-x-1 transition-colors">
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="h-96 bg-slate-900 rounded-2xl animate-pulse"></div>
            ))
          ) : (
            recommended.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-slate-900 border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all"
              >
                <Link to={`/products/${product.id}`} className="block relative aspect-square overflow-hidden">
                  <img 
                    src={product.thumbnail} 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2 py-1 bg-blue-600 text-[10px] font-bold text-white rounded uppercase tracking-widest">
                    AI Pick
                  </div>
                </Link>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{product.category}</span>
                    <div className="flex items-center space-x-1 text-amber-400">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-xs font-bold">{product.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{product.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-white">${product.price}</span>
                    <button className="p-2 bg-white/5 hover:bg-blue-600 rounded-lg text-white transition-colors">
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Trending Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-2 bg-amber-500/20 rounded-lg">
            <TrendingUp className="text-amber-400 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Trending Now</h2>
            <p className="text-sm text-slate-400">Popular items across the AuraRec community</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {trending.map((product) => (
            <Link 
              key={product.id} 
              to={`/products/${product.id}`}
              className="flex items-center space-x-4 p-4 bg-slate-900/50 border border-white/5 rounded-2xl hover:bg-slate-900 transition-all"
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-white mb-1 line-clamp-1">{product.title}</h4>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-emerald-400 font-bold">${product.price}</span>
                  <span className="text-xs text-slate-500 line-through">${(product.price * 1.2).toFixed(2)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-current' : 'text-slate-700'}`} />
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
