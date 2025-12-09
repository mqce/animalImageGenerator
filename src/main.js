import './index.css';

const COMMON_ELEMENTS = {
  body: [
    "4等身~6等身",
    "手足は短かい",
    "四足歩行",
    "外形は曲線的な形状をしている",
    "約80%～90%の体表は外殻で覆われている",
    "外殻の隙間からロボットらしいケーブルやフレーム、機械部品などの部品が見える",
  ],
  face: [
    "目は少し離れていて、子供のような目の配置",
    "**鼻は無い**",
    "**口は無い**",
    "耳は無い",
    "おっとり、やさしそうな顔つき",
  ],
  shooting: [
    "Grainy film photo（粒状感のあるフィルム写真）",
    "被写体の大きさ: 画面の10%〜15%",
  ],
  negative: [
    "撮影者の指や影などの余計な写りこみ",
    "date stamp", "timestamp", "text",
    "professional photography",
  ]
};

const VARIABLE_ELEMENTS = {
  animal:["ハリネズミ","カワウソ","ウォンバット","ハムスター","ビーバー"],
  eyes:["外殻に埋め込まれた黒い半透明の小さな目。センサーが内蔵されている。"],
  tail:["尾は無い","バランスを取るための長い尾。","短くてぴょこぴょこ動く尾。","電線のような細い尾。"],
  outer:["マットな質感の白いセラミックで作られた外殻。外殻は頭部、背中、手足、関節、尻尾などの要素で分割されている。"],
  action:[
    "周囲を警戒しながら、筋肉にわずかな緊張を残してじっとしている。",
    "後足で体重を支え、少し猫背気味に座っている。",
    "手足を体の下に完璧に折りたたんだ香箱座りをしている。",
    "地面に顎を乗せて伏せをし、完全に脱力して休んでいる。",
    "体を丸めてアンモナイトのように眠っている。",
    "無防備なほどリラックスし、外殻の無い腹部を晒している。",
    "不思議そうな顔で首をかしげ、音源を探っている。",
    "低い姿勢で、筋肉を躍動させて走っている。蹴り上げた足元の土がわずかに舞い上がっている。",
    "楽しそうに、または驚いたように、反動をつけて小さく跳ねている。",
    "慎重な足取りで、地面の匂いを嗅ぎながら四つん這いで歩いている。",
    "周囲を遠くまで見渡すために、バランスを取りながら後ろ足だけで立ち上がっている（ミーアキャット立ち）。",
    "前足で土を掻き、穴を掘ろうとしている。足先に土が付着している。",
    "躍動感あふれるジャンプで空中にいる瞬間。",
    "自分より大きな葉っぱやキノコの傘の下に潜り込み、雨や日差しから身を隠している。",
    "木の上や草むらにいる小さな虫などの獲物を、見つめてロックオンしている。",
    "地面に落ちた影や、木漏れ日の光の斑点を、実体のあるものだと思って追いかけている。",
    "冷たい雪の上に座り、白い息を吐きながら、空から降ってくる雪を見上げている。",
    "冷たい雨粒を避けるように、岩陰や木の根元で小さく丸まって震えている。",
    "丘の上に立ち、強い風に吹かれてる。風に耐えるように少し踏ん張っている。",
    "積み重なった大量の落ち葉の中に潜り込み、顔だけ出してかくれんぼしている。",
    "木の根元の窪みにフィットするように体を預け、穏やかな日差しの中で日向ぼっこをしている。",
    "湿った森の床にある、ふわふわの厚い苔の上に、気持ちよさそうに体を投げ出して横たわっている。",
    "太陽で温められた平らな岩の上に、体を平たくして張り付くように寝ている。",
    "夜空に浮かぶ月に向かって、首を伸ばして小さく遠吠えのような声を上げている（鳴いている）。"
  ]
};


const ASPECT_TEXT = {
  '9:16': { orientation: 'スマホの縦長', display: '**9:16の縦長**' },
  '16:9': { orientation: '横長', display: '**16:9の横長**' }
};

const buildRobotDescription = robot => `
【ロボットの外見】
人類が滅んだあと、自然界で生きている動物型のロボット。
${robot.animal}の形状を参考に作られたロボットだが、**元の動物が何かわからないくらいに形状が抽象化されている**特に顔の特徴はほぼ失われている。
${COMMON_ELEMENTS.body.join('。')}
${COMMON_ELEMENTS.face.join('。')}
${robot.eyes}
${robot.tail}
${robot.outer}

【現在の状態】
${robot.action}。
`.trim();

const buildGeminiRequest = (action, ratio) => `
あなたは自然の中で野生化したロボットを見つけて、${ASPECT_TEXT[ratio].orientation}の向きで撮影しようとしています。
以下の「ロボットの現在の状態（動作）」を元に、2つの情報を生成してください。

## ロボットの現在の状態
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
`.trim();

const buildFinalPrompt = (baseText, apiResult, ratio) => `
自然の中で野生化したロボットの写真を作りたい。
あなたは偶然そこに居合わせてそのロボットのスナップショットを撮りました。その写真を${ASPECT_TEXT[ratio].display}で生成してください。
${baseText}

${apiResult}

【撮影条件】
${COMMON_ELEMENTS.shooting.join('\n')}

【禁止事項】
${COMMON_ELEMENTS.negative.join('、')}
`.trim();

const state = {
  loading: false,
  aspectRatio: '9:16',
  step1: '',
  step2: '',
  geminiPrompt: '',
  error: '',
  copied: false
};

const els = {
  btn916: document.getElementById('btn-9-16'),
  btn169: document.getElementById('btn-16-9'),
  btnGenerate: document.getElementById('btn-generate'),
  btnGenerateIcon: document.getElementById('btn-generate-icon'),
  btnGenerateText: document.getElementById('btn-generate-text'),
  errorBox: document.getElementById('error-box'),
  step1Text: document.getElementById('step1-text'),
  step2Text: document.getElementById('step2-text'),
  readyBadge: document.getElementById('ready-badge'),
  placeholder: document.getElementById('placeholder'),
  promptArea: document.getElementById('prompt-area'),
  loading: document.getElementById('loading-indicator'),
  btnCopy: document.getElementById('btn-copy'),
  geminiRequestText: document.getElementById('gemini-request-text')
};

const setAspectRatio = ratio => {
  state.aspectRatio = ratio;
  els.btn916.classList.toggle('bg-indigo-600', ratio === '9:16');
  els.btn916.classList.toggle('text-white', ratio === '9:16');
  els.btn916.classList.toggle('bg-gray-100', ratio !== '9:16');
  els.btn916.classList.toggle('text-gray-700', ratio !== '9:16');

  els.btn169.classList.toggle('bg-indigo-600', ratio === '16:9');
  els.btn169.classList.toggle('text-white', ratio === '16:9');
  els.btn169.classList.toggle('bg-gray-100', ratio !== '16:9');
  els.btn169.classList.toggle('text-gray-700', ratio !== '16:9');
};

const setLoading = isLoading => {
  state.loading = isLoading;
  els.loading.classList.toggle('hidden', !isLoading);
  els.btnGenerate.disabled = isLoading;
  els.btnGenerateIcon.textContent = isLoading ? '🔄' : '📷';
  els.btnGenerateText.textContent = isLoading ? 'プロンプト生成中...' : '新しい動物を発見する';
};

const setError = msg => {
  state.error = msg || '';
  els.errorBox.textContent = msg;
  els.errorBox.classList.toggle('hidden', !msg);
};

const showPrompt = text => {
  state.step2 = text;
  els.step2Text.value = text;
  els.promptArea.classList.toggle('hidden', !text);
  els.placeholder.classList.toggle('hidden', !!text);
  els.readyBadge.classList.toggle('hidden', !text || state.loading);
};

const setGeminiPrompt = text => {
  state.geminiPrompt = text;
  if (els.geminiRequestText) {
    els.geminiRequestText.value = text;
  }
};

const getRandom = arr => arr[Math.floor(Math.random() * arr.length)];

const generateStep1 = () => {
  setLoading(true);
  setError('');
  showPrompt('');
  setGeminiPrompt('');
  state.copied = false;

  const robot = {
    animal: getRandom(VARIABLE_ELEMENTS.animal),
    eyes: getRandom(VARIABLE_ELEMENTS.eyes),
    tail: getRandom(VARIABLE_ELEMENTS.tail),
    outer: getRandom(VARIABLE_ELEMENTS.outer),
    action: getRandom(VARIABLE_ELEMENTS.action)
  };

  const description = buildRobotDescription(robot);

  state.step1 = description;
  els.step1Text.textContent = description;

  generateStep2(description, robot.action, state.aspectRatio);
};

const generateStep2 = async (baseText, action, ratio) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  if (!apiKey) {
    setError('APIキーが設定されていません');
    setLoading(false);
    return;
  }

  try {
    const geminiPrompt = buildGeminiRequest(action, ratio);

    setGeminiPrompt(geminiPrompt);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: geminiPrompt
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
    if (!data.candidates || data.candidates.length === 0) {
      if (data.promptFeedback?.blockReason) {
        throw new Error(`生成がブロックされました。理由: ${data.promptFeedback.blockReason}`);
      }
      throw new Error('Geminiからの応答が空でした。もう一度お試しください。');
    }

    const apiResult = data.candidates[0]?.content?.parts?.[0]?.text;
    if (!apiResult) throw new Error('生成されたテキスト形式が不正です。');

    const finalPrompt = buildFinalPrompt(baseText, apiResult, ratio);

    showPrompt(finalPrompt);
  } catch (err) {
    console.error(err);
    setError('Step 2 Error: ' + (err instanceof Error ? err.message : '不明なエラーが発生しました'));
  } finally {
    setLoading(false);
  }
};

const copyToClipboard = async () => {
  const text = state.step2;
  if (!text) return;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    els.btnCopy.textContent = '✅ コピーしました！';
    setTimeout(() => {
      els.btnCopy.textContent = '📋 プロンプトをコピー';
    }, 2000);
  } catch (err) {
    console.error('Copy failed', err);
  }
};

els.btn916.addEventListener('click', () => setAspectRatio('9:16'));
els.btn169.addEventListener('click', () => setAspectRatio('16:9'));
els.btnGenerate.addEventListener('click', () => {
  if (!state.loading) generateStep1();
});
els.btnCopy.addEventListener('click', copyToClipboard);

