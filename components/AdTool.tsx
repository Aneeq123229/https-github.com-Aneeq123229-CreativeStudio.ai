import React, { useState } from 'react';
import { generateAdCopy, generateImage } from '../services/geminiService';
import { Loader2, Zap, Copy } from 'lucide-react';

export const AdTool: React.FC = () => {
  const [product, setProduct] = useState('');
  const [audience, setAudience] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ headline: string; body: string; image?: string } | null>(null);

  const handleGenerate = async () => {
    if (!product || !audience) return;
    setLoading(true);
    try {
      // Parallel execution for speed
      const copyPromise = generateAdCopy(product, audience);
      const imagePromise = generateImage(`Professional product photography of ${product}, promotional marketing shot, studio lighting, high quality, 4k`, "1:1");
      
      const [copy, image] = await Promise.all([copyPromise, imagePromise]);
      setData({ ...copy, image });
    } catch (error) {
      alert("Failed to generate ad campaign.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Ad Campaign Generator</h2>
        <p className="text-slate-400">Generate high-converting copy and visuals simultaneously.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input */}
        <div className="lg:col-span-1 space-y-6 bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
           <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Product/Service</label>
            <input
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="e.g. SlimWallet X"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Target Audience</label>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="e.g. Business travelers, age 25-40"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !product || !audience}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 transition-all ${
               loading || !product || !audience
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg hover:shadow-emerald-500/25'
            }`}
          >
             {loading ? <Loader2 className="animate-spin" /> : <Zap className="w-5 h-5" />}
             <span>Launch Campaign</span>
          </button>
        </div>

        {/* Output - Ad Mockup */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-700 p-8 flex items-center justify-center">
            {data ? (
                <div className="bg-white rounded-xl overflow-hidden shadow-2xl max-w-sm w-full animate-in fade-in zoom-in duration-500">
                    <div className="p-4 flex items-center space-x-2 border-b border-gray-100">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div>
                            <div className="h-2 w-20 bg-gray-200 rounded mb-1"></div>
                            <div className="h-2 w-12 bg-gray-100 rounded"></div>
                        </div>
                    </div>
                    <div className="p-4">
                         <p className="text-sm text-gray-800 mb-3">{data.body}</p>
                    </div>
                    {data.image && (
                         <div className="w-full aspect-square bg-gray-100">
                            <img src={data.image} alt="Ad Visual" className="w-full h-full object-cover" />
                         </div>
                    )}
                    <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between items-center">
                         <div className="text-xs text-gray-500 uppercase font-bold tracking-wide">Sponsored</div>
                         <div className="font-bold text-gray-900">{data.headline}</div>
                         <button className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded">Learn More</button>
                    </div>
                </div>
            ) : (
                <div className="text-center text-slate-600">
                    <div className="w-20 h-20 border-2 border-dashed border-slate-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <span className="text-2xl">📢</span>
                    </div>
                    <p>Ad Preview will generate here</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
