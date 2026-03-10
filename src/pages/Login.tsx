import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Sparkles, Lock, User, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Login() {
  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilyspass');
  const [loading, setLoading] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error) {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-slate-900 border border-white/5 rounded-3xl p-10 shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="inline-flex p-3 bg-blue-600/20 rounded-2xl mb-6">
            <Sparkles className="text-blue-400 w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-500">Login to access your personalized picks</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-950 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-blue-500 transition-all"
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-950 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-blue-500 transition-all"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-slate-500 text-sm">
            Don't have an account? <span className="text-blue-400 font-bold cursor-pointer hover:underline">Sign up</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
