import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import axios from 'axios';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  CreditCard,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { toast } from 'react-toastify';

export default function Cart() {
  const { user } = useUser();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`https://dummyjson.com/carts/user/${user.id}`);
        setCart(res.data.carts[0] || { products: [], total: 0, totalProducts: 0 });
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [user]);

  const removeItem = (id: number) => {
    setCart((prev: any) => ({
      ...prev,
      products: prev.products.filter((p: any) => p.id !== id),
      total: prev.total - (prev.products.find((p: any) => p.id === id)?.total || 0)
    }));
    toast.info('Item removed from cart');
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-blue-500">Loading Cart...</div>;

  if (!user) return (
    <div className="max-w-7xl mx-auto px-4 py-24 text-center">
      <ShoppingBag className="w-16 h-16 text-slate-700 mx-auto mb-6" />
      <h2 className="text-3xl font-bold text-white mb-4">Your cart is empty</h2>
      <p className="text-slate-400 mb-8">Login to see your saved items and personalized deals</p>
      <Link to="/login" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all">
        Login Now
      </Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-white mb-12">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart?.products.length > 0 ? (
            cart.products.map((item: any) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-6 p-6 bg-slate-900 border border-white/5 rounded-3xl"
              >
                <div className="w-24 h-24 bg-white/5 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={`https://dummyjson.com/products/${item.id}/thumbnail`} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-slate-500 text-sm mb-4">Unit Price: ${item.price}</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center bg-white/5 rounded-lg border border-white/10">
                      <button className="p-2 hover:text-blue-400 transition-colors"><Minus className="w-4 h-4" /></button>
                      <span className="px-4 font-bold text-white">{item.quantity}</span>
                      <button className="p-2 hover:text-blue-400 transition-colors"><Plus className="w-4 h-4" /></button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-white">${item.total}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-24 bg-slate-900/50 rounded-3xl border border-dashed border-white/10">
              <p className="text-slate-500">No items in your cart yet</p>
              <Link to="/products" className="text-blue-400 font-bold mt-4 inline-block">Start Shopping</Link>
            </div>
          )}

          {/* AI Nudge */}
          <div className="p-6 bg-gradient-to-r from-blue-600/10 to-transparent border border-blue-500/20 rounded-3xl flex items-center space-x-4">
            <div className="p-3 bg-blue-500/20 rounded-2xl">
              <Sparkles className="text-blue-400 w-6 h-6" />
            </div>
            <div>
              <p className="text-white font-bold">Smart Savings Applied</p>
              <p className="text-slate-400 text-sm">We've automatically applied the best discounts based on your profile.</p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-white/5 rounded-3xl p-8 sticky top-28">
            <h3 className="text-xl font-bold text-white mb-8">Order Summary</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="text-white font-medium">${cart?.total || 0}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span>
                <span className="text-emerald-400 font-medium">FREE</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tax</span>
                <span className="text-white font-medium">$0.00</span>
              </div>
              <div className="pt-4 border-t border-white/5 flex justify-between">
                <span className="text-lg font-bold text-white">Total</span>
                <span className="text-2xl font-bold text-blue-400">${cart?.total || 0}</span>
              </div>
            </div>
            <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Checkout Now</span>
            </button>
            <Link to="/products" className="w-full mt-4 py-4 text-slate-400 font-bold text-center block hover:text-white transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
