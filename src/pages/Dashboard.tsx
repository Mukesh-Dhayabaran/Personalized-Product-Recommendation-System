import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Settings, 
  History, 
  Heart, 
  PieChart as PieIcon,
  TrendingUp,
  Clock,
  MapPin,
  Mail,
  Phone,
  ShoppingBag
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { useUser } from '../context/UserContext';

export default function Dashboard() {
  const { user } = useUser();
  
  const interestData = [
    { subject: 'Tech', A: 120, fullMark: 150 },
    { subject: 'Fashion', A: 98, fullMark: 150 },
    { subject: 'Home', A: 86, fullMark: 150 },
    { subject: 'Beauty', A: 99, fullMark: 150 },
    { subject: 'Sports', A: 85, fullMark: 150 },
    { subject: 'Food', A: 65, fullMark: 150 },
  ];

  const activityData = [
    { day: 'Mon', views: 12 },
    { day: 'Tue', views: 19 },
    { day: 'Wed', views: 15 },
    { day: 'Thu', views: 22 },
    { day: 'Fri', views: 30 },
    { day: 'Sat', views: 25 },
    { day: 'Sun', views: 18 },
  ];

  if (!user) return <div className="h-screen flex items-center justify-center">Please login to view dashboard</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Profile Sidebar */}
        <div className="space-y-8">
          <div className="bg-slate-900 border border-white/5 rounded-3xl p-8 text-center">
            <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-6 border-4 border-blue-600/20">
              <img src={user.image} alt={user.username} className="w-full h-full object-cover" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{user.firstName} {user.lastName}</h2>
            <p className="text-slate-500 mb-6">@{user.username}</p>
            <div className="flex justify-center space-x-4">
              <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-slate-400 hover:text-white">
                <Settings className="w-5 h-5" />
              </button>
              <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all">
                Edit Profile
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-white/5 rounded-3xl p-8 space-y-6">
            <h3 className="text-lg font-bold text-white mb-4">Contact Info</h3>
            <div className="flex items-center space-x-4 text-slate-400">
              <Mail className="w-5 h-5 text-blue-400" />
              <span className="text-sm">{user.email}</span>
            </div>
            <div className="flex items-center space-x-4 text-slate-400">
              <Phone className="w-5 h-5 text-emerald-400" />
              <span className="text-sm">{user.phone}</span>
            </div>
            <div className="flex items-center space-x-4 text-slate-400">
              <MapPin className="w-5 h-5 text-amber-400" />
              <span className="text-sm">{user.address?.city}, {user.address?.state}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard title="Total Orders" value="24" icon={History} color="blue" />
            <StatCard title="Wishlist Items" value="12" icon={Heart} color="emerald" />
            <StatCard title="Avg. Rating" value="4.8" icon={TrendingUp} color="amber" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900 border border-white/5 rounded-3xl p-8">
              <h3 className="text-lg font-bold text-white mb-8 flex items-center space-x-2">
                <PieIcon className="w-5 h-5 text-blue-400" />
                <span>Interest Profile</span>
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={interestData}>
                    <PolarGrid stroke="#1e293b" />
                    <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={10} />
                    <Radar
                      name="Interests"
                      dataKey="A"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.5}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-900 border border-white/5 rounded-3xl p-8">
              <h3 className="text-lg font-bold text-white mb-8 flex items-center space-x-2">
                <Clock className="w-5 h-5 text-emerald-400" />
                <span>Weekly Activity</span>
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    />
                    <Bar dataKey="views" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-slate-900 border border-white/5 rounded-3xl p-8">
            <h3 className="text-lg font-bold text-white mb-8">Recent Activity</h3>
            <div className="space-y-6">
              <ActivityItem 
                title="Purchased iPhone 15 Pro" 
                time="2 hours ago" 
                type="purchase" 
              />
              <ActivityItem 
                title="Added Sony WH-1000XM5 to wishlist" 
                time="Yesterday" 
                type="wishlist" 
              />
              <ActivityItem 
                title="Viewed Samsung 98' QLED TV" 
                time="2 days ago" 
                type="view" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  const colors: any = {
    blue: 'bg-blue-500/20 text-blue-400',
    emerald: 'bg-emerald-500/20 text-emerald-400',
    amber: 'bg-amber-500/20 text-amber-400',
  };

  return (
    <div className="bg-slate-900 border border-white/5 rounded-3xl p-6">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${colors[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function ActivityItem({ title, time, type }: any) {
  const icons: any = {
    purchase: { icon: ShoppingBag, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    wishlist: { icon: Heart, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    view: { icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  };

  const { icon: Icon, color, bg } = icons[type];

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-xl ${bg}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <div>
          <p className="text-white font-medium">{title}</p>
          <p className="text-slate-500 text-xs">{time}</p>
        </div>
      </div>
      <button className="text-slate-500 hover:text-white transition-colors">
        <Settings className="w-4 h-4" />
      </button>
    </div>
  );
}
