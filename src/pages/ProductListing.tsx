import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'motion/react';
import { Search, Filter, Star, ShoppingCart, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProductListing() {
  const [products, setProducts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get('/api/products'),
          axios.get('https://dummyjson.com/products/categories')
        ]);
        setProducts(prodRes.data.products);
        setFiltered(prodRes.data.products);
        setCategories(['All', ...catRes.data.map((c: any) => c.name)]);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = products;
    if (search) {
      result = result.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
    }
    if (category !== 'All') {
      result = result.filter(p => p.category === category);
    }
    setFiltered(result);
  }, [search, category, products]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 space-y-6 md:space-y-0">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Explore Products</h1>
          <p className="text-slate-400">Discover items curated by our AI engine</p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all w-full sm:w-64"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="pl-10 pr-8 py-3 bg-slate-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all appearance-none w-full sm:w-48"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {loading ? (
          [...Array(8)].map((_, i) => (
            <div key={i} className="h-96 bg-slate-900 rounded-2xl animate-pulse"></div>
          ))
        ) : (
          filtered.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (idx % 8) * 0.05 }}
              className="group bg-slate-900 border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all"
            >
              <Link to={`/products/${product.id}`} className="block relative aspect-square overflow-hidden">
                <img 
                  src={product.thumbnail} 
                  alt={product.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.discountPercentage > 15 && (
                  <div className="absolute top-3 left-3 px-2 py-1 bg-emerald-600 text-[10px] font-bold text-white rounded uppercase tracking-widest">
                    -{Math.round(product.discountPercentage)}%
                  </div>
                )}
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
      
      {!loading && filtered.length === 0 && (
        <div className="text-center py-24">
          <Search className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
          <p className="text-slate-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
