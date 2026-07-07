import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, Play, Pause, RotateCcw, Download, Video, Image, Music, Type, 
  Trash2, Sliders, Volume2, Sparkles, Plus, Check, Loader, FileVideo, 
  HelpCircle, Shuffle, ChevronRight, Layers, VolumeX, Upload, Maximize2, Minimize2
} from 'lucide-react';
import { Project, Clip, AudioTrack, TextOverlay, StockAsset } from '../types';
import { STOCK_VIDEOS, STOCK_PHOTOS, STOCK_AUDIO } from '../utils/stockAssets';
import { TransitionsModal, TextOverlayModal, ExportModal } from './Modals';

interface EditorScreenProps {
  project: Project;
  onGoBack: () => void;
  onUpdateProjectDuration: (projectId: string, duration: number) => void;
  clips: Clip[];
  audioTracks: AudioTrack[];
  textOverlays: TextOverlay[];
  onAddClip: (clip: Omit<Clip, 'id'>) => void;
  onDeleteClip: (id: string) => void;
  onUpdateClipTransition: (id: string, transition: Clip['transition_type']) => void;
  onAddAudio: (audio: Omit<AudioTrack, 'id'>) => void;
  onDeleteAudio: (id: string) => void;
  onUpdateAudioVolume: (id: string, volume: number) => void;
  onAddText: (text: Omit<TextOverlay, 'id'>) => void;
  onDeleteText: (id: string) => void;
}

export function EditorScreen({
  project,
  onGoBack,
  onUpdateProjectDuration,
  clips,
  audioTracks,
  textOverlays,
  onAddClip,
  onDeleteClip,
  onUpdateClipTransition,
  onAddAudio,
  onDeleteAudio,
  onUpdateAudioVolume,
  onAddText,
  onDeleteText
}: EditorScreenProps) {
  // Navigation & UI States
  const [isPlaying, setIsPlaying] = useState(false);
  const [playheadPos, setPlayheadPos] = useState(0);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [selectedAudioId, setSelectedAudioId] = useState<string | null>(null);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);

  // Modal Triggers
  const [showTransModal, setShowTransModal] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Asset Picker Drawer
  const [importDrawer, setImportDrawer] = useState<'video' | 'photo' | 'audio' | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Full Screen States & Ref
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (document.fullscreenElement === playerContainerRef.current) {
        setIsFullscreen(true);
      } else {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    
    const isCurrentlyNative = !!document.fullscreenElement;
    
    if (isFullscreen) {
      if (isCurrentlyNative) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    } else {
      if (playerContainerRef.current.requestFullscreen) {
        playerContainerRef.current.requestFullscreen()
          .then(() => setIsFullscreen(true))
          .catch((err) => {
            console.warn("Native fullscreen request failed, using CSS fallback:", err);
            setIsFullscreen(true);
          });
      } else {
        setIsFullscreen(true);
      }
    }
  };

  // Video/Audio Element Refs
  const videoPlayerRef = useRef<HTMLVideoElement | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timeline & Media Computations
  const totalDuration = clips.reduce((acc, c) => acc + c.duration, 0);

  // Get active clip at current playhead position
  const getActiveClipInfo = () => {
    let accumulatedTime = 0;
    for (let i = 0; i < clips.length; i++) {
      const clip = clips[i];
      const start = accumulatedTime;
      const end = accumulatedTime + clip.duration;
      if (playheadPos >= start && playheadPos < end) {
        return {
          clip,
          index: i,
          progress: (playheadPos - start) / clip.duration,
          relativeTime: playheadPos - start
        };
      }
      accumulatedTime = end;
    }
    // Fallback to last clip if at absolute end
    if (clips.length > 0 && playheadPos >= totalDuration) {
      return {
        clip: clips[clips.length - 1],
        index: clips.length - 1,
        progress: 1,
        relativeTime: clips[clips.length - 1].duration
      };
    }
    return null;
  };

  const activeInfo = getActiveClipInfo();

  // Handle Playhead Ticker
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = 100;
      const incrementSec = intervalMs / 1000;

      playbackIntervalRef.current = setInterval(() => {
        setPlayheadPos((prev) => {
          const next = prev + incrementSec;
          if (next >= totalDuration) {
            setIsPlaying(false);
            if (videoPlayerRef.current) {
              videoPlayerRef.current.pause();
            }
            // Pause all audios
            (Object.values(audioRefs.current) as HTMLAudioElement[]).forEach((aud) => aud.pause());
            return 0; // reset to beginning
          }
          return next;
        });
      }, intervalMs);
    } else {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
      // Pause video element
      if (videoPlayerRef.current) {
        videoPlayerRef.current.pause();
      }
      // Pause all audio elements
      (Object.values(audioRefs.current) as HTMLAudioElement[]).forEach((aud) => aud.pause());
    }

    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    };
  }, [isPlaying, totalDuration]);

  // Synchronize Active Video Element with playhead pos
  useEffect(() => {
    if (!videoPlayerRef.current || !activeInfo) return;

    const { clip, relativeTime } = activeInfo;
    if (clip.media_type === 'video') {
      // Avoid infinite seek loops by checking delta
      const delta = Math.abs(videoPlayerRef.current.currentTime - relativeTime);
      if (delta > 0.3) {
        videoPlayerRef.current.currentTime = relativeTime;
      }

      if (isPlaying && videoPlayerRef.current.paused) {
        videoPlayerRef.current.play().catch(() => {});
      }
    }
  }, [playheadPos, isPlaying, activeInfo?.clip?.id]);

  // Synchronize Background Audio Elements
  useEffect(() => {
    if (!isPlaying) {
      (Object.values(audioRefs.current) as HTMLAudioElement[]).forEach((aud) => aud.pause());
      return;
    }

    audioTracks.forEach((track) => {
      const audioEl = audioRefs.current[track.id];
      if (!audioEl) return;

      const trackStart = track.start_time;
      const trackEnd = track.start_time + track.duration;

      if (playheadPos >= trackStart && playheadPos <= trackEnd) {
        const targetTime = playheadPos - trackStart;
        const delta = Math.abs(audioEl.currentTime - targetTime);

        if (delta > 0.3) {
          audioEl.currentTime = targetTime;
        }

        if (audioEl.paused) {
          audioEl.volume = track.volume;
          audioEl.play().catch(() => {});
        }
      } else {
        if (!audioEl.paused) {
          audioEl.pause();
        }
      }
    });
  }, [playheadPos, isPlaying, audioTracks]);

  // Manage Audio element volumes
  useEffect(() => {
    audioTracks.forEach((track) => {
      const audioEl = audioRefs.current[track.id];
      if (audioEl) {
        audioEl.volume = track.volume;
      }
    });
  }, [audioTracks]);

  // Sync project total duration when clips update
  useEffect(() => {
    onUpdateProjectDuration(project.id, Math.ceil(totalDuration));
  }, [totalDuration]);

  // Import handlers
  const handleSelectStockAsset = (asset: StockAsset) => {
    if (asset.type === 'audio') {
      onAddAudio({
        project_id: project.id,
        audio_path: asset.url,
        track_name: asset.name,
        start_time: 0,
        volume: 0.8,
        duration: 30 // preset length
      });
    } else {
      onAddClip({
        project_id: project.id,
        media_path: asset.url,
        media_type: asset.type as any,
        name: asset.name,
        start_time: totalDuration,
        duration: asset.duration,
        position_index: clips.length,
        transition_type: 'fade',
        transition_duration: 0.5
      });
    }
    setImportDrawer(null);
  };

  const handleLocalFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'video' | 'photo' | 'audio') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    const fileUrl = URL.createObjectURL(file);

    const addMediaWithDuration = (duration: number) => {
      const finalDuration = Math.max(1, Math.round(duration));
      if (type === 'audio') {
        onAddAudio({
          project_id: project.id,
          audio_path: fileUrl,
          track_name: file.name,
          start_time: 0,
          volume: 0.8,
          duration: finalDuration
        });
      } else {
        onAddClip({
          project_id: project.id,
          media_path: fileUrl,
          media_type: type as any,
          name: file.name,
          start_time: totalDuration,
          duration: finalDuration,
          position_index: clips.length,
          transition_type: 'fade',
          transition_duration: 0.5
        });
      }
      setIsAnalyzing(false);
      setImportDrawer(null);
    };

    if (type === 'video') {
      const tempVideo = document.createElement('video');
      tempVideo.src = fileUrl;
      tempVideo.preload = 'metadata';
      tempVideo.onloadedmetadata = () => {
        addMediaWithDuration(tempVideo.duration || 5);
      };
      tempVideo.onerror = () => {
        addMediaWithDuration(5);
      };
    } else if (type === 'audio') {
      const tempAudio = document.createElement('audio');
      tempAudio.src = fileUrl;
      tempAudio.preload = 'metadata';
      tempAudio.onloadedmetadata = () => {
        addMediaWithDuration(tempAudio.duration || 30);
      };
      tempAudio.onerror = () => {
        addMediaWithDuration(30);
      };
    } else {
      // Photo - fixed standard 5s slide
      addMediaWithDuration(5);
    }
  };

  const handleGenericLocalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let detectedType: 'video' | 'photo' | 'audio' | null = null;
    if (file.type.startsWith('video/')) {
      detectedType = 'video';
    } else if (file.type.startsWith('image/')) {
      detectedType = 'photo';
    } else if (file.type.startsWith('audio/')) {
      detectedType = 'audio';
    } else {
      // Guess by extension
      const name = file.name.toLowerCase();
      if (name.endsWith('.mp4') || name.endsWith('.mov') || name.endsWith('.webm') || name.endsWith('.mkv') || name.endsWith('.avi')) {
        detectedType = 'video';
      } else if (name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.gif') || name.endsWith('.webp') || name.endsWith('.svg')) {
        detectedType = 'photo';
      } else if (name.endsWith('.mp3') || name.endsWith('.wav') || name.endsWith('.ogg') || name.endsWith('.m4a') || name.endsWith('.aac')) {
        detectedType = 'audio';
      }
    }

    if (!detectedType) {
      alert('Unsupported file format. Please select an image, video, or audio file.');
      return;
    }

    setIsAnalyzing(true);
    const fileUrl = URL.createObjectURL(file);

    const addMediaWithDuration = (duration: number) => {
      const finalDuration = Math.max(1, Math.round(duration));
      if (detectedType === 'audio') {
        onAddAudio({
          project_id: project.id,
          audio_path: fileUrl,
          track_name: file.name,
          start_time: 0,
          volume: 0.8,
          duration: finalDuration
        });
      } else {
        onAddClip({
          project_id: project.id,
          media_path: fileUrl,
          media_type: detectedType as any,
          name: file.name,
          start_time: totalDuration,
          duration: finalDuration,
          position_index: clips.length,
          transition_type: 'fade',
          transition_duration: 0.5
        });
      }
      setIsAnalyzing(false);
    };

    if (detectedType === 'video') {
      const tempVideo = document.createElement('video');
      tempVideo.src = fileUrl;
      tempVideo.preload = 'metadata';
      tempVideo.onloadedmetadata = () => {
        addMediaWithDuration(tempVideo.duration || 5);
      };
      tempVideo.onerror = () => {
        addMediaWithDuration(5);
      };
    } else if (detectedType === 'audio') {
      const tempAudio = document.createElement('audio');
      tempAudio.src = fileUrl;
      tempAudio.preload = 'metadata';
      tempAudio.onloadedmetadata = () => {
        addMediaWithDuration(tempAudio.duration || 30);
      };
      tempAudio.onerror = () => {
        addMediaWithDuration(30);
      };
    } else {
      // Photo - fixed standard 5s slide
      addMediaWithDuration(5);
    }
  };

  // Rendering Helper: Get active text overlays at current playheadPos
  const getActiveTextOverlays = () => {
    return textOverlays.filter(
      (text) => playheadPos >= text.start_time && playheadPos <= text.start_time + text.duration
    );
  };

  const activeTexts = getActiveTextOverlays();

  // Helper for text animations
  const getTextAnimationClasses = (effect: string) => {
    switch (effect) {
      case 'slide':
        return { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 } };
      case 'bounce':
        return { initial: { opacity: 0, scale: 0.3 }, animate: { opacity: 1, scale: 1 }, transition: { type: 'spring', bounce: 0.6 } };
      case 'zoom':
        return { initial: { opacity: 0, scale: 2 }, animate: { opacity: 1, scale: 1 } };
      case 'typewriter':
        return { initial: { opacity: 0 }, animate: { opacity: 1 } };
      default: // fadein
        return { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 } };
    }
  };

  const selectedClip = clips.find((c) => c.id === selectedClipId);

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-[#0A0A1A]">
      {/* LEFT: MONITOR, MIXERS, PREVIEWS */}
      <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-[#2D2D4A] bg-[#05050A] overflow-hidden">
        {/* Editor Subheader */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#10101e] border-b border-[#2D2D4A]">
          <div className="flex items-center gap-3">
            <button
              onClick={onGoBack}
              className="p-1.5 rounded-xl hover:bg-[#1A1A2E] text-[#94A3B8] hover:text-white border border-[#2D2D4A] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <p className="text-[9px] font-black text-[#94A3B8] uppercase tracking-[0.2em] leading-none">EDITOR CANVAS</p>
              <h3 className="text-sm font-black text-slate-100 uppercase tracking-tight font-display truncate max-w-[180px] md:max-w-xs mt-1">
                {project.title}
              </h3>
            </div>
          </div>

          <button
            onClick={() => setShowExportModal(true)}
            className="px-5 py-2.5 bg-[#6366F1] hover:bg-[#6366F1]/90 text-white font-black text-[10px] uppercase tracking-widest rounded-xl flex items-center gap-1.5 shadow-lg shadow-indigo-600/15 cursor-pointer font-mono"
          >
            <Download className="w-3.5 h-3.5" />
            Export Studio
          </button>
        </div>

        {/* CINEMATIC PREVIEW PLAYER */}
        <div 
          ref={playerContainerRef}
          className={`relative bg-[#000] border-b border-[#2D2D4A] overflow-hidden flex items-center justify-center transition-all duration-300 ${
            isFullscreen 
              ? 'fixed inset-0 z-[9999] w-screen h-screen max-w-full max-h-full' 
              : 'aspect-video max-h-[38vh] md:max-h-[45vh] w-full'
          }`}
        >
          {activeInfo ? (
            <div className="w-full h-full relative">
              {activeInfo.clip.media_type === 'video' ? (
                <video
                  ref={(el) => {
                    videoPlayerRef.current = el;
                  }}
                  src={activeInfo.clip.media_path}
                  muted
                  playsInline
                  loop={false}
                  className={`w-full h-full ${isFullscreen ? 'object-contain' : 'object-cover'}`}
                />
              ) : (
                <img
                  src={activeInfo.clip.media_path}
                  alt={activeInfo.clip.name}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full ${isFullscreen ? 'object-contain' : 'object-cover'}`}
                />
              )}
 
              {/* LIVE CAPTION OVERLAYS */}
              <AnimatePresence>
                {activeTexts.map((text) => {
                  const anim = getTextAnimationClasses(text.effect_type);
                  return (
                    <motion.div
                      key={text.id}
                      initial={anim.initial}
                      animate={anim.animate}
                      exit={{ opacity: 0 }}
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: `${text.position_y}%`,
                        transform: 'translate(-50%, -50%)',
                        color: text.color,
                        fontSize: isFullscreen ? `${text.font_size * 1.5}px` : `${text.font_size}px`,
                      }}
                      className="px-4 py-2 font-black text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] z-20 pointer-events-none select-none select-font tracking-tight leading-none uppercase whitespace-pre-wrap max-w-[85%]"
                    >
                      {text.effect_type === 'typewriter' ? (
                        <TypewriterEffect text={text.text_content} duration={text.duration} />
                      ) : (
                        text.text_content
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
 
              {/* TRANSITION OVERLAY EFFECTS */}
              {activeInfo.progress < 0.1 && activeInfo.index > 0 && (
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 bg-black pointer-events-none z-30 flex items-center justify-center"
                >
                  <Sparkles className="w-8 h-8 text-indigo-400 opacity-30 animate-pulse" />
                </motion.div>
              )}
            </div>
          ) : (
            <div className="text-center p-6 flex flex-col items-center">
              <FileVideo className="w-10 h-10 text-slate-700 mb-3 animate-pulse" />
              <p className="text-xs text-[#94A3B8] font-black uppercase tracking-widest font-display">Empty Canvas Area</p>
              <p className="text-[11px] text-[#94A3B8]/80 mt-1 max-w-xs leading-relaxed">
                Add cinematic sample videos or images from the toolbar below to begin rendering preview layers.
              </p>
            </div>
          )}

          {/* FULL SCREEN TOGGLE BUTTON */}
          <button
            onClick={toggleFullscreen}
            className="absolute bottom-4 right-4 z-[10000] p-2.5 rounded-xl bg-black/75 hover:bg-black/90 text-[#94A3B8] hover:text-white border border-[#2D2D4A] hover:border-[#6366F1]/50 shadow-lg backdrop-blur-sm cursor-pointer transition-all hover:scale-105 active:scale-95 flex items-center justify-center select-none"
            title={isFullscreen ? "Exit Full Screen" : "Enter Full Screen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-[#F43F5E]" /> : <Maximize2 className="w-4 h-4 text-[#6366F1]" />}
          </button>

          {/* AUDIO EQUALIZER VISUALIZER (Only shown when playing music) */}
          {isPlaying && audioTracks.length > 0 && (
            <div className="absolute top-4 right-4 flex items-end gap-0.5 h-6 bg-black/70 px-2.5 py-1.5 rounded-xl border border-[#2D2D4A] backdrop-blur-sm pointer-events-none">
              <span className="w-0.5 h-full bg-cyan-400 rounded-full animate-[equalizer_1.2s_ease-in-out_infinite]" style={{ animationDelay: '0.1s' }} />
              <span className="w-0.5 h-1/2 bg-indigo-400 rounded-full animate-[equalizer_0.9s_ease-in-out_infinite]" style={{ animationDelay: '0.4s' }} />
              <span className="w-0.5 h-3/4 bg-purple-400 rounded-full animate-[equalizer_1.5s_ease-in-out_infinite]" style={{ animationDelay: '0s' }} />
              <span className="w-0.5 h-1/3 bg-pink-400 rounded-full animate-[equalizer_1.1s_ease-in-out_infinite]" style={{ animationDelay: '0.6s' }} />
            </div>
          )}
        </div>

        {/* MONITOR MEDIA CONTROLS */}
        <div className="px-5 py-4 bg-[#10101e] flex items-center justify-between border-b border-[#2D2D4A]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setPlayheadPos(0);
                setIsPlaying(false);
              }}
              className="p-2.5 rounded-xl bg-[#1A1A2E] border border-[#2D2D4A] text-[#94A3B8] hover:text-slate-100 transition-all active:scale-90 cursor-pointer"
              title="Rewind to start"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3.5 rounded-full bg-[#6366F1] hover:bg-[#6366F1]/90 text-white shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
            </button>
          </div>

          {/* Playhead Slider Scrub */}
          <div className="flex-1 mx-6 flex items-center gap-3">
            <span className="text-[10px] font-mono font-black tracking-wider uppercase text-[#6366F1]">{playheadPos.toFixed(1)}s</span>
            <input
              type="range"
              min={0}
              max={totalDuration || 1}
              step={0.1}
              value={playheadPos}
              onChange={(e) => {
                setPlayheadPos(parseFloat(e.target.value));
                setIsPlaying(false);
              }}
              className="flex-1 accent-[#6366F1] h-1.5 bg-[#1A1A2E] rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-[10px] font-mono font-black tracking-wider uppercase text-[#94A3B8]">{(totalDuration || 0).toFixed(1)}s</span>
          </div>
        </div>

        {/* FLOATING ACTION TOOLBAR */}
        <div className="grid grid-cols-5 bg-[#10101e] border-t border-[#2D2D4A] p-3 gap-3">
          <button
            onClick={() => setImportDrawer('video')}
            className={`flex flex-col items-center justify-center py-2.5 px-1.5 rounded-xl border transition-all cursor-pointer ${
              importDrawer === 'video' ? 'bg-[#6366F1]/10 border-[#6366F1] text-[#6366F1]' : 'bg-[#1A1A2E] border-[#2D2D4A] text-[#94A3B8] hover:text-[#6366F1]/80 hover:border-[#6366F1]/40'
            }`}
          >
            <Video className="w-4 h-4 mb-1" />
            <span className="text-[9px] font-black uppercase tracking-[0.1em]">Video</span>
          </button>

          <button
            onClick={() => setImportDrawer('photo')}
            className={`flex flex-col items-center justify-center py-2.5 px-1.5 rounded-xl border transition-all cursor-pointer ${
              importDrawer === 'photo' ? 'bg-purple-600/10 border-purple-500 text-purple-400' : 'bg-[#1A1A2E] border-[#2D2D4A] text-[#94A3B8] hover:text-purple-400 hover:border-purple-500/40'
            }`}
          >
            <Image className="w-4 h-4 mb-1" />
            <span className="text-[9px] font-black uppercase tracking-[0.1em]">Photo</span>
          </button>

          <button
            onClick={() => setImportDrawer('audio')}
            className={`flex flex-col items-center justify-center py-2.5 px-1.5 rounded-xl border transition-all cursor-pointer ${
              importDrawer === 'audio' ? 'bg-cyan-600/10 border-cyan-500 text-cyan-400' : 'bg-[#1A1A2E] border-[#2D2D4A] text-[#94A3B8] hover:text-cyan-400 hover:border-cyan-500/40'
            }`}
          >
            <Music className="w-4 h-4 mb-1" />
            <span className="text-[9px] font-black uppercase tracking-[0.1em]">Audio</span>
          </button>

          <button
            onClick={() => setShowTextModal(true)}
            className="flex flex-col items-center justify-center py-2.5 px-1.5 rounded-xl border bg-[#1A1A2E] border-[#2D2D4A] text-[#94A3B8] hover:text-orange-400 hover:border-orange-500/40 transition-all cursor-pointer"
          >
            <Type className="w-4 h-4 mb-1 text-orange-400" />
            <span className="text-[9px] font-black uppercase tracking-[0.1em]">Text</span>
          </button>

          <button
            disabled={!selectedClipId}
            onClick={() => setShowTransModal(true)}
            className="flex flex-col items-center justify-center py-2.5 px-1.5 rounded-xl border bg-[#1A1A2E] border-[#2D2D4A] text-[#94A3B8] hover:text-amber-400 hover:border-amber-500/40 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
          >
            <Shuffle className="w-4 h-4 mb-1 text-amber-400" />
            <span className="text-[9px] font-black uppercase tracking-[0.1em]">Trans</span>
          </button>
        </div>

        {/* ASSET IMPORT DRAWER PANEL */}
        <AnimatePresence>
          {importDrawer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-[#10101e] border-t border-[#2D2D4A] overflow-y-auto max-h-[38vh] scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
            >
              <div className="p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-350 font-display">
                    IMPORT {importDrawer} ASSET
                  </h4>
                  <button
                    onClick={() => setImportDrawer(null)}
                    className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <XIcon className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Stock Library Grid */}
                  <div>
                    <span className="text-[10px] font-black text-[#94A3B8] uppercase block mb-2 tracking-[0.15em]">
                      Cinematic Stock Library
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(importDrawer === 'video'
                        ? STOCK_VIDEOS
                        : importDrawer === 'photo'
                        ? STOCK_PHOTOS
                        : STOCK_AUDIO
                      ).map((asset) => (
                        <button
                          key={asset.id}
                          onClick={() => handleSelectStockAsset(asset)}
                          className="text-left p-3.5 bg-[#1A1A2E] border border-[#2D2D4A] rounded-xl flex flex-col justify-between hover:border-[#6366F1]/50 hover:bg-[#1A1A2E]/80 transition-all text-xs cursor-pointer font-mono font-bold group"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: asset.color || '#6366f1' }}
                            />
                            <div className="font-black text-slate-200 truncate uppercase group-hover:text-white">
                              {asset.name}
                            </div>
                          </div>
                          <div className="text-[9px] text-[#94A3B8] uppercase font-bold">
                            {asset.category} ({asset.duration}s)
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dedicated Bottom Upload Button Section */}
                  <div className="pt-3 border-t border-[#2D2D4A] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#131324]/40 p-3.5 rounded-xl border border-[#2D2D4A]/50">
                    <div className="text-left">
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-300">
                        HAVE YOUR OWN CUSTOM {importDrawer === 'photo' ? 'IMAGE' : importDrawer === 'audio' ? 'MUSIC' : 'VIDEO'} FILE?
                      </p>
                      <p className="text-[9px] text-[#94A3B8] uppercase font-bold mt-0.5">
                        Import directly from local device storage to render on timeline
                      </p>
                    </div>

                    {isAnalyzing ? (
                      <div className="flex items-center gap-2 bg-[#1A1A2E] border border-[#2D2D4A] px-5 py-3 rounded-xl text-xs font-mono font-black text-[#6366F1] animate-pulse">
                        <Loader className="w-4 h-4 animate-spin" />
                        <span>ANALYZING PROFILE...</span>
                      </div>
                    ) : (
                      <label className="px-5 py-3 bg-[#6366F1] hover:bg-[#6366F1]/90 text-white font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-indigo-600/20 font-mono select-none hover:scale-[1.02] active:scale-[0.98]">
                        <Upload className="w-3.5 h-3.5" />
                        <span>
                          {importDrawer === 'video' && 'Upload Video'}
                          {importDrawer === 'photo' && 'Upload Image'}
                          {importDrawer === 'audio' && 'Upload Music'}
                        </span>
                        <input
                          type="file"
                          accept={
                            importDrawer === 'video'
                              ? 'video/*'
                              : importDrawer === 'photo'
                              ? 'image/*'
                              : 'audio/*'
                          }
                          onChange={(e) => handleLocalFileUpload(e, importDrawer)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* RIGHT: TIMELINE AND AUDIO MIXER SLIDERS */}
      <div className="flex-1 md:w-[45%] flex flex-col overflow-hidden bg-[#05050A]">
        {/* Track Title */}
        <div className="px-5 py-4 bg-[#10101e] border-b border-[#2D2D4A] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#6366F1]">
            <Layers className="w-4 h-4" />
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-300 font-display">
              Timeline Layers
            </h4>
          </div>
          <span className="text-[9px] font-mono font-black uppercase tracking-widest bg-[#6366F1]/10 border border-[#6366F1]/25 text-[#6366F1] px-2.5 py-1 rounded-md">
            Multi-Track
          </span>
        </div>

        {/* SCROLLABLE TRACK LANES */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* LANES 1: VIDEOS / PHOTO TRACK */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.15em] flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-[#6366F1]" />
                Video / Photo Track
              </span>
              <span className="text-[10px] font-mono font-black uppercase text-[#94A3B8]/85">{clips.length} CLIPS</span>
            </div>

            <div className="bg-[#10101e] border border-[#2D2D4A] rounded-xl p-3 overflow-hidden">
              {clips.length === 0 ? (
                <button
                  onClick={() => setImportDrawer('video')}
                  className="w-full h-16 border border-dashed border-[#2D2D4A] rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-[#6366F1] hover:border-[#6366F1]/40 transition-all gap-2 text-xs cursor-pointer font-black uppercase tracking-wider"
                >
                  <Plus className="w-4 h-4" />
                  Add Cinematic Clip
                </button>
              ) : (
                <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin">
                  {clips.map((clip, index) => {
                    const isSelected = selectedClipId === clip.id;
                    const accumulatedStart = clips.slice(0, index).reduce((sum, c) => sum + c.duration, 0);
                    return (
                      <div key={clip.id} className="flex items-center flex-shrink-0">
                        {/* Clip Box */}
                        <motion.div
                          onClick={() => {
                            setSelectedClipId(isSelected ? null : clip.id);
                            setPlayheadPos(accumulatedStart);
                          }}
                          className={`relative w-28 h-14 rounded-lg border flex flex-col justify-between p-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#6366F1]/10 border-[#6366F1] shadow-[0_0_12px_rgba(99,102,241,0.15)]'
                              : 'bg-[#1A1A2E]/80 border-[#2D2D4A] text-slate-300 hover:border-[#2D2D4A]'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <span className="text-[9px] font-black uppercase truncate max-w-[80px]">
                              {clip.name}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteClip(clip.id);
                                if (isSelected) setSelectedClipId(null);
                              }}
                              className="p-1 rounded bg-slate-900/80 text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors cursor-pointer border border-transparent hover:border-[#EF4444]/20"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between text-[8px] text-[#94A3B8] font-mono font-black uppercase">
                            <span className="flex items-center gap-1">
                              {clip.media_type === 'video' ? <Video className="w-3 h-3 text-[#6366F1]" /> : <Image className="w-3 h-3 text-purple-400" />}
                              {clip.media_type}
                            </span>
                            <span className="font-bold">{clip.duration}s</span>
                          </div>
                        </motion.div>

                        {/* Transition Spacer (Only between consecutive clips) */}
                        {index < clips.length - 1 && (
                          <button
                            onClick={() => {
                              setSelectedClipId(clip.id);
                              setShowTransModal(true);
                            }}
                            className={`p-1.5 rounded-full border mx-1 transition-all cursor-pointer ${
                              clip.transition_type !== 'none'
                                ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                                : 'bg-slate-900 border-[#2D2D4A] text-slate-500 hover:border-[#6366F1] hover:text-white'
                            }`}
                            title={`Transition: ${clip.transition_type.toUpperCase()}`}
                          >
                            <Shuffle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* LANES 2: AUDIO TRACKS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.15em] flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-cyan-400" />
                Background Soundtracks
              </span>
              <span className="text-[10px] font-mono font-black uppercase text-[#94A3B8]/85">{audioTracks.length} TRACKS</span>
            </div>

            <div className="bg-[#10101e] border border-[#2D2D4A] rounded-xl p-3">
              {audioTracks.length === 0 ? (
                <button
                  onClick={() => setImportDrawer('audio')}
                  className="w-full h-16 border border-dashed border-[#2D2D4A] rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-cyan-400 hover:border-cyan-500/40 transition-all gap-2 text-xs cursor-pointer font-black uppercase tracking-wider"
                >
                  <Plus className="w-4 h-4" />
                  Add Background Music
                </button>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {audioTracks.map((track) => {
                    const isSelected = selectedAudioId === track.id;
                    return (
                      <div
                        key={track.id}
                        onClick={() => setSelectedAudioId(isSelected ? null : track.id)}
                        className={`p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500/10 border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                            : 'bg-[#1A1A2E]/80 border-[#2D2D4A] text-slate-300'
                        }`}
                      >
                        {/* Hidden native HTML5 audio for actual gameplay synthesis */}
                        <audio
                          ref={(el) => {
                            if (el) audioRefs.current[track.id] = el;
                          }}
                          src={track.audio_path}
                          loop
                        />

                        <div className="flex-1 min-w-0 pr-3">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-black text-xs text-slate-100 uppercase tracking-tight font-display truncate max-w-[150px]">
                              {track.track_name}
                            </h5>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteAudio(track.id);
                                if (isSelected) setSelectedAudioId(null);
                                if (audioRefs.current[track.id]) {
                                  audioRefs.current[track.id].pause();
                                  delete audioRefs.current[track.id];
                                }
                              }}
                              className="p-1.5 rounded bg-[#10101e] text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#EF4444]/10 border border-[#2D2D4A] hover:border-[#EF4444]/20 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Individual volume faders */}
                          <div className="flex items-center gap-3">
                            {track.volume === 0 ? (
                              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                            )}
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.05"
                              value={track.volume}
                              onClick={(e) => e.stopPropagation()} // block parent selection toggle
                              onChange={(e) => onUpdateAudioVolume(track.id, parseFloat(e.target.value))}
                              className="flex-1 accent-cyan-500 h-1.5 bg-[#10101e] rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-[10px] font-mono font-black text-[#94A3B8] w-8 text-right">
                              {Math.round(track.volume * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* LANES 3: TEXT CAPTIONS TRACK */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.15em] flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-orange-400" />
                Animated Captions Track
              </span>
              <span className="text-[10px] font-mono font-black uppercase text-[#94A3B8]/85">{textOverlays.length} OVERLAYS</span>
            </div>

            <div className="bg-[#10101e] border border-[#2D2D4A] rounded-xl p-3">
              {textOverlays.length === 0 ? (
                <button
                  onClick={() => setShowTextModal(true)}
                  className="w-full h-16 border border-dashed border-[#2D2D4A] rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-orange-400 hover:border-orange-500/40 transition-all gap-2 text-xs cursor-pointer font-black uppercase tracking-wider"
                >
                  <Plus className="w-4 h-4" />
                  Add Kinetic Text Overlay
                </button>
              ) : (
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {textOverlays.map((text) => {
                    const isSelected = selectedTextId === text.id;
                    const effectColors: any = { fadein: '#a855f7', slide: '#f97316', bounce: '#10b981', typewriter: '#eab308', zoom: '#ec4899' };
                    const dotCol = effectColors[text.effect_type] || '#a855f7';
                    return (
                      <div
                        key={text.id}
                        onClick={() => {
                          setSelectedTextId(isSelected ? null : text.id);
                          setPlayheadPos(text.start_time);
                        }}
                        style={{ borderColor: isSelected ? dotCol : undefined }}
                        className={`p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                          isSelected ? 'bg-orange-500/5' : 'bg-[#1A1A2E]/80 border-[#2D2D4A] text-[#94A3B8]'
                        }`}
                      >
                        <div className="flex-1 min-w-0 pr-2">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-slate-100 uppercase tracking-tight font-display text-xs truncate max-w-[150px]">
                              "{text.text_content}"
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteText(text.id);
                                if (isSelected) setSelectedTextId(null);
                              }}
                              className="p-1.5 rounded bg-[#10101e] text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#EF4444]/10 border border-[#2D2D4A] hover:border-[#EF4444]/20 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-[#94A3B8] mt-2 font-mono">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dotCol }} />
                              <span className="text-[10px] font-black uppercase tracking-wide">
                                {text.effect_type}
                              </span>
                            </div>
                            <span>
                              Show at <span className="font-bold text-slate-200">{text.start_time.toFixed(1)}s</span> (length {text.duration}s)
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM METADATA STATISTICS SUMMARY */}
        <div className="p-4.5 bg-[#10101e] border-t border-[#2D2D4A] grid grid-cols-4 gap-3 text-center">
          <div className="p-2.5 bg-[#1A1A2E] border border-[#2D2D4A] rounded-xl shadow-md">
            <span className="block text-[15px] font-black text-[#6366F1] font-display">{clips.length}</span>
            <span className="text-[8px] font-black text-[#94A3B8] uppercase tracking-widest mt-1 block">Clips</span>
          </div>
          <div className="p-2.5 bg-[#1A1A2E] border border-[#2D2D4A] rounded-xl shadow-md">
            <span className="block text-[15px] font-black text-cyan-400 font-display">{audioTracks.length}</span>
            <span className="text-[8px] font-black text-[#94A3B8] uppercase tracking-widest mt-1 block">Audio</span>
          </div>
          <div className="p-2.5 bg-[#1A1A2E] border border-[#2D2D4A] rounded-xl shadow-md">
            <span className="block text-[15px] font-black text-orange-400 font-display">{textOverlays.length}</span>
            <span className="text-[8px] font-black text-[#94A3B8] uppercase tracking-widest mt-1 block">Texts</span>
          </div>
          <div className="p-2.5 bg-[#1A1A2E] border border-[#2D2D4A] rounded-xl shadow-md">
            <span className="block text-[15px] font-black text-amber-400 font-display">{totalDuration.toFixed(0)}s</span>
            <span className="text-[8px] font-black text-[#94A3B8] uppercase tracking-widest mt-1 block">Length</span>
          </div>
        </div>
      </div>

      {/* RENDER ACTIVE MODALS */}
      <TransitionsModal
        isOpen={showTransModal}
        onClose={() => setShowTransModal(false)}
        onSelect={(transType) => {
          if (selectedClipId) {
            onUpdateClipTransition(selectedClipId, transType);
            setShowTransModal(false);
          }
        }}
        currentType={selectedClip?.transition_type || 'fade'}
      />

      <TextOverlayModal
        isOpen={showTextModal}
        onClose={() => setShowTextModal(false)}
        onSave={(textData) => {
          onAddText({
            project_id: project.id,
            ...textData,
            start_time: playheadPos
          });
          setShowTextModal(false);
        }}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        projectTitle={project.title}
        onExportComplete={() => {
          setShowExportModal(false);
          // Show sleek browser notification completion
          alert('Rendering Success!\n\nYour formatted multiplex timeline video file has been compiled and saved to your Downloads repository.');
        }}
      />
    </div>
  );
}

// Custom typewriter slice string builder helper
function TypewriterEffect({ text, duration }: { text: string; duration: number }) {
  const [sliceCount, setSliceCount] = useState(0);

  useEffect(() => {
    setSliceCount(0);
    const charsTotal = text.length;
    const typingIntervalMs = (duration * 1000) / charsTotal;
    
    const interval = setInterval(() => {
      setSliceCount((prev) => {
        if (prev >= charsTotal) {
          clearInterval(interval);
          return charsTotal;
        }
        return prev + 1;
      });
    }, Math.max(30, typingIntervalMs));

    return () => clearInterval(interval);
  }, [text, duration]);

  return <span>{text.slice(0, sliceCount)}</span>;
}

// Custom internal SVG X
function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}
