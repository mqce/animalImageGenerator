import { useState } from 'react';
import { Camera, RefreshCw, Palette, Wand2, Copy, Check } from 'lucide-react';

// --- データ定義 (ユーザー提供のリスト) ---
const COMMON_ELEMENTS = {
  body: [
    //"4等身~6等身",
    "手足は短かめ",
    //"指は3本〜4本で短くデフォルメされているか、毛に隠れて見えない",
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
    /*
    "高解像度・ディテール: 4K resolution, ultra detailed, photorealistic",
    "最先端の作品: trending on Artstation, masterpiece",
    "光の質: Soft, diffused lighting",
    "雰囲気: Subtle volumetric lighting",
    "被写界深度: Shallow depth of field または Bokeh",
    "レンズ: Cinematic wide-angle lens",
    "色調: Warm tones",
    "鮮やかさ: Muted colors",
    */
    "Grainy film photo（粒状感のあるフィルム写真）",
    //"Toy camera aesthetic",
    //"少し褪せた発色の写真",
    //"Disposable camera shot",
    "被写体の大きさ: 画面の10%〜20%",
  ],
  negative: [
    "ファンタジー要素（パステルカラー、光る眼、プラスチックの質感、キメラのような継ぎはぎのパーツ）",
    "アクセサリーや衣服など人工物",
    "猫","犬",
    "撮影者の指や影などの余計な写りこみ",
    "date stamp", "timestamp", "text",
    "professional photography",
    //"bokeh", "depth of field",
  ]
};

const VARIABLE_ELEMENTS = {
  eyes: [
    // 以前: "オコジョやハリネズミのような小さくて黒い目"
    "オコジョのように小さく、黒曜石のように深く黒い瞳。",
  ],
  nose: [
    // 以前: "無いか、毛に隠れて見えない"
    "鼻先は長い毛に覆われてほとんど見えないが、呼吸に合わせて毛の奥で小さな鼻孔がわずかに動いている気配がある。",

    // 以前: "カワウソのような鼻"
    "カワウソのように幅広く、濡れた革のような質感の鼻鏡。色は濃い茶色か黒で、表面には細かいしわがあり、常に湿り気を帯びて光っている。",

    // 以前: "リスのような小さく丸い鼻"
    "リスのように小さく、少し湿ったピンクがかった茶色の鼻。周囲の匂いを嗅ぎ取るために、絶えず小刻みにピクピクと動いている。",

    // 以前: "ハリネズミのようにつんと尖った鼻"
    "顔の先端につんと突き出た、少し湿った尖った鼻。鼻先は体温が高く、血色が透けてピンク色に見え、触れると柔らかそうな質感。",

    // 以前: "ウオンバットのような鼻"
    "ウォンバットのように平たく、頑丈で角質化したような質感の大きな鼻鏡。地面を掘ったり押したりするのに適した、少し乾燥して硬そうな見た目。",

    // 以前: "子猫のようなピンクの鼻"
    "子猫のように柔らかく、血色の良い鮮やかなピンク色の鼻鏡。非常に薄い皮膚で覆われており、少し湿って、温かみを感じさせる質感。"
  ],
  ears: [
    // 以前: "丸くて短い耳"
    "頭部に密着した、厚みのある丸くて短い耳。外側は短い毛で密に覆われているが、内側からは柔らかく細い毛が溢れるように生えている。",

    // 以前: "尖った耳"
    "警戒心を感じさせる、ピンと尖った三角形の耳。耳の先端には、リンクスのように数本の長い飾り毛がアンテナのように伸びている。",

    // 以前: "しなやかな程よい長さの耳"
    "筋肉の動きに合わせて柔軟に動く、程よい長さのしなやかな耳。薄い皮膚が光を透過し、耳の縁の産毛が光を受けて輝いている。",

    // 以前: "ウサギのように立った耳"
    "ウサギのように大きく直立した耳。強い日差しを浴びると、薄い皮膚の下に張り巡らされた毛細血管が透けて見え、生きている体温を感じさせる。",

    // 以前: "長くて垂れ下がった耳"
    "顔の横に重たげに垂れ下がった長い耳。耳の重みで付け根の毛が少し押し潰されており、柔らかな革のような質感が感じられる。"
  ],
  tail: [
    // 以前: "ふさふさしたリスのような尾"
    "リスのようにボリュームのある尾だが、毛並みは整っておらず、野生動物らしく不揃いに毛羽立っている。",

    // 以前: "短い、丸いポンポンのような尾"
    "お尻に付いた、短く丸い密集した毛玉のような尾。完璧な球体ではなく、座った時に地面に押し付けられて少し歪んでいる。",

    // 以前: "狐のような長い尾"
    "体の長さと同じくらいある、狐のような豊かで長い尾。動きに合わせて重たげに揺れ、先端の毛は地面を引きずったため少し擦り切れたり汚れたりしている。"
  ],
  fur: [
    "毛並みは密生しており、表面には硬い保護毛、内側には柔らかい下毛がある",
    "長めの毛が生えている",
    "ぼさぼさとした毛並み",
    "やわらかそうな少し長い毛が生えている"
  ],
  pattern: [
    // 以前: "グレーのグラデーション"
    "単色ではなく、一本一本の毛が白、黒、グレーの混じった「ごま塩」状態になった、複雑なグレーのグラデーション。背中側が濃く、腹側に向かって自然に淡くなる。",

    // 以前: "くすみ系（ダスティカラー）のグラデーション"
    "乾燥した土や枯草に溶け込むような、彩度の低いくすんだ色のグラデーション。日光で退色したような自然な色ムラがあり、野性味がある。",

    // 以前: "全身茶色"
    "全身が茶色だが、均一な色ではなく、赤褐色の強い部分や焦げ茶色の部分が混在する。毛先が日焼けして少し明るくなっている。",

    // 以前: "全身白"
    "全身が白い毛に覆われているが、雪のような純白ではなく、生活の中で付いたわずかな土汚れや、毛の油分による黄ばみが自然なリアルさを生んでいる。",

    // 以前: "白とグレー系のツートン" / "白と茶系のツートン"
    "腹側が白く、背中側が有色（グレーまたは茶系）のツートンカラー。色の境界線はくっきりとしておらず、両方の色の毛が不規則に混じり合って自然に移行している。",

    // 以前: "狐のような色"
    "赤狐のような錆びた赤褐色をベースに、手足の先が黒く、顎の下や胸元が白っぽくなっている、複雑で深みのある配色。",

    // 以前: "Asymmetrical markings（左右非対称の模様）"
    "顔や体に、自然発生的な左右非対称のブチ模様がある。人工的にデザインされたような模様ではなく、ランダムでいびつな形の模様。",

    // 以前: "斑点模様"
    "体に大小さまざまな斑点が散らばっている。斑点の輪郭はぼやけており、隣り合う斑点と繋がりそうな部分もある、自然で不規則なパターン。"
  ],
  action: [
    // 静止・休息系
    "周囲を警戒しながら、筋肉にわずかな緊張を残してじっとしている。",
    "後足で体重を支え、少し猫背気味に座っている。地面に接したお尻の毛が少し潰れている。",
    "手足を体の下に完璧に折りたたんだ香箱座りをしている。リラックスして、呼吸に合わせて背中がゆっくりと上下している。",
    "地面に顎を乗せて伏せをし、完全に脱力して休んでいる。目はうつらうつらと半開きになっている。",
    "体を丸めてアンモナイトのように眠っている。鼻先を尻尾の毛に埋めて、体温を逃さないようにしている。",
    "野生動物としては無防備なほどリラックスし、仰向けに寝て柔らかい腹部の毛を晒している。",
    "お腹を上にして、手足をだらりと投げ出してだらけている。暑さで少しバテているような様子。",
    "舌を出して熱心に毛繕いをしている最中。舐めた部分の毛が唾液で濡れて束感が出ている。",

    // 動作・インタラクション系
    "不思議そうな顔で首をかしげ、片方の耳をわずかに下げて音源を探っている。",
    "片手を上げて静止し、次の動作に移ろうか迷っているような、招き猫に似たポーズ。",
    "低い姿勢で、筋肉を躍動させて走っている。蹴り上げた足元の土がわずかに舞い上がっている。",
    "楽しそうに、または驚いたように、バネのような反動をつけて小さく跳ねている。",
    "慎重な足取りで、地面の匂いを嗅ぎながら四つん這いで歩いている。",
    "周囲を遠くまで見渡すために、バランスを取りながら後ろ足だけで立ち上がっている（ミーアキャット立ち）。",
    "鋭い爪を樹皮に食い込ませ、必死な様子で木登りをしている。重力で体の毛が下方向に引っ張られている。",
    "前足で土を掻き、穴を掘ろうとしている。爪の間や鼻先に土が付着している。",
    "躍動感あふれるジャンプで空中にいる瞬間。手足が伸び切り、毛が風圧で後ろになびいている。",
    "小さな葉っぱや小枝を口にくわえ、落とさないようにしっかりと運んでいる。",
    "鼻をひくつかせながら、野生の花やきのこの匂いを熱心にかいでいる。鼻先が対象物に触れそうになっている。",
    "頬袋がはちきれんばかりに膨らむほど、エサ（ベリーやナッツ）を頬張っている。口の端から食べかすが少しこぼれている。",
    "器用に両手を使って木の実などを持ち、口元に運んでかじっている。指の関節の動きがリアルに見える。",

    // 環境・情景系
    "自分より大きな葉っぱやキノコの傘の下に潜り込み、雨や日差しから身を隠している。",
    "木の上や草むらにいる小さな虫などの獲物を、瞬きもせずじっと見つめてロックオンしている。",
    "地面に落ちた影や、木漏れ日の光の斑点を、実体のあるものだと思って追いかけている。",
    "冷たい雪の上に座り、白い息を吐きながら、空から降ってくる雪を見上げている。毛に雪の結晶が付着している。",
    "冷たい雨粒を避けるように、岩陰や木の根元で小さく丸まって震えている。表面の毛が雨で濡れて束になっている。",
    "目を細め、太陽の光を全身に浴びて、暖かさにうっとりとしている。",
    "丘の上に立ち、強い風に吹かれて耳や長い毛が激しく揺れている。風に耐えるように少し踏ん張っている。",
    "水たまりや小川に口をつけ、水面を波立たせながらピチャピチャと水を飲んでいる。",
    "積み重なった大量の落ち葉の中に潜り込み、顔だけ出してかくれんぼしている。",
    "木の根元の窪みにフィットするように体を預け、穏やかな日差しの中で日向ぼっこをしている。",
    "湿った森の床にある、ふわふわの厚い苔の上に、気持ちよさそうに体を投げ出して横たわっている。",
    "太陽で温められた平らな岩の上に、体を平たくして張り付くように寝ている。",
    "色づいた乾燥した落ち葉をわざと踏みしめ、カサカサという音と感触を楽しんでいる足元。",
    "大きな葉を人間のように傘代わりにして頭に乗せ、雨宿りしているユーモラスだが必死な姿。",
    "夜空に浮かぶ月に向かって、首を伸ばして小さく遠吠えのような声を上げている（鳴いている）。"
  ]
};
// --- ヘルパー関数 ---

const getRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export default function App() {
  // APIキーを環境変数から取得
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  
  const [loading, setLoading] = useState(false);
  const [step1Text, setStep1Text] = useState('');
  const [step2Text, setStep2Text] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16');

  // Step 1: ベーステキストの生成 (クライアントサイドで完結)
  const generateStep1 = () => {
    setLoading(true);
    setStep2Text('');
    setError('');
    setCopied(false);

    const animal = {
      eyes: getRandom(VARIABLE_ELEMENTS.eyes),
      nose: getRandom(VARIABLE_ELEMENTS.nose),
      ears: getRandom(VARIABLE_ELEMENTS.ears),
      tail: getRandom(VARIABLE_ELEMENTS.tail),
      fur: getRandom(VARIABLE_ELEMENTS.fur),
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
毛並みは${animal.fur}。
体の色は${animal.pattern}。

【現在の状態】
${animal.action}。
    `.trim();

    setStep1Text(description);
    
    // 自動的にStep 2へ進む（動物の外見情報とアクションを渡す）
    generateStep2(description, animal.action, aspectRatio);
  };

  // Step 2: Gemini APIを使用して背景・環境と動物の配置を生成
  const generateStep2 = async (baseText: string, action: string, ratio: '9:16' | '16:9') => {
    if (!apiKey) {
      setError('APIキーが設定されていません');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `
あなたは偶然そこに居合わせた動物を見つけて、${ratio === '9:16' ? 'スマホの縦長' : '横長'}の向きで撮影しようとしています。
以下の「動物の現在の状態（動作）」を元に、2つの情報を生成してください。

## 動物の現在の状態
${action}

## 生成してほしい情報

### 1. 背景と環境
動物の「現在の状態（動作）」に合わせて、最適な背景、地面、周囲の環境を詳細に描写してください。
実在感を重視し、ファンタジーやアニメ調ではなく、自然な風景を描写してください。

### 2. 動物の配置と向き
写真の中に動物をどの位置に、どの向きで配置すると良いかを考慮して記述してください。

## 出力形式
以下の形式で日本語で出力してください。余計な解説は不要です。

【背景と環境】
（ここに背景・環境の描写を記述）

【動物の配置】
（ここに配置・向きの情報を記述）
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

      const apiResult = candidate.content.parts[0].text;
      
      // 最終プロンプトをプログラム内で組み立てる
      const aspectRatioText = ratio === '9:16' ? '**9:16の縦長**' : '**16:9の横長**';
      const finalPrompt = `
      想像上の動物の写真を作りたい。
      リアルな、作り物でない、生命感のある動物。
      あなたは偶然そこに居合わせてその動物のスナップショットを撮りました。その写真を${aspectRatioText}で生成してください。
${baseText}

${apiResult}

【撮影条件】
${COMMON_ELEMENTS.shooting.join('\n')}

【禁止事項】
${COMMON_ELEMENTS.negative.join('、')}
      `.trim();
      
      setStep2Text(finalPrompt);

    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : '不明なエラーが発生しました';
      setError('Step 2 Error: ' + errorMessage);
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
    } catch (err) {
      console.error('Copy failed', err);
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-slate-500 mt-1">実在しそうな「未知の動物」の画像生成用プロンプトを作成します</p>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          
          {/* Left Column: Controls & Process */}
          <div className="space-y-6">
            
            {/* Control Panel */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
              {/* Aspect Ratio Selection */}
              <div className="flex gap-2">
                <button
                  onClick={() => setAspectRatio('9:16')}
                  disabled={loading}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all
                    ${aspectRatio === '9:16'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  9:16 (縦長)
                </button>
                <button
                  onClick={() => setAspectRatio('16:9')}
                  disabled={loading}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all
                    ${aspectRatio === '16:9'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  16:9 (横長)
                </button>
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
                  <div className="p-4 bg-slate-50 min-h-[100px] text-sm leading-relaxed whitespace-pre-line text-slate-700">
                    {step1Text || "待機中..."}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Result (Prompt) */}
          <div className="flex flex-col h-full">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex-grow flex flex-col h-full min-h-[500px]">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-indigo-900 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-indigo-500" />
                  生成プロンプト
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
                      className="w-full h-full min-h-[300px] bg-white border border-gray-300 rounded-lg p-4 font-mono text-sm leading-relaxed text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={step2Text}
                      onChange={(e) => setStep2Text(e.target.value)}
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
