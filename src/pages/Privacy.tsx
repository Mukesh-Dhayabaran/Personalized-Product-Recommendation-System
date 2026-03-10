import { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Eye, Trash2, Lock, Info, ArrowRight } from 'lucide-react';

export default function Privacy() {
  const [optOuts, setOptOuts] = useState({
    behavioral: false,
    contextual: false,
    sentiment: false,
    location: true
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <div className="inline-flex p-4 bg-blue-500/20 rounded-3xl mb-6">
          <ShieldCheck className="text-blue-400 w-12 h-12" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Privacy & Data Control</h1>
        <p className="text-slate-400 text-lg">You are in control of your data. Manage how AuraRec uses your information to personalize your experience.</p>
      </div>

      <div className="space-y-8">
        {/* Data Summary */}
        <div className="bg-slate-900 border border-white/5 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white flex items-center space-x-3">
              <Eye className="text-emerald-400 w-6 h-6" />
              <span>Your Data Summary</span>
            </h3>
            <button className="text-blue-400 text-sm font-bold hover:underline">Download Data Report</button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <DataStat label="Behavioral Events" value="1,248" />
            <DataStat label="Product Interactions" value="452" />
            <DataStat label="Search Queries" value="89" />
          </div>
        </div>

        {/* Controls */}
        <div className="bg-slate-900 border border-white/5 rounded-3xl p-8">
          <h3 className="text-xl font-bold text-white mb-8 flex items-center space-x-3">
            <Lock className="text-amber-400 w-6 h-6" />
            <span>Personalization Controls</span>
          </h3>
          
          <div className="space-y-6">
            <ToggleItem 
              title="Behavioral Tracking" 
              desc="Allow us to learn from your clicks, time on page, and scroll depth to improve recommendations."
              enabled={!optOuts.behavioral}
              onToggle={() => setOptOuts(prev => ({ ...prev, behavioral: !prev.behavioral }))}
            />
            <ToggleItem 
              title="Contextual Signals" 
              desc="Use your device type, time of day, and location to provide relevant contextual picks."
              enabled={!optOuts.contextual}
              onToggle={() => setOptOuts(prev => ({ ...prev, contextual: !prev.contextual }))}
            />
            <ToggleItem 
              title="Sentiment Analysis" 
              desc="Analyze your reviews and feedback to better understand your preferences."
              enabled={!optOuts.sentiment}
              onToggle={() => setOptOuts(prev => ({ ...prev, sentiment: !prev.sentiment }))}
            />
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-8">
          <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center space-x-3">
            <Trash2 className="w-6 h-6" />
            <span>Danger Zone</span>
          </h3>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Deleting your data will permanently remove your behavioral history and reset your recommendation profile. This action cannot be undone.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="px-6 py-3 bg-red-600/10 text-red-400 font-bold rounded-xl border border-red-500/20 hover:bg-red-600/20 transition-all">
              Delete All Activity
            </button>
            <button className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all">
              Close Account
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex items-start space-x-4">
          <Info className="text-blue-400 w-6 h-6 flex-shrink-0 mt-1" />
          <div className="text-sm text-slate-400 leading-relaxed">
            AuraRec complies with GDPR and CCPA regulations. We do not sell your personal information to third parties. Your data is used exclusively to enhance your shopping experience on our platform.
          </div>
        </div>
      </div>
    </div>
  );
}

function DataStat({ label, value }: any) {
  return (
    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function ToggleItem({ title, desc, enabled, onToggle }: any) {
  return (
    <div className="flex items-start justify-between">
      <div className="max-w-md">
        <h4 className="text-white font-bold mb-1">{title}</h4>
        <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
      </div>
      <button 
        onClick={onToggle}
        className={`w-12 h-6 rounded-full relative transition-colors ${enabled ? 'bg-blue-600' : 'bg-slate-700'}`}
      >
        <motion.div 
          animate={{ x: enabled ? 26 : 2 }}
          className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-lg"
        />
      </button>
    </div>
  );
}
