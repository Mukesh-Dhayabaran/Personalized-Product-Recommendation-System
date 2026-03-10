import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import axios from 'axios';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Activity, 
  Target, 
  TrendingUp, 
  Users, 
  Zap, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function AdminAnalytics() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await axios.get('/api/analytics/metrics');
        setMetrics(res.data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const trainingData = [
    { epoch: 1, loss: 0.65, val_loss: 0.68 },
    { epoch: 2, loss: 0.58, val_loss: 0.62 },
    { epoch: 3, loss: 0.52, val_loss: 0.55 },
    { epoch: 4, loss: 0.48, val_loss: 0.51 },
    { epoch: 5, loss: 0.45, val_loss: 0.49 },
    { epoch: 6, loss: 0.42, val_loss: 0.47 },
    { epoch: 7, loss: 0.39, val_loss: 0.45 },
    { epoch: 8, loss: 0.37, val_loss: 0.44 },
    { epoch: 9, loss: 0.35, val_loss: 0.43 },
    { epoch: 10, loss: 0.33, val_loss: 0.42 },
  ];

  const splitData = [
    { name: 'Training', value: 70 },
    { name: 'Validation', value: 15 },
    { name: 'Test', value: 15 },
  ];

  if (loading && !metrics) return <div className="h-screen flex items-center justify-center text-blue-500">Initializing Analytics...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">ML Engine Analytics</h1>
          <p className="text-slate-400">Real-time performance monitoring of AuraRec hybrid models</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-all">
          <RefreshCw className="w-4 h-4" />
          <span>Force Retrain</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <MetricCard 
          title="Precision@10" 
          value={`${(metrics?.precision * 100).toFixed(1)}%`} 
          icon={Target} 
          color="blue" 
          trend="+2.4%"
        />
        <MetricCard 
          title="Recall@10" 
          value={`${(metrics?.recall * 100).toFixed(1)}%`} 
          icon={Zap} 
          color="emerald" 
          trend="+1.8%"
        />
        <MetricCard 
          title="NDCG@10" 
          value={metrics?.ndcg.toFixed(2)} 
          icon={Activity} 
          color="amber" 
          trend="+0.05"
        />
        <MetricCard 
          title="Conversion Rate" 
          value={`${metrics?.conversionRate.toFixed(1)}%`} 
          icon={TrendingUp} 
          color="violet" 
          trend="+12%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Training History */}
        <div className="bg-slate-900 border border-white/5 rounded-3xl p-8">
          <h3 className="text-xl font-bold text-white mb-8">Neural CF Training History</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trainingData}>
                <defs>
                  <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="epoch" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="loss" stroke="#3B82F6" fillOpacity={1} fill="url(#colorLoss)" strokeWidth={3} />
                <Area type="monotone" dataKey="val_loss" stroke="#10B981" fill="transparent" strokeWidth={3} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-slate-400">Training Loss</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 border-2 border-emerald-500 rounded-full border-dashed"></div>
              <span className="text-xs text-slate-400">Validation Loss</span>
            </div>
          </div>
        </div>

        {/* Data Split */}
        <div className="bg-slate-900 border border-white/5 rounded-3xl p-8">
          <h3 className="text-xl font-bold text-white mb-8">Data Pipeline Split</h3>
          <div className="flex items-center h-80">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={splitData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {splitData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-6">
              {splitData.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS[i] }}></div>
                    <span className="text-slate-300 font-medium">{item.name}</span>
                  </div>
                  <span className="text-white font-bold">{item.value}%</span>
                </div>
              ))}
              <div className="pt-6 border-t border-white/5">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Strict 70/15/15 split enforced to prevent data leakage and ensure unbiased evaluation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Performance Table */}
      <div className="bg-slate-900 border border-white/5 rounded-3xl overflow-hidden">
        <div className="p-8 border-b border-white/5">
          <h3 className="text-xl font-bold text-white">Hybrid Model Components</h3>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 text-slate-400 text-xs uppercase tracking-widest">
              <th className="px-8 py-4 font-bold">Model Component</th>
              <th className="px-8 py-4 font-bold">Weight</th>
              <th className="px-8 py-4 font-bold">Latency</th>
              <th className="px-8 py-4 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <ModelRow name="Collaborative Filtering (SVD)" weight="35%" latency="12ms" status="Optimal" />
            <ModelRow name="Neural Collaborative Filtering" weight="30%" latency="45ms" status="Training" />
            <ModelRow name="Content-Based (TF-IDF)" weight="20%" latency="8ms" status="Optimal" />
            <ModelRow name="Behavioral Scorer" weight="15%" latency="2ms" status="Active" />
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, color, trend }: any) {
  const colors: any = {
    blue: 'bg-blue-500/20 text-blue-400',
    emerald: 'bg-emerald-500/20 text-emerald-400',
    amber: 'bg-amber-500/20 text-amber-400',
    violet: 'bg-violet-500/20 text-violet-400',
  };

  return (
    <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className="text-emerald-400 text-xs font-bold">{trend}</span>
      </div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

function ModelRow({ name, weight, latency, status }: any) {
  return (
    <tr className="hover:bg-white/5 transition-colors">
      <td className="px-8 py-6">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-white font-medium">{name}</span>
        </div>
      </td>
      <td className="px-8 py-6 text-slate-400 font-mono">{weight}</td>
      <td className="px-8 py-6 text-slate-400 font-mono">{latency}</td>
      <td className="px-8 py-6">
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
          status === 'Optimal' ? 'bg-emerald-500/10 text-emerald-400' : 
          status === 'Training' ? 'bg-amber-500/10 text-amber-400 animate-pulse' : 
          'bg-blue-500/10 text-blue-400'
        }`}>
          {status}
        </span>
      </td>
    </tr>
  );
}
