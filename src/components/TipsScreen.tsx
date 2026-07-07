import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Film, Music, Shuffle, Type, Eye, Download, Star } from 'lucide-react';
import { Project, Clip, AudioTrack, TextOverlay } from '../types';

interface TipsScreenProps {
  onQuickDemo: () => void;
}

const TIPS = [
  {
    icon: Film,
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    title: 'Import Media Tracks',
    body: 'Click "Video" or "Photo" in the toolbar to load media. You can choose from gorgeous predefined cinematic scenes, or upload your own files.'
  },
  {
    icon: Music,
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    title: 'Blend Soundtrack Layers',
    body: 'Add background music by clicking "Audio". Each track comes with live individual volume sliders to blend voiceovers and ambient soundscapes perfectly.'
  },
  {
    icon: Shuffle,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    title: 'Smooth Transitions',
    body: 'Select any clip on your timeline, click the "Trans" icon, and choose a transition style like Fade, Zoom, or Dissolve to create cinematic flows.'
  },
  {
    icon: Type,
    color: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    title: 'Animated Kinetic Typography',
    body: 'Add animated text overlays. Pick from a vibrant spectrum of colors, adjust font size, and set kinetic animations like Bounce or Typewriter.'
  },
  {
    icon: Download,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    title: 'Render Studio Exports',
    body: 'Export your finished movie at 480p, 720p HD, or 1080p Studio quality in MP4 or MOV container codecs with an interactive rendering sequence.'
  }
];

export function TipsScreen({ onQuickDemo }: TipsScreenProps) {
  return (
    <div className="flex-1 overflow-y-auto pb-24 bg-[#0A0A1A]">
      {/* Header */}
      <div className="py-5 px-6 bg-[#10101e] border-b border-[#2D2D4A] sticky top-0 backdrop-blur-md z-10 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <h1 className="text-2.5xl md:text-3xl font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-[#6366F1] to-[#A855F7] font-display">
            VIDEOCREATOR
          </h1>
          <span className="hidden md:inline-block text-[10px] font-black uppercase tracking-[0.25em] text-[#94A3B8] border-l border-[#2D2D4A] pl-5">
            CREATION GUIDES
          </span>
        </div>
      </div>

      <div className="p-6 max-w-2xl mx-auto space-y-6">
        {/* Banner with Template Loader */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-indigo-950/30 via-purple-950/20 to-[#10101E] border border-[#2D2D4A] rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles className="w-24 h-24 text-indigo-400" />
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-400/20 rounded-xl">
              <Star className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-black uppercase tracking-tight text-slate-100 font-display">Instantly Try a Demo</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed mt-1.5 mb-4">
                Skip the blank canvas! Load a pre-configured multi-track cinematic template with cyberpunk city footage, lofi soundtracks, cross-fades, and typewriter titles.
              </p>
              <button
                onClick={onQuickDemo}
                className="px-5 py-3 text-xs font-black uppercase tracking-widest bg-[#6366F1] hover:bg-[#6366F1]/90 text-white rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95 cursor-pointer"
              >
                Launch Demo Project
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tips List */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black tracking-[0.2em] text-[#94A3B8] uppercase">
            TIPS & TRICKS
          </h4>
          
          {TIPS.map((tip, index) => {
            const IconComponent = tip.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="bg-[#0F0F1E] border border-[#2D2D4A] p-5 rounded-2xl flex items-start gap-4 hover:border-[#6366F1]/40 transition-all"
              >
                <div className={`p-3 rounded-xl border flex-shrink-0 ${tip.color}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-black uppercase tracking-tight text-slate-100 text-sm font-display">{tip.title}</h5>
                  <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">{tip.body}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Pro Tip */}
        <div className="bg-[#1A1A2E]/30 border border-amber-500/20 rounded-xl p-4">
          <p className="text-xs text-amber-300 leading-relaxed">
            <span className="font-bold text-amber-400">PRO TIP: </span>
            You can create multiple visual and acoustic timelines. Each project stores its custom assets, text animation parameters, volume levels, and crossfade cuts completely independently in your sandbox.
          </p>
        </div>
      </div>
    </div>
  );
}
