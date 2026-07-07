import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Film, Plus, Trash2, Calendar, Clock, Layers, Sparkles, Search, MessageSquare, AlertCircle } from 'lucide-react';
import { Project } from '../types';

interface ProjectsScreenProps {
  projects: Project[];
  onCreateProject: (data: { title: string; description: string }) => void;
  onDeleteProject: (id: string) => void;
  onSelectProject: (id: string) => void;
}

export function ProjectsScreen({ projects, onCreateProject, onDeleteProject, onSelectProject }: ProjectsScreenProps) {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreateProject({ title: title.trim(), description: desc.trim() });
    setTitle('');
    setDesc('');
    setShowModal(false);
  };

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#0A0A1A]">
      {/* Top Banner / Header */}
      <div className="py-5 md:py-0 md:h-[76px] px-6 md:px-8 bg-[#10101e] border-b border-[#2D2D4A] flex flex-col md:flex-row md:items-center justify-between sticky top-0 z-20 backdrop-blur-md gap-4 flex-shrink-0">
        <div className="flex items-center space-x-6">
          <h1 className="text-2.5xl md:text-3xl font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-[#6366F1] to-[#A855F7] font-display">
            VIDEOCREATOR
          </h1>
          <span className="hidden md:inline-block text-[10px] font-black uppercase tracking-[0.25em] text-[#94A3B8] border-l border-[#2D2D4A] pl-5">
            PROJECTS WORKSPACE
          </span>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH PROJECTS..."
              className="pl-10 pr-4 py-2.5 bg-[#1A1A2E] border border-[#2D2D4A] rounded-xl text-[10px] font-bold tracking-wider text-slate-200 placeholder-[#94A3B8] focus:outline-none focus:border-[#6366F1] w-full md:w-52 transition-colors uppercase font-mono"
            />
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-[#6366F1] hover:bg-[#6366F1]/90 text-white px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 cursor-pointer flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            NEW PROJECT
          </button>
        </div>
      </div>

      {/* Main projects container */}
      <div className="flex-1 overflow-y-auto p-6 bg-[#05050A]">
        {filteredProjects.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto py-12">
            <div className="w-20 h-20 rounded-full bg-[#10101e] border-2 border-dashed border-[#2D2D4A] flex items-center justify-center mb-6 shadow-2xl">
              <Film className="w-8 h-8 text-[#6366F1]" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-slate-100 font-display">No projects found</h3>
            <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
              {searchQuery
                ? "We couldn't find any projects matching your search criteria. Try typing a different keyword!"
                : "Create your first professional cinematic project. Layer multiple video files, ambient audio tracks, and animated text overlays."}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowModal(true)}
                className="mt-6 px-6 py-3 bg-[#6366F1] hover:bg-[#6366F1]/90 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
              >
                Create Project
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative bg-[#0F0F1E] border border-[#2D2D4A] rounded-2xl overflow-hidden hover:border-[#6366F1] transition-all hover:shadow-[0_8px_30px_rgba(99,102,241,0.06)] flex flex-col justify-between"
              >
                {/* Simulated Thumbnail */}
                <div
                  onClick={() => onSelectProject(project.id)}
                  className="h-36 bg-[#1A1A2E] flex items-center justify-center border-b border-[#2D2D4A] relative cursor-pointer group-hover:bg-[#1A1A2E]/80 transition-all"
                >
                  {/* Subtle color waves inside thumbnail */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/20 via-[#10101E]/40 to-transparent opacity-80" />
                  
                  {/* Glowing center icon */}
                  <div className="w-12 h-12 rounded-full bg-[#10101E] border border-[#2D2D4A] flex items-center justify-center group-hover:scale-115 group-hover:border-[#6366F1]/50 group-hover:shadow-[0_0_12px_rgba(99,102,241,0.2)] transition-all">
                    <Film className="w-5 h-5 text-[#6366F1] group-hover:text-indigo-300" />
                  </div>

                  {/* Absolute Badge: Duration */}
                  <span className="absolute bottom-3 right-3 text-[9px] font-mono font-black tracking-wider uppercase bg-black/75 border border-[#2D2D4A] text-[#94A3B8] px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#6366F1]" />
                    {formatDuration(project.duration_seconds)}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="cursor-pointer" onClick={() => onSelectProject(project.id)}>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#94A3B8] block mb-1">
                      Project Composition
                    </span>
                    <h4 className="font-black text-slate-100 text-lg leading-snug tracking-tighter uppercase font-display group-hover:text-[#6366F1] transition-colors">
                      {project.title}
                    </h4>
                    <p className="text-xs text-[#94A3B8] mt-2 line-clamp-2 leading-relaxed">
                      {project.description || 'No description provided.'}
                    </p>
                  </div>

                  {/* Stats Counter & Trash button */}
                  <div className="flex items-center justify-between mt-5 pt-3 border-t border-[#2D2D4A]">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-wider text-[#94A3B8]">
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[#6366F1]" />
                        {project.metadata?.clipCount || 0} CLIPS
                      </span>
                      <span className="w-1.5 h-1.5 bg-[#2D2D4A] rounded-full" />
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-purple-400" />
                        {new Date(project.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setProjectToDelete(project);
                      }}
                      className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* NEW PROJECT DIALOG */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="w-full max-w-md bg-[#10101e] border border-[#2D2D4A] rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#6366F1] animate-pulse" />
                  <h3 className="text-lg font-black uppercase tracking-tight text-slate-100 font-display">Create Video Project</h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.2em] mb-2">
                    PROJECT NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="E.G. RETROWAVE STREET JOURNEY"
                    className="w-full bg-[#1A1A2E] border border-[#2D2D4A] rounded-xl p-3 text-slate-200 text-xs font-bold uppercase tracking-wide placeholder-slate-600 focus:outline-none focus:border-[#6366F1] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.2em] mb-2">
                    DESCRIPTION
                  </label>
                  <textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="DESCRIBE YOUR CINEMATIC WORKFLOW GOALS..."
                    rows={3}
                    className="w-full bg-[#1A1A2E] border border-[#2D2D4A] rounded-xl p-3 text-slate-200 text-xs font-bold uppercase tracking-wide placeholder-slate-600 focus:outline-none focus:border-[#6366F1] transition-colors resize-none"
                  />
                </div>

                <div className="pt-4 border-t border-[#2D2D4A] flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-slate-400 hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!title.trim()}
                    className="flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-[#6366F1] hover:bg-[#6366F1]/90 text-white disabled:opacity-40 disabled:hover:bg-[#6366F1] transition-all shadow-lg shadow-indigo-600/25"
                  >
                    Create Composition
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONFIRM DELETE DIALOG */}
      <AnimatePresence>
        {projectToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-[#10101e] border border-[#EF4444]/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-start gap-4 mb-5">
                <div className="p-3 bg-[#EF4444]/10 border border-[#EF4444]/25 text-[#EF4444] rounded-xl">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black uppercase tracking-tight text-slate-100 font-display">Delete Project?</h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed mt-1.5">
                    Are you sure you want to permanently delete <span className="font-bold text-slate-200">"{projectToDelete.title}"</span>? This will wipe all multi-track clips, audio elements, and text annotations.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setProjectToDelete(null)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-[#94A3B8] hover:bg-slate-800 transition-colors border border-transparent"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onDeleteProject(projectToDelete.id);
                    setProjectToDelete(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest bg-[#EF4444] hover:bg-red-500 text-white transition-all shadow-lg shadow-red-600/10"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple internal X icon to replace Lucide dependency if needed
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
