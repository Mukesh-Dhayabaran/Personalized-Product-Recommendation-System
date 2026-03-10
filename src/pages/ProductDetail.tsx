import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'motion/react';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { useBehaviorTracking } from '../hooks/useBehaviorTracking';
import { toast } from 'react-toastify';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [similar, setSimilar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');

  useBehaviorTracking(id ? parseInt(id) : undefined);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, simRes] = await Promise.all([
          axios.get(`/api/products/${id}`),
          axios.get(`/api/similar/${id}`)
        ]);
        setProduct(prodRes.data);
        setSimilar(simRes.data);
        setActiveImage(prodRes.data.thumbnail);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const addToCart = () => {
    toast.success('Added to cart!');
    // Tracking event for cart add
    axios.post('/api/track', {
      product_id: parseInt(id!),
      event_type: 'cart_add',
      added_to_cart: 1
    });
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-blue-500">Loading...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
        {/* Image Gallery */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square rounded-3xl overflow-hidden bg-slate-900 border border-white/5"
          >
            <img src={activeImage} alt={product.title} className="w-full h-full object-contain p-8" />
          </motion.div>
          <div className="grid grid-cols-4 gap-4">
            {product.images?.map((img: string, i: number) => (
              <button 
                key={i}
                onClick={() => setActiveImage(img)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-blue-500' : 'border-transparent opacity-50 hover:opacity-100'}`}
              >
                <img src={img} alt={`${product.title} ${i}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-full uppercase tracking-widest">
                {product.category}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 text-sm font-medium">{product.brand}</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">{product.title}</h1>
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-current' : 'opacity-30'}`} />
                ))}
                <span className="ml-2 text-white font-bold">{product.rating}</span>
              </div>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400 text-sm">{product.reviews?.length || 0} Reviews</span>
            </div>
            <div className="flex items-baseline space-x-4">
              <span className="text-5xl font-bold text-white">${product.price}</span>
              {product.discountPercentage > 0 && (
                <span className="text-emerald-400 font-bold">-{product.discountPercentage}% OFF</span>
              )}
            </div>
          </div>

          <p className="text-slate-400 leading-relaxed mb-10 text-lg">
            {product.description}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="p-4 bg-slate-900 rounded-2xl border border-white/5 flex items-center space-x-3">
              <Truck className="text-blue-400 w-6 h-6" />
              <div>
                <p className="text-white font-bold text-sm">Fast Delivery</p>
                <p className="text-slate-500 text-xs">2-3 business days</p>
              </div>
            </div>
            <div className="p-4 bg-slate-900 rounded-2xl border border-white/5 flex items-center space-x-3">
              <RotateCcw className="text-emerald-400 w-6 h-6" />
              <div>
                <p className="text-white font-bold text-sm">Free Returns</p>
                <p className="text-slate-500 text-xs">30-day window</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button 
              onClick={addToCart}
              className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Add to Cart</span>
            </button>
            <button className="p-4 bg-white/5 border border-white/10 text-white rounded-2xl hover:bg-white/10 transition-all">
              <Heart className="w-6 h-6" />
            </button>
          </div>

          {/* AI Insights */}
          <div className="mt-12 p-6 bg-gradient-to-br from-blue-600/10 to-emerald-600/10 border border-blue-500/20 rounded-3xl">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="text-blue-400 w-5 h-5" />
              <h3 className="text-lg font-bold text-white">AuraRec Insights</h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              This product matches your interest in <span className="text-blue-400 font-bold">{product.category}</span>. 
              Sentiment analysis of {product.reviews?.length} reviews shows a <span className="text-emerald-400 font-bold">highly positive</span> reception for its quality and value.
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <Info className="w-4 h-4" />
              <span>Recommended based on your recent browsing of similar tech items.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      <section>
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Sparkles className="text-blue-400 w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">You Might Also Like</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {similar.map((item) => (
            <motion.div 
              key={item.id}
              whileHover={{ y: -5 }}
              className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden"
            >
              <a href={`/products/${item.id}`} className="block aspect-square">
                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
              </a>
              <div className="p-3">
                <h4 className="text-sm font-bold text-white line-clamp-1 mb-1">{item.title}</h4>
                <p className="text-emerald-400 font-bold text-xs">${item.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
