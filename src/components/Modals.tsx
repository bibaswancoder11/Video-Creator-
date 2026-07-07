import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Check, Download, Film, Music, Type } from 'lucide-react';

// Transition List
const TRANSITIONS = [
  { type: 'none', label: 'None', desc: 'Instant cut' },
  { type: 'fade', label: 'Fade', desc: 'Cross-dissolve opacity' },
  { type: 'slide', label: 'Slide', desc: 'Horizontal push' },
  { type: 'zoom', label: 'Zoom', desc: 'Scale transition' },
  { type: 'wipe', label: 'Wipe', desc: 'Linear wipe gradient' },
  { type: 'dissolve', label: 'Dissolve', desc: 'Pixelated blur blend' }
];

interface TransitionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: any) => void;
  currentType: string;
}

export function TransitionsModal({ isOpen, onClose, onSelect, currentType }: TransitionsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="w-full max-w-lg bg-[#10101e] border border-[#2D2D4A] rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#6366F1]" />
                <h3 className="text-lg font-black uppercase tracking-tight text-slate-100 font-display">Clip Transition</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#94A3B8] mb-4">
              Select an animation effect to blend the selected clip with the next scene:
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {TRANSITIONS.map((t) => {
                const isActive = currentType === t.type;
                return (
                  <button
                    key={t.type}
                    onClick={() => onSelect(t.type)}
                    className={`flex flex-col text-left p-3.5 rounded-xl border transition-all duration-200 ${
                      isActive
                        ? 'bg-[#6366F1]/10 border-[#6366F1] shadow-[0_0_12px_rgba(99,102,241,0.2)] text-white'
                        : 'bg-[#1A1A2E] border-[#2D2D4A] hover:border-[#6366F1]/40 text-[#94A3B8]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className={`font-black uppercase tracking-tight text-xs ${isActive ? 'text-[#6366F1]' : 'text-slate-200'}`}>
                        {t.label}
                      </span>
                      {isActive && <Check className="w-4 h-4 text-[#6366F1]" />}
                    </div>
                    <span className="text-[11px] text-[#94A3B8] leading-relaxed">{t.desc}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-slate-400 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Text Overlays
const TEXT_EFFECTS = [
  { type: 'fadein', label: 'Fade In', desc: 'Soft zoom & opacity lift' },
  { type: 'slide', label: 'Slide Up', desc: 'Bounce from below' },
  { type: 'bounce', label: 'Elastic Bounce', desc: 'Playful pop and settle' },
  { type: 'typewriter', label: 'Typewriter', desc: 'Character-by-character typing' },
  { type: 'zoom', label: 'Zoom In', desc: 'Impactful scale splash' }
];

const TEXT_COLORS = [
  '#FFFFFF', '#FFDE59', '#FF6B6B', '#4ECDC4', '#A855F7', '#F97316', '#10B981', '#00D2FF'
];

interface TextOverlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    text_content: string;
    effect_type: 'fadein' | 'slide' | 'bounce' | 'typewriter' | 'zoom';
    color: string;
    font_size: number;
    duration: number;
    position_x: number;
    position_y: number;
  }) => void;
}

export function TextOverlayModal({ isOpen, onClose, onSave }: TextOverlayModalProps) {
  const [textContent, setTextContent] = useState('');
  const [selectedEffect, setSelectedEffect] = useState<'fadein' | 'slide' | 'bounce' | 'typewriter' | 'zoom'>('fadein');
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [fontSize, setFontSize] = useState(28);
  const [duration, setDuration] = useState(3);
  const [posY, setPosY] = useState(70); // vertical position percentage

  const handleSave = () => {
    if (!textContent.trim()) return;
    onSave({
      text_content: textContent,
      effect_type: selectedEffect,
      color: selectedColor,
      font_size: fontSize,
      duration: duration,
      position_x: 50, // center horizontal
      position_y: posY
    });
    setTextContent('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="w-full max-w-lg bg-[#10101e] border border-[#2D2D4A] rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Type className="w-5 h-5 text-orange-400" />
                <h3 className="text-lg font-black uppercase tracking-tight text-slate-100 font-display">Add Animated Caption</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Text Area */}
              <div>
                <label className="block text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.2em] mb-2">
                  CAPTION TEXT
                </label>
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="ENTER OVERLAY TEXT..."
                  maxLength={100}
                  rows={2}
                  className="w-full bg-[#1A1A2E] border border-[#2D2D4A] rounded-xl p-3 text-slate-200 text-xs font-bold uppercase tracking-wide placeholder-slate-600 focus:outline-none focus:border-[#6366F1] transition-colors resize-none font-mono"
                />
              </div>

              {/* Text Color */}
              <div>
                <label className="block text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.2em] mb-2">
                  TEXT COLOR
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {TEXT_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      style={{ backgroundColor: c }}
                      className={`w-8 h-8 rounded-full transition-all duration-150 cursor-pointer ${
                        selectedColor === c
                          ? 'scale-110 ring-2 ring-[#6366F1] ring-offset-4 ring-offset-[#10101e]'
                          : 'opacity-80 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Anim Effect */}
              <div>
                <label className="block text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.2em] mb-2">
                  ANIMATION STYLE
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TEXT_EFFECTS.map((e) => {
                    const isAct = selectedEffect === e.type;
                    return (
                      <button
                        key={e.type}
                        onClick={() => setSelectedEffect(e.type as any)}
                        className={`flex flex-col text-left p-2.5 rounded-lg border transition-all duration-150 cursor-pointer ${
                          isAct
                            ? 'bg-[#6366F1]/10 border-[#6366F1] text-white shadow-lg'
                            : 'bg-[#1A1A2E] border-[#2D2D4A] hover:border-[#6366F1]/50 text-[#94A3B8]'
                        }`}
                      >
                        <span className="text-xs font-black uppercase tracking-tight">{e.label}</span>
                        <span className="text-[10px] text-[#94A3B8] mt-0.5">{e.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-2 gap-4 font-mono">
                <div>
                  <label className="block text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.2em] mb-1.5">
                    FONT SIZE: {fontSize}PX
                  </label>
                  <input
                    type="range"
                    min={16}
                    max={64}
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full accent-[#6366F1] h-1.5 bg-[#1A1A2E] rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.2em] mb-1.5">
                    SCREEN POSITION (Y): {posY}%
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={90}
                    value={posY}
                    onChange={(e) => setPosY(Number(e.target.value))}
                    className="w-full accent-[#6366F1] h-1.5 bg-[#1A1A2E] rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Duration Presets */}
              <div>
                <label className="block text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.2em] mb-2">
                  SHOW DURATION: {duration}S
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 5, 8].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-black transition-all duration-150 cursor-pointer ${
                        duration === d
                          ? 'bg-[#6366F1] border-[#6366F1] text-white shadow-lg'
                          : 'bg-[#1A1A2E] border-[#2D2D4A] hover:border-[#6366F1]/50 text-[#94A3B8]'
                      }`}
                    >
                      {d}s
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#2D2D4A]">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-[#94A3B8] hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!textContent.trim()}
                className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest bg-[#6366F1] hover:bg-[#6366F1]/90 text-white disabled:opacity-40 disabled:hover:bg-[#6366F1] transition-all duration-150 cursor-pointer"
              >
                Add Layer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Export modal
interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportComplete: () => void;
  projectTitle: string;
}

export function ExportModal({ isOpen, onClose, onExportComplete, projectTitle }: ExportModalProps) {
  const [resolution, setResolution] = useState('1080p');
  const [format, setFormat] = useState('mp4');
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  const RESOLUTIONS = [
    { key: '480p', label: '480p SD Mobile', sub: 'Instant encoding' },
    { key: '720p', label: '720p HD Standard', sub: 'Optimized size & quality' },
    { key: '1080p', label: '1080p Full HD Studio', sub: 'Crystal-clear master file' }
  ];

  const STATUS_LOGS = [
    'Parsing project timeline track layout...',
    'Loading video and photo assets to buffer...',
    'Analyzing audio wave amplitudes...',
    'Splicing transitions and cross-fades...',
    'Rasterizing vector text typography canvases...',
    'Encoding MP4 audio/video frame muxer...',
    'Completing layout render block assembly...',
    'Finalizing container file metadata wrapping...'
  ];

  useEffect(() => {
    if (!isExporting) return;

    let logIdx = 0;
    setStatusMessage(STATUS_LOGS[0]);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 5) + 3;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsExporting(false);
            onExportComplete();
            setProgress(0);
          }, 600);
          return 100;
        }

        // Cycle statuses based on progress
        const targetLogIdx = Math.min(
          STATUS_LOGS.length - 1,
          Math.floor((next / 100) * STATUS_LOGS.length)
        );
        if (targetLogIdx !== logIdx) {
          logIdx = targetLogIdx;
          setStatusMessage(STATUS_LOGS[targetLogIdx]);
        }

        return next;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isExporting]);

  const handleStartExport = () => {
    setIsExporting(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="w-full max-w-lg bg-[#10101e] border border-[#2D2D4A] rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black uppercase tracking-tight text-slate-100 font-display">Export Studio</h3>
              {!isExporting && (
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {isExporting ? (
              <div className="py-8 flex flex-col items-center">
                <div className="relative w-28 h-28 mb-6 flex items-center justify-center">
                  {/* Outer spinning ring */}
                  <div className="absolute inset-0 rounded-full border-4 border-slate-850" />
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                      cx="56"
                      cy="56"
                      r="52"
                      fill="transparent"
                      stroke="#6366f1"
                      strokeWidth="4"
                      strokeDasharray={326.7}
                      strokeDashoffset={326.7 - (326.7 * progress) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-black text-white">{progress}%</span>
                    <span className="text-[10px] text-[#94A3B8] font-black uppercase tracking-widest">render</span>
                  </div>
                </div>

                <h4 className="text-base font-black uppercase tracking-tight text-slate-200 mb-1 animate-pulse font-display">
                  Encoding Movie Tracks
                </h4>
                <p className="text-xs text-[#6366F1] text-center max-w-sm italic h-6">
                  {statusMessage}
                </p>

                <div className="w-full bg-[#1A1A2E] border border-[#2D2D4A] p-4 rounded-xl mt-6 space-y-2 font-mono">
                  <div className="flex justify-between text-[11px] text-[#94A3B8]">
                    <span>Project: {projectTitle}</span>
                    <span>Codec: H.264 Audio/Video Multiplex</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-150"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.2em] mb-3">
                    EXPORT RESOLUTION
                  </label>
                  <div className="space-y-2.5">
                    {RESOLUTIONS.map((res) => {
                      const isAct = resolution === res.key;
                      return (
                        <button
                          key={res.key}
                          onClick={() => setResolution(res.key)}
                          className={`w-full flex items-center p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                            isAct
                              ? 'bg-[#6366F1]/10 border-[#6366F1] text-white shadow-[0_0_12px_rgba(99,102,241,0.15)]'
                              : 'bg-[#1A1A2E] border-[#2D2D4A] hover:border-[#6366F1]/40 text-[#94A3B8]'
                          }`}
                        >
                          <div className="flex items-center gap-3.5 flex-1">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isAct ? 'border-[#6366F1]' : 'border-slate-600'}`}>
                              {isAct && <div className="w-2.5 h-2.5 rounded-full bg-[#6366F1]" />}
                            </div>
                            <div>
                              <p className={`text-sm font-black uppercase tracking-tight ${isAct ? 'text-[#6366F1]' : 'text-slate-350'}`}>
                                {res.label}
                              </p>
                              <p className="text-xs text-[#94A3B8] mt-0.5">{res.sub}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.2em] mb-2.5">
                    OUTPUT FORMAT
                  </label>
                  <div className="flex gap-3">
                    {['mp4', 'mov'].map((f) => {
                      const isAct = format === f;
                      return (
                        <button
                          key={f}
                          onClick={() => setFormat(f)}
                          className={`flex-1 py-3 rounded-xl border font-black text-xs uppercase tracking-widest transition-all duration-150 text-center cursor-pointer ${
                            isAct
                              ? 'bg-[#6366F1] border-[#6366F1] text-white shadow-lg shadow-indigo-600/20'
                              : 'bg-[#1A1A2E] border-[#2D2D4A] hover:border-[#6366F1]/50 text-[#94A3B8]'
                          }`}
                        >
                          .{f.toUpperCase()} (H.264)
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#2D2D4A] flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-[#94A3B8] bg-slate-900/60 hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStartExport}
                    className="flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-[#6366F1] hover:bg-[#6366F1]/90 text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/25 cursor-pointer animate-pulse"
                  >
                    <Download className="w-4 h-4" />
                    Render Composition
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
