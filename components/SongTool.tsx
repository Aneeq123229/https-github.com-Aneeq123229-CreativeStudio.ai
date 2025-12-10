import React, { useState, useRef } from 'react';
import { generateSongDemo } from '../services/geminiService';
import { Loader2, Music, Play, Pause, Volume2 } from 'lucide-react';

export const SongTool: React.FC = () => {
  const [genre, setGenre] = useState('Pop');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [songData, setSongData] = useState<{ lyrics: string; audio: string } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    setSongData(null);
    stopAudio();
    try {
      const result = await generateSongDemo(genre, topic);
      setSongData(result);
    } catch (error) {
      alert("Failed to generate song demo.");
    } finally {
      setLoading(false);
    }
  };

  const decodeAudioData = async (base64String: string, context: AudioContext): Promise<AudioBuffer> => {
    const binaryString = atob(base64String);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return await context.decodeAudioData(bytes.buffer);
  };

  const playAudio = async () => {
    if (!songData?.audio) return;
    
    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
    }
    const ctx = audioContextRef.current;
    
    // Stop previous
    if (sourceNodeRef.current) {
        try { sourceNodeRef.current.stop(); } catch (e) {}
    }

    try {
        const audioBuffer = await decodeAudioData(songData.audio, ctx);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => setIsPlaying(false);
        source.start();
        sourceNodeRef.current = source;
        setIsPlaying(true);
    } catch (e) {
        console.error("Audio playback error", e);
    }
  };

  const stopAudio = () => {
      if (sourceNodeRef.current) {
          try { sourceNodeRef.current.stop(); } catch(e) {}
          setIsPlaying(false);
      }
  };

  const togglePlayback = () => {
      if (isPlaying) stopAudio();
      else playAudio();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Songwriter Studio</h2>
        <p className="text-slate-400">Generate lyrics and vocal demos instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6 bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Topic/Theme</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-pink-500 outline-none"
              placeholder="e.g. A breakup in the summer rain"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Genre</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-pink-500 outline-none"
            >
              <option>Pop</option>
              <option>R&B</option>
              <option>Hip Hop</option>
              <option>Country</option>
              <option>Rock</option>
              <option>Electronic</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !topic}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 transition-all ${
               loading || !topic
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-pink-600 hover:bg-pink-500 text-white shadow-lg hover:shadow-pink-500/25'
            }`}
          >
             {loading ? <Loader2 className="animate-spin" /> : <Music className="w-5 h-5" />}
             <span>Compose Demo</span>
          </button>
        </div>

        <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6 flex flex-col h-full min-h-[300px]">
           {songData ? (
             <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center text-pink-400">
                            <Volume2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-white font-medium">AI Vocal Demo</h3>
                            <p className="text-xs text-slate-500">Duration: ~10s</p>
                        </div>
                    </div>
                    <button 
                        onClick={togglePlayback}
                        className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform text-slate-900"
                    >
                        {isPlaying ? <Pause className="fill-current" /> : <Play className="fill-current ml-1" />}
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto bg-slate-950 rounded-xl p-4 border border-slate-800">
                    <h4 className="text-slate-500 text-xs uppercase tracking-widest mb-3">Lyrics</h4>
                    <p className="text-lg text-slate-200 whitespace-pre-line font-serif leading-relaxed italic">
                        "{songData.lyrics}"
                    </p>
                </div>
             </div>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                <Music className="w-16 h-16 mb-4 opacity-30" />
                <p>Lyrics and audio will appear here</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
