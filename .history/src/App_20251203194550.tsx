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
    <div className="app-shell">
      <div className="app-container">
        <header className="app-header">
          <div>
            <h1 className="app-title">
              <Sparkles className="icon-accent" />
              空想動物プロンプトビルダー
            </h1>
            <p className="app-subtitle">
              実在しそうな「未知の動物」の画像生成用プロンプトをつくります
            </p>
          </div>
        </header>

        <div className="content-grid">
          <section className="column">
            <div className="card">
              <div className="card-heading">
                <h2 className="card-title">
                  <Wand2 className="icon-accent" />
                  生成コントロール
                </h2>
              </div>

              <button
                onClick={generateStep1}
                disabled={loading}
                className={`primary-button ${loading ? 'is-loading' : ''}`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="spin icon-sm" />
                    プロンプト生成中...
                  </>
                ) : (
                  <>
                    <Camera className="icon-sm" />
                    新しい動物を発見する
                  </>
                )}
              </button>

              {error && <p className="inline-alert">{error}</p>}
            </div>

            <div className={`card step-card ${step1Text ? 'is-active' : ''}`}>
              <div className="step-header">
                <span className="step-label">STEP 1</span>
                <span className="step-caption">ベース記述の構築</span>
              </div>
              <div className="step-body">
                {step1Text || '待機中...'}
              </div>
            </div>

            <div className="card log-card">
              <div className="log-header">System Logs</div>
              <div className="log-body">
                {logs.map((log, i) => (
                  <div key={i} className="log-line">
                    {`> ${log}`}
                  </div>
                ))}
                {loading && <div className="log-line is-muted">{`> Processing...`}</div>}
              </div>
            </div>
          </section>

          <section className="column">
            <div className="card prompt-card">
              <div className="prompt-header">
                <h3>
                  <Palette className="icon-accent" />
                  生成プロンプト (STEP 2)
                </h3>
                {step2Text && !loading && (
                  <span className="status-pill">Ready to Copy</span>
                )}
              </div>

              <div className="prompt-body">
                {step2Text ? (
                  <>
                    <textarea
                      readOnly
                      value={step2Text}
                      className="prompt-output"
                    />
                    <div className="prompt-action">
                      <button
                        onClick={copyToClipboard}
                        className={`copy-button ${copied ? 'is-success' : ''}`}
                      >
                        {copied ? (
                          <>
                            <Check className="icon-sm" />
                            コピーしました！
                          </>
                        ) : (
                          <>
                            <Copy className="icon-sm" />
                            プロンプトをコピー
                          </>
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="empty-state">
                    {loading ? (
                      <>
                        <div className="loader" />
                        <p>プロンプトを生成中...</p>
                      </>
                    ) : (
                      <>
                        <Wand2 className="icon-ghost" />
                        <p>左側のボタンで生成を開始してください</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}