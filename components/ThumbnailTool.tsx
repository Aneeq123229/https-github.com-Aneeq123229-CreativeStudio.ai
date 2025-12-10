import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { Loader2, Download, Image as ImageIcon } from 'lucide-react';

export const ThumbnailTool: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!title) return;
    setLoading(true);
    try {
      const prompt = `A viral YouTube thumbnail for a video titled "${title}". Context: ${description}. High saturation, expressive faces, bold text overlays, 4k resolution, hyper-realistic. Aspect ratio 16:9.`;
      const base64Image = await generateImage(prompt, "16:9");
      setResult(base64Image);
    } catch (error) {
      alert("Failed to generate thumbnail.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Thumbnail Creator</h2>
        <p className="text-slate-400">Boost your CTR with AI-generated thumbnails.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Video Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                placeholder="e.g. I Spent 24 Hours in VR"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Visual Description/Vibe</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none h-24 resize-none"
                placeholder="e.g. Shocked face on left, futuristic city background, neon red arrows..."
              />
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              disabled={loading || !title}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 transition-all h-full ${
                loading || !title
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg hover:shadow-cyan-500/25'
              }`}
            >
               {loading ? <Loader2 className="animate-spin" /> : <ImageIcon className="w-5 h-5" />}
               <span>Generate</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl border border-slate-700 p-2 min-h-[300px] flex items-center justify-center relative group overflow-hidden">
           {result ? (
            <>
              <img src={result} alt="Thumbnail" className="w-full h-auto rounded-xl shadow-2xl" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <a 
                  href={result} 
                  download={`thumbnail-${title.slice(0, 10)}.png`}
                  className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold flex items-center space-x-2 hover:scale-105 transition-transform"
                >
                  <Download className="w-5 h-5" /> <span>Download 16:9</span>
                </a>
              </div>
            </>
          ) : (
            <div className="text-center text-slate-500">
               <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
               <p>Preview Area (16:9)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
