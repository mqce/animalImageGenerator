import { useState } from 'react';
import { Camera, Sparkles, RefreshCw, Palette, Wand2, Copy, Check } from 'lucide-react';

// --- データ定義 (ユーザー提供のリスト) ---

const COMMON_ELEMENTS = {
  body: [
    "頭は大きめ（3等身~5等身）",
    "輪郭は丸みを帯びていて比較的ずんぐりしている",
    "手足は短かめ",
    "ふわふわで柔らかい、手触りの良さそうな毛並み",
    "指は3本〜4本で短くデフォルメされているか、毛に隠れて見えない",
    "モンスターではなく、ペットやコンパニオンのような存在",
    "あくまでも実在しそうな動物の姿にする"
  ],
  face: [
    "あどけない印象の顔",
    "つぶらな瞳",
    "目と鼻口の距離は近め",
    "両目の間隔を少し離す",
    "おっとり、やさしそう顔つき",
    "口は小さい、または毛に隠れて見えない"
  ],
  shooting: [
    "高解像度・ディテール: 4K resolution, ultra detailed, photorealistic",
    "最先端の作品: trending on Artstation, masterpiece",
    "光の質: Soft, diffused lighting",
    "雰囲気: Subtle volumetric lighting",
    "被写界深度: Shallow depth of field または Bokeh",
    "レンズ: Cinematic wide-angle lens",
    "色調: Warm tones",
    "鮮やかさ: Muted colors"
  ],
  negative: [
    "ファンタジー要素（パステルカラー、光る眼、プラスチックの質感、キメラのような継ぎはぎのパーツ）",
    "アクセサリーや衣服など人工物",
    "細かく描写された手足の指"
  ]
};

const VARIABLE_ELEMENTS = {
  eyes: [
    "オコジョやハリネズミのような小さくて黒い目",
    "猫のような大きくて丸い目",
    "シマエナガのような点の瞳",
    "ねむたそうに半開きの目"
  ],
  nose: [
    "鼻は見えない",
    "カワウソのような鼻",
    "リスのような小さく丸い鼻",
    "ハリネズミのようにつんと尖った鼻",
    "ウオンバットのような鼻",
    "子猫のようなピンクの鼻"
  ],
  ears: [
    "丸くて短い耳",
    "猫やキツネのような耳",
    "ウサギのように立った耳",
    "長くて垂れ下がった耳"
  ],
  tail: [
    "ふさふさしたリスのような尾",
    "短い、丸いポンポンのような尾",
    "狐のような長い尾"
  ],
  pattern: [
    "グレーのグラデーション",
    "くすみ系（ダスティカラー）のグラデーション",
    "全身茶色",
    "全身白",
    "白とグレー系のツートン",
    "白と茶系のツートン",
    "狐のような色",
    "猫のような模様"
  ],
  action: [
    "じっとしている", "座っている", "香箱座りをしている", "伏せをして休んでいる", "丸まって眠っている",
    "仰向けに寝ている", "お腹を上にして、だらけている", "毛繕いをしている最中", "首をかしげている",
    "片手を上げて（招き猫のように）挨拶している", "走っている", "跳ねている（小さなジャンプ）",
    "四つん這いで歩いている", "後ろ足で立っている", "木登りをしている", "穴を掘ろうとしている",
    "飛び跳ねている（空中にいる瞬間）", "何か（例：小さな葉っぱ）を咥えて運んでいる",
    "花やきのこの匂いをかいでいる", "エサ（例：ベリー、ナッツ）を頬張っている",
    "両手で何かを持っている（例：木の実）", "自分より大きな葉っぱや傘の下に隠れている",
    "なにかを（例：木、虫）じっと見つめている", "影や光を追いかけている",
    "雪の上に座って、雪を見上げている", "雨粒を避けるように小さく丸まっている",
    "太陽の光を浴びてうっとりしている", "風に吹かれて耳が揺れている", "水を飲んでいる",
    "落ち葉の中でかくれんぼしている", "木の根元で日向ぼっこをしている",
    "ふわふわの苔の上に気持ちよさそうに横たわっている", "岩の上に寝ている",
    "色づいた落ち葉を踏んで、カサカサという音を楽しんでいる",
    "大きな葉を傘代わりにして雨宿りしている", "月に向かって小さく鳴いている"
  ]
};

// --- ヘルパー関数 ---

const getRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export default function App() {
  // APIキーを固定値に変更
  const apiKey = 'AIzaSyDVeVJZuYyfkZ2t2p8O0KGq-M1ZZpEc9ZY';
  
  const [loading, setLoading] = useState(false);
  const [step1Text, setStep1Text] = useState('');
  const [step2Text, setStep2Text] = useState('');
  const [error, setError] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const addLog = (message: string) => setLogs(prev => [...prev, message]);

  // Step 1: ベーステキストの生成 (クライアントサイドで完結)
  const generateStep1 = () => {
    setLoading(true);
    setStep2Text('');
    setError('');
    setLogs(['Step 1: 動物の特徴と動作をランダムに決定中...']);
    setCopied(false);

    const animal = {
      eyes: getRandom(VARIABLE_ELEMENTS.eyes),
      nose: getRandom(VARIABLE_ELEMENTS.nose),
      ears: getRandom(VARIABLE_ELEMENTS.ears),
      tail: getRandom(VARIABLE_ELEMENTS.tail),
      pattern: getRandom(VARIABLE_ELEMENTS.pattern),
      action: getRandom(VARIABLE_ELEMENTS.action),
    };

    const description = `
【動物の外見】
${COMMON_ELEMENTS.body.join('。')}
${COMMON_ELEMENTS.face.join('。')}
目は${animal.eyes}。
鼻は${animal.nose}。
耳は${animal.ears}。
尻尾は${animal.tail}。
体の色は${animal.pattern}。

【現在の状態】
${animal.action}。
    `.trim();

    setStep1Text(description);
    addLog('Step 1: 完了');
    
    // 自動的にStep 2へ進む
    generateStep2(description);
  };

  // Step 2: Gemini APIを使用して撮影条件と詳細プロンプトを生成
  const generateStep2 = async (baseText: string) => {
    if (!apiKey) {
      setError('APIキーが設定されていません');
      setLoading(false);
      return;
    }

    addLog('Step 2: Geminiが撮影条件と背景を考案中...');
    
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `
あなたはプロの野生動物写真家であり、コンセプトアーティストです。
以下の「架空の動物」の記述を元に、画像生成AI（Imagenなど）に入力するための**英語のプロンプト**を作成してください。

## 入力された動物の記述
${baseText}

## 制約事項
1. **実在感の追求**: ファンタジーやアニメ調ではなく、ナショナルジオグラフィックに載っているような「実在しそうな動物の写真」に見えるように描写してください。
2. **背景と環境**: 動物の「現在の状態（動作）」に合わせて、最適な背景、地面、周囲の環境を詳細に描写してください。
3. **撮影条件**: 以下の要素を含めて、写真としてのクオリティを高めてください。
   ${COMMON_ELEMENTS.shooting.join('\n   ')}
4. **禁止事項**: ${COMMON_ELEMENTS.negative.join(', ')} は含めないでください。

## 出力形式
英語のプロンプトのみを出力してください。余計な解説やMarkdownのコードブロックは不要です。プレーンテキストで出力してください。
              `
            }]
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) throw new Error(data.error.message);

      // candidatesの存在チェック (安全なアクセスのために追加)
      if (!data.candidates || data.candidates.length === 0) {
        console.error('Gemini API Response:', data); // デバッグ用にコンソール出力
        if (data.promptFeedback && data.promptFeedback.blockReason) {
            throw new Error(`生成がブロックされました。理由: ${data.promptFeedback.blockReason}`);
        }
        throw new Error('Geminiからの応答が空でした。もう一度お試しください。');
      }
      
      const candidate = data.candidates[0];
      if (!candidate.content || !candidate.content.parts || !candidate.content.parts[0]) {
         throw new Error('生成されたテキスト形式が不正です。');
      }

      const generatedPrompt = candidate.content.parts[0].text;
      setStep2Text(generatedPrompt);
      addLog('Step 2: 完了');
      addLog('プロンプト生成が完了しました');

    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : '不明なエラーが発生しました';
      setError('Step 2 Error: ' + errorMessage);
      addLog(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!step2Text) return;
    // iframe内でのクリップボード操作のため document.execCommand を使用
    const textArea = document.createElement("textarea");
    textArea.value = step2Text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      addLog('クリップボードにコピーしました');
    } catch (err) {
      console.error('Copy failed', err);
      addLog('コピーに失敗しました');
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="text-indigo-600" />
              空想動物プロンプトビルダー
            </h1>
            <p className="text-slate-500 mt-1">実在しそうな「未知の動物」の画像生成用プロンプトを作成します</p>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          
          {/* Left Column: Controls & Process */}
          <div className="space-y-6">
            
            {/* Control Panel */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-indigo-500" />
                  生成コントロール
                </h2>
              </div>
              
              <button
                onClick={generateStep1}
                disabled={loading}
                className={`w-full py-4 px-6 rounded-lg text-white font-medium text-lg flex items-center justify-center gap-2 transition-all shadow-md
                  ${loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg'}`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="animate-spin w-5 h-5" />
                    プロンプト生成中...
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5" />
                    新しい動物を発見する
                  </>
                )}
              </button>
              
              {error && (
                <div className="mt-3 text-red-600 bg-red-50 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Process Visualization */}
            <div className="space-y-4">
              {/* Step 1 Card */}
              <div className={`transition-all duration-500 ${step1Text ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4'}`}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-slate-100 px-4 py-2 border-b border-gray-200 flex items-center gap-2">
                    <span className="bg-slate-800 text-white text-xs font-bold px-2 py-0.5 rounded">STEP 1</span>
                    <span className="text-sm font-medium text-slate-700">ベース記述の構築</span>
                  </div>
                  <div className="p-4 bg-slate-50 min-h-[100px] text-sm leading-relaxed whitespace-pre-line text-slate-700">
                    {step1Text || "待機中..."}
                  </div>
                </div>
              </div>

              {/* Status Logs */}
              <div className="bg-gray-900 rounded-lg p-3 text-xs font-mono text-green-400 h-32 overflow-y-auto">
                <div className="text-gray-500 mb-1">--- System Logs ---</div>
                {logs.map((log, i) => (
                  <div key={i} className="mb-1">{`> ${log}`}</div>
                ))}
                {loading && <div className="animate-pulse">{`> Processing...`}</div>}
              </div>
            </div>
          </div>

          {/* Right Column: Result (Prompt) */}
          <div className="flex flex-col h-full">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex-grow flex flex-col h-full min-h-[500px]">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-indigo-900 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-indigo-500" />
                  生成プロンプト (STEP 2)
                </h3>
                {step2Text && !loading && (
                   <span className="text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full font-medium">
                     Ready to Copy
                   </span>
                )}
              </div>
              
              <div className="flex-grow bg-slate-50 p-6 flex flex-col relative">
                {step2Text ? (
                  <>
                    <textarea 
                      readOnly
                      className="w-full h-full min-h-[300px] bg-white border border-gray-300 rounded-lg p-4 font-mono text-sm leading-relaxed text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={step2Text}
                    />
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={copyToClipboard}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium shadow-sm transition-all
                          ${copied 
                            ? 'bg-green-500 text-white' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md'}`}
                      >
                        {copied ? (
                          <>
                            <Check className="w-5 h-5" />
                            コピーしました！
                          </>
                        ) : (
                          <>
                            <Copy className="w-5 h-5" />
                            プロンプトをコピー
                          </>
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex-grow flex flex-col items-center justify-center text-gray-400">
                    {loading ? (
                       <div className="text-center">
                        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="animate-pulse">プロンプトを生成中...</p>
                      </div>
                    ) : (
                      <>
                        <Wand2 className="w-16 h-16 mb-4 opacity-20" />
                        <p>左側のボタンで<br/>生成を開始してください</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}