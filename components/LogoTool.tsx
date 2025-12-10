import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { Loader2, Download, RefreshCw } from 'lucide-react';

export const LogoTool: React.FC = () => {
  const [brandName, setBrandName] = useState('');
  const [style, setStyle] = useState('Minimalist');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!brandName) return;
    setLoading(true);
    try {
      const prompt = `A professional, vector-style logo for a brand named "${brandName}". Style: ${style}. High contrast, vector graphics, white background, masterpiece, 4k.`;
      const base64Image = await generateImage(prompt, "1:1");
      setResult(base64Image);
    } catch (error) {
      alert("Failed to generate logo. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Logo Designer</h2>
        <p className="text-slate-400">Create professional brand identities in seconds.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6 bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Brand Name</label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g. Nexus Tech"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Style</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option>Minimalist</option>
              <option>Futuristic/Cyberpunk</option>
              <option>Vintage/Retro</option>
              <option>Abstract</option>
              <option>3D Glossy</option>
              <option>Hand Drawn</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !brandName}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 transition-all ${
              loading || !brandName
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg hover:shadow-indigo-500/25'
            }`}
          >
            {loading ? (
              <><Loader2 className="animate-spin" /> <span>Designing...</span></>
            ) : (
              <><RefreshCw className="w-5 h-5" /> <span>Generate Logo</span></>
            )}
          </button>
        </div>

        {/* Result */}
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-slate-900 rounded-2xl border border-slate-700 p-4 relative overflow-hidden group">
          {result ? (
            <>
              <img src={result} alt="Generated Logo" className="w-full h-auto rounded-lg shadow-2xl max-w-sm" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <a 
                  href={result} 
                  download={`logo-${brandName}.png`}
                  className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold flex items-center space-x-2 hover:scale-105 transition-transform"
                >
                  <Download className="w-5 h-5" /> <span>Download PNG</span>
                </a>
              </div>
            </>
          ) : (
            <div className="text-center text-slate-500">
              <div className="w-20 h-20 bg-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">🎨</span>
              </div>
              <p>Your masterpiece will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
