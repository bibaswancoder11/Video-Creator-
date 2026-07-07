import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Film, BookOpen, Sparkles, Youtube } from 'lucide-react';
import { Project, Clip, AudioTrack, TextOverlay } from './types';
import { ProjectsScreen } from './components/ProjectsScreen';
import { TipsScreen } from './components/TipsScreen';
import { EditorScreen } from './components/EditorScreen';
import { STOCK_VIDEOS, STOCK_PHOTOS, STOCK_AUDIO } from './utils/stockAssets';

export default function App() {
  // Screen Router state
  const [currentScreen, setCurrentScreen] = useState<'projects' | 'tips' | 'editor'>('projects');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  // App database state
  const [projects, setProjects] = useState<Project[]>([]);
  const [clips, setClips] = useState<Clip[]>([]);
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([]);
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);

  // INITIALIZE DATABASE & SEED SAMPLE DATA IF EMPTY
  useEffect(() => {
    const cachedProjects = localStorage.getItem('vc_projects');
    const cachedClips = localStorage.getItem('vc_clips');
    const cachedAudios = localStorage.getItem('vc_audios');
    const cachedTexts = localStorage.getItem('vc_texts');

    if (cachedProjects && cachedClips && cachedAudios && cachedTexts) {
      setProjects(JSON.parse(cachedProjects));
      setClips(JSON.parse(cachedClips));
      setAudioTracks(JSON.parse(cachedAudios));
      setTextOverlays(JSON.parse(cachedTexts));
    } else {
      // Seed Demo Data
      const demoProject: Project = {
        id: 'demo-cyberpunk-cruise',
        title: 'Retrowave Neon Drive',
        description: 'A cinematic cyber street synthwave journey. Features high-quality neon streets, scenic waves, animated subtitles, and lofi backing music.',
        duration_seconds: 15,
        created_at: new Date().toISOString(),
        metadata: {
          clipCount: 2,
          audioCount: 1,
          textCount: 2
        }
      };

      const demoClips: Clip[] = [
        {
          id: 'clip-seed-1',
          project_id: demoProject.id,
          media_path: STOCK_VIDEOS[0].url,
          media_type: 'video',
          name: STOCK_VIDEOS[0].name,
          start_time: 0,
          duration: 10,
          position_index: 0,
          transition_type: 'fade',
          transition_duration: 0.5
        },
        {
          id: 'clip-seed-2',
          project_id: demoProject.id,
          media_path: STOCK_VIDEOS[1].url,
          media_type: 'video',
          name: STOCK_VIDEOS[1].name,
          start_time: 10,
          duration: 8,
          position_index: 1,
          transition_type: 'none',
          transition_duration: 0.5
        }
      ];

      const demoAudios: AudioTrack[] = [
        {
          id: 'audio-seed-1',
          project_id: demoProject.id,
          audio_path: STOCK_AUDIO[0].url,
          track_name: STOCK_AUDIO[0].name,
          start_time: 0,
          volume: 0.65,
          duration: 18
        }
      ];

      const demoTexts: TextOverlay[] = [
        {
          id: 'text-seed-1',
          project_id: demoProject.id,
          text_content: 'CYBERPUNK NEON DRIVE',
          effect_type: 'typewriter',
          color: '#FFDE59',
          font_size: 32,
          duration: 4,
          start_time: 1.5,
          position_x: 50,
          position_y: 65
        },
        {
          id: 'text-seed-2',
          project_id: demoProject.id,
          text_content: 'OCEAN WAVES ARRIVAL',
          effect_type: 'bounce',
          color: '#00D2FF',
          font_size: 28,
          duration: 3.5,
          start_time: 11.2,
          position_x: 50,
          position_y: 75
        }
      ];

      setProjects([demoProject]);
      setClips(demoClips);
      setAudioTracks(demoAudios);
      setTextOverlays(demoTexts);

      localStorage.setItem('vc_projects', JSON.stringify([demoProject]));
      localStorage.setItem('vc_clips', JSON.stringify(demoClips));
      localStorage.setItem('vc_audios', JSON.stringify(demoAudios));
      localStorage.setItem('vc_texts', JSON.stringify(demoTexts));
    }
  }, []);

  // Sync to local storage helper
  const syncToLocalStorage = (
    newProjects: Project[],
    newClips: Clip[],
    newAudios: AudioTrack[],
    newTexts: TextOverlay[]
  ) => {
    localStorage.setItem('vc_projects', JSON.stringify(newProjects));
    localStorage.setItem('vc_clips', JSON.stringify(newClips));
    localStorage.setItem('vc_audios', JSON.stringify(newAudios));
    localStorage.setItem('vc_texts', JSON.stringify(newTexts));
  };

  // MUTATIONS & STATE ACTIONS
  const handleCreateProject = (data: { title: string; description: string }) => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: data.title,
      description: data.description,
      duration_seconds: 0,
      created_at: new Date().toISOString(),
      metadata: { clipCount: 0, audioCount: 0, textCount: 0 }
    };

    const updatedProjects = [newProject, ...projects];
    setProjects(updatedProjects);
    syncToLocalStorage(updatedProjects, clips, audioTracks, textOverlays);
  };

  const handleDeleteProject = (id: string) => {
    const updatedProjects = projects.filter((p) => p.id !== id);
    const updatedClips = clips.filter((c) => c.project_id !== id);
    const updatedAudios = audioTracks.filter((a) => a.project_id !== id);
    const updatedTexts = textOverlays.filter((t) => t.project_id !== id);

    setProjects(updatedProjects);
    setClips(updatedClips);
    setAudioTracks(updatedAudios);
    setTextOverlays(updatedTexts);

    syncToLocalStorage(updatedProjects, updatedClips, updatedAudios, updatedTexts);
  };

  const handleUpdateProjectDuration = (id: string, duration: number) => {
    const updatedProjects = projects.map((p) => {
      if (p.id === id) {
        // Also update sub-item metadata counts
        const pClips = clips.filter((c) => c.project_id === id);
        const pAudios = audioTracks.filter((a) => a.project_id === id);
        const pTexts = textOverlays.filter((t) => t.project_id === id);

        return {
          ...p,
          duration_seconds: duration,
          metadata: {
            clipCount: pClips.length,
            audioCount: pAudios.length,
            textCount: pTexts.length
          }
        };
      }
      return p;
    });

    setProjects(updatedProjects);
    syncToLocalStorage(updatedProjects, clips, audioTracks, textOverlays);
  };

  // TIMELINE MULTI-TRACK MUTATIONS
  const handleAddClip = (clipData: Omit<Clip, 'id'>) => {
    const newClip: Clip = {
      ...clipData,
      id: `clip-${Date.now()}`
    };

    const updatedClips = [...clips, newClip];
    setClips(updatedClips);

    // Update metadata count on project
    const updatedProjects = projects.map((p) => {
      if (p.id === clipData.project_id) {
        return {
          ...p,
          metadata: { ...p.metadata, clipCount: p.metadata.clipCount + 1 }
        };
      }
      return p;
    });
    setProjects(updatedProjects);

    syncToLocalStorage(updatedProjects, updatedClips, audioTracks, textOverlays);
  };

  const handleDeleteClip = (id: string) => {
    const targetClip = clips.find((c) => c.id === id);
    if (!targetClip) return;

    const updatedClips = clips.filter((c) => c.id !== id);
    setClips(updatedClips);

    // Update metadata count on project
    const updatedProjects = projects.map((p) => {
      if (p.id === targetClip.project_id) {
        return {
          ...p,
          metadata: { ...p.metadata, clipCount: Math.max(0, p.metadata.clipCount - 1) }
        };
      }
      return p;
    });
    setProjects(updatedProjects);

    syncToLocalStorage(updatedProjects, updatedClips, audioTracks, textOverlays);
  };

  const handleUpdateClipTransition = (id: string, transition: Clip['transition_type']) => {
    const updatedClips = clips.map((c) => (c.id === id ? { ...c, transition_type: transition } : c));
    setClips(updatedClips);
    syncToLocalStorage(projects, updatedClips, audioTracks, textOverlays);
  };

  const handleAddAudio = (audioData: Omit<AudioTrack, 'id'>) => {
    const newAudio: AudioTrack = {
      ...audioData,
      id: `audio-${Date.now()}`
    };

    const updatedAudios = [...audioTracks, newAudio];
    setAudioTracks(updatedAudios);

    // Update metadata count on project
    const updatedProjects = projects.map((p) => {
      if (p.id === audioData.project_id) {
        return {
          ...p,
          metadata: { ...p.metadata, audioCount: p.metadata.audioCount + 1 }
        };
      }
      return p;
    });
    setProjects(updatedProjects);

    syncToLocalStorage(updatedProjects, clips, updatedAudios, textOverlays);
  };

  const handleDeleteAudio = (id: string) => {
    const targetAudio = audioTracks.find((a) => a.id === id);
    if (!targetAudio) return;

    const updatedAudios = audioTracks.filter((a) => a.id !== id);
    setAudioTracks(updatedAudios);

    // Update metadata count on project
    const updatedProjects = projects.map((p) => {
      if (p.id === targetAudio.project_id) {
        return {
          ...p,
          metadata: { ...p.metadata, audioCount: Math.max(0, p.metadata.audioCount - 1) }
        };
      }
      return p;
    });
    setProjects(updatedProjects);

    syncToLocalStorage(updatedProjects, clips, updatedAudios, textOverlays);
  };

  const handleUpdateAudioVolume = (id: string, volume: number) => {
    const updatedAudios = audioTracks.map((a) => (a.id === id ? { ...a, volume } : a));
    setAudioTracks(updatedAudios);
    syncToLocalStorage(projects, clips, updatedAudios, textOverlays);
  };

  const handleAddText = (textData: Omit<TextOverlay, 'id'>) => {
    const newText: TextOverlay = {
      ...textData,
      id: `text-${Date.now()}`
    };

    const updatedTexts = [...textOverlays, newText];
    setTextOverlays(updatedTexts);

    // Update metadata count on project
    const updatedProjects = projects.map((p) => {
      if (p.id === textData.project_id) {
        return {
          ...p,
          metadata: { ...p.metadata, textCount: p.metadata.textCount + 1 }
        };
      }
      return p;
    });
    setProjects(updatedProjects);

    syncToLocalStorage(updatedProjects, clips, audioTracks, updatedTexts);
  };

  const handleDeleteText = (id: string) => {
    const targetText = textOverlays.find((t) => t.id === id);
    if (!targetText) return;

    const updatedTexts = textOverlays.filter((t) => t.id !== id);
    setTextOverlays(updatedTexts);

    // Update metadata count on project
    const updatedProjects = projects.map((p) => {
      if (p.id === targetText.project_id) {
        return {
          ...p,
          metadata: { ...p.metadata, textCount: Math.max(0, p.metadata.textCount - 1) }
        };
      }
      return p;
    });
    setProjects(updatedProjects);

    syncToLocalStorage(updatedProjects, clips, audioTracks, updatedTexts);
  };

  // Launch pre-loaded template project shortcut
  const handleQuickDemoLaunch = () => {
    setActiveProjectId('demo-cyberpunk-cruise');
    setCurrentScreen('editor');
  };

  // Filter components for the editor
  const activeProject = projects.find((p) => p.id === activeProjectId);
  const activeClips = clips.filter((c) => c.project_id === activeProjectId).sort((a, b) => a.position_index - b.position_index);
  const activeAudios = audioTracks.filter((a) => a.project_id === activeProjectId);
  const activeTexts = textOverlays.filter((t) => t.project_id === activeProjectId);

  return (
    <div className="w-screen h-screen flex flex-col bg-[#070714] text-slate-100 font-sans select-none overflow-hidden">
      {/* SCREEN ROUTER */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {currentScreen === 'projects' && (
          <ProjectsScreen
            projects={projects}
            onCreateProject={handleCreateProject}
            onDeleteProject={handleDeleteProject}
            onSelectProject={(id) => {
              setActiveProjectId(id);
              setCurrentScreen('editor');
            }}
          />
        )}

        {currentScreen === 'tips' && (
          <TipsScreen onQuickDemo={handleQuickDemoLaunch} />
        )}

        {currentScreen === 'editor' && activeProject && (
          <EditorScreen
            project={activeProject}
            onGoBack={() => {
              setCurrentScreen('projects');
              setActiveProjectId(null);
            }}
            onUpdateProjectDuration={handleUpdateProjectDuration}
            clips={activeClips}
            audioTracks={activeAudios}
            textOverlays={activeTexts}
            onAddClip={handleAddClip}
            onDeleteClip={handleDeleteClip}
            onUpdateClipTransition={handleUpdateClipTransition}
            onAddAudio={handleAddAudio}
            onDeleteAudio={handleDeleteAudio}
            onUpdateAudioVolume={handleUpdateAudioVolume}
            onAddText={handleAddText}
            onDeleteText={handleDeleteText}
          />
        )}
      </div>

      {/* BOTTOM TAB MENU: Only shown when not inside Active Editor */}
      {currentScreen !== 'editor' && (
        <div className="bg-[#10101f] border-t border-[#2d2d4a]/40 h-16 flex items-center justify-around px-6 relative z-10 select-none">
          {/* Projects Tab */}
          <button
            onClick={() => setCurrentScreen('projects')}
            className={`flex flex-col items-center justify-center w-20 h-full transition-all cursor-pointer ${
              currentScreen === 'projects' ? 'text-indigo-400 font-bold scale-105' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Film className="w-5 h-5 mb-1" />
            <span className="text-[10px] uppercase tracking-wider">Projects</span>
          </button>

          {/* Guide Tab */}
          <button
            onClick={() => setCurrentScreen('tips')}
            className={`flex flex-col items-center justify-center w-20 h-full transition-all cursor-pointer ${
              currentScreen === 'tips' ? 'text-indigo-400 font-bold scale-105' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <BookOpen className="w-5 h-5 mb-1" />
            <span className="text-[10px] uppercase tracking-wider">Guide</span>
          </button>
        </div>
      )}
    </div>
  );
}
