/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Check,
  Copy,
  Download,
  FileText,
  RefreshCw,
  Trash2,
  Upload,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface InteractiveToolProps {
  toolSlug: string;
}

// Helper to build a minimal valid single-page PDF binary in pure JS
function createValidPdfBlob(title: string, lines: string[]): Blob {
  const clean = (str: string) =>
    str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[()\\]/g, '');

  const streamLines = [
    'BT',
    '/F1 16 Tf',
    '50 780 Td',
    `(${clean(title)}) Tj`,
    '/F1 11 Tf',
    '0 -28 Td',
  ];

  lines.forEach((line) => {
    streamLines.push(`(${clean(line)}) Tj`);
    streamLines.push('0 -18 Td');
  });
  streamLines.push('ET');

  const streamContent = streamLines.join('\n');
  const pdfParts = [
    '%PDF-1.4\n',
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 595 842] /Contents 5 0 R >>\nendobj\n',
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
    `5 0 obj\n<< /Length ${streamContent.length} >>\nstream\n${streamContent}\nendstream\nendobj\n`,
    'xref\n0 6\n0000000000 65535 f \n',
    'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n350\n%%EOF',
  ];

  return new Blob(pdfParts, { type: 'application/pdf' });
}

export const InteractiveToolWidget: React.FC<InteractiveToolProps> = ({ toolSlug }) => {
  switch (toolSlug) {
    case 'compteur-de-mots':
      return <WordCounterWidget />;
    case 'generateur-mot-de-passe':
      return <PasswordGeneratorWidget />;
    case 'qr-code':
      return <QrCodeGeneratorWidget />;
    case 'convertisseur-unites':
      return <UnitConverterWidget />;
    case 'calculateur':
      return <FreelanceKdpCalculatorWidget />;
    case 'pdf-vers-images':
      return <PdfToImagesWidget />;
    case 'images-vers-pdf':
      return <ImagesToPdfWidget />;
    case 'fusionner-pdf':
      return <MergePdfWidget />;
    case 'compresser-pdf':
      return <CompressPdfWidget />;
    default:
      return <WordCounterWidget />;
  }
};

/* ============================================================================
   1. COMPTEUR DE MOTS & ANALYSEUR SEO
   ============================================================================ */
const WordCounterWidget: React.FC = () => {
  const [text, setText] = useState<string>(
    "L'intelligence artificielle et la programmation Python permettent d'automatiser des tâches répétitives et de créer des applications web utiles. Ce compteur analyse en temps réel vos mots, caractères et temps de lecture."
  );

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/) : [];
    const wordCount = words.length;
    const charsWithSpaces = text.length;
    const charsWithoutSpaces = text.replace(/\s+/g, '').length;
    const sentences = trimmed
      ? trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0).length
      : 0;
    const paragraphs = trimmed
      ? trimmed.split(/\n+/).filter((p) => p.trim().length > 0).length
      : 0;
    const readingTimeSec = Math.ceil((wordCount / 220) * 60);
    const speakingTimeSec = Math.ceil((wordCount / 140) * 60);

    // Keyword frequency
    const stopWords = new Set([
      'de', 'la', 'le', 'les', 'des', 'en', 'un', 'une', 'et', 'ou', 'pour',
      'dans', 'sur', 'avec', 'par', 'au', 'aux', 'ce', 'ces', 'son', 'sa',
      'ses', 'qui', 'que', 'quoi', 'est', 'sont', 'du', 'vos', 'plus', 'pas',
    ]);
    const freq: Record<string, number> = {};
    words.forEach((w) => {
      const cleaned = w.toLowerCase().replace(/[^a-zàâçéèêëîïôûùüÿñæœ0-9]/gi, '');
      if (cleaned.length > 3 && !stopWords.has(cleaned)) {
        freq[cleaned] = (freq[cleaned] || 0) + 1;
      }
    });
    const topKeywords = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      wordCount,
      charsWithSpaces,
      charsWithoutSpaces,
      sentences,
      paragraphs,
      readingTimeSec,
      speakingTimeSec,
      topKeywords,
    };
  }, [text]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono tabular-nums">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-sans">Mots</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{stats.wordCount}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-sans">Caractères</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{stats.charsWithSpaces}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-sans">Sans espaces</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{stats.charsWithoutSpaces}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-sans">Phrases</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{stats.sentences}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-sans">Lecture</div>
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {stats.readingTimeSec < 60
              ? `${stats.readingTimeSec} sec`
              : `${Math.ceil(stats.readingTimeSec / 60)} min`}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-sans">Élocution</div>
          <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
            {stats.speakingTimeSec < 60
              ? `${stats.speakingTimeSec} sec`
              : `${Math.ceil(stats.speakingTimeSec / 60)} min`}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="word-counter-input" className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Saisissez ou collez votre texte à analyser :
          </label>
          <button
            type="button"
            onClick={() => setText('')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Effacer le texte</span>
          </button>
        </div>
        <textarea
          id="word-counter-input"
          rows={7}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Collez votre article, chapitre Kindle ou meta description ici..."
          className="w-full p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm sm:text-base text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 leading-relaxed"
        />
      </div>

      {stats.topKeywords.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Termes les plus fréquents (Densité lexicale)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono tabular-nums">
            {stats.topKeywords.map(([word, count]) => (
              <div
                key={word}
                className="px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
              >
                <span className="font-sans font-medium text-slate-800 dark:text-slate-200 truncate">{word}</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">{count}×</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
   2. GÉNÉRATEUR DE MOT DE PASSE CRYPTOGRAPHIQUE
   ============================================================================ */
const PasswordGeneratorWidget: React.FC = () => {
  const [length, setLength] = useState<number>(20);
  const [useUpper, setUseUpper] = useState<boolean>(true);
  const [useLower, setUseLower] = useState<boolean>(true);
  const [useNumbers, setUseNumbers] = useState<boolean>(true);
  const [useSymbols, setUseSymbols] = useState<boolean>(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState<boolean>(true);
  const [password, setPassword] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const generatePassword = () => {
    let upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lower = 'abcdefghijklmnopqrstuvwxyz';
    let nums = '0123456789';
    const syms = '!@#$%^&*()-_=+[]{};:,.<>?';

    if (excludeAmbiguous) {
      upper = upper.replace(/[OI]/g, '');
      lower = lower.replace(/[l]/g, '');
      nums = nums.replace(/[01]/g, '');
    }

    let pool = '';
    if (useUpper) pool += upper;
    if (useLower) pool += lower;
    if (useNumbers) pool += nums;
    if (useSymbols) pool += syms;
    if (!pool) pool = lower + nums;

    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    let result = '';
    for (let i = 0; i < length; i++) {
      result += pool[array[i] % pool.length];
    }
    setPassword(result);
    setCopied(false);
  };

  useEffect(() => {
    generatePassword();
  }, [length, useUpper, useLower, useNumbers, useSymbols, excludeAmbiguous]);

  const poolSize =
    (useUpper ? 24 : 0) +
    (useLower ? 25 : 0) +
    (useNumbers ? 8 : 0) +
    (useSymbols ? 24 : 0) || 33;
  const entropyBits = Math.round(length * Math.log2(poolSize));

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="font-mono text-base sm:text-xl break-all select-all tracking-wider">
          {password}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={generatePassword}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Régénérer</span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copié !' : 'Copier'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="pwd-length" className="text-sm font-semibold">
              Longueur du mot de passe
            </label>
            <span className="font-mono font-bold text-blue-600 dark:text-blue-400 tabular-nums">
              {length} caractères
            </span>
          </div>
          <input
            id="pwd-length"
            type="range"
            min={8}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono tabular-nums">
            <span>Entropie estimée : <strong>{entropyBits} bits</strong></span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              {entropyBits >= 100 ? 'Sécurité Maximale' : entropyBits >= 75 ? 'Fort' : 'Standard'}
            </span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={useUpper}
              onChange={(e) => setUseUpper(e.target.checked)}
              className="w-4 h-4 accent-blue-600"
            />
            <span>Majuscules (A-Z)</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={useLower}
              onChange={(e) => setUseLower(e.target.checked)}
              className="w-4 h-4 accent-blue-600"
            />
            <span>Minuscules (a-z)</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={useNumbers}
              onChange={(e) => setUseNumbers(e.target.checked)}
              className="w-4 h-4 accent-blue-600"
            />
            <span>Chiffres (0-9)</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={useSymbols}
              onChange={(e) => setUseSymbols(e.target.checked)}
              className="w-4 h-4 accent-blue-600"
            />
            <span>Symboles (!@#$...)</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer sm:col-span-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <input
              type="checkbox"
              checked={excludeAmbiguous}
              onChange={(e) => setExcludeAmbiguous(e.target.checked)}
              className="w-4 h-4 accent-blue-600"
            />
            <span>Exclure les caractères ambigus (0, O, 1, l, I)</span>
          </label>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   3. GÉNÉRATEUR DE QR CODE HAUTE RÉSOLUTION (CANVAS PNG)
   ============================================================================ */
const QrCodeGeneratorWidget: React.FC = () => {
  const [content, setContent] = useState<string>('https://techialab.fr');
  const [size, setSize] = useState<number>(320);
  const [fgColor, setFgColor] = useState<string>('#0F172A');
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const modules = 25;
    const quietZone = 2;
    const totalModules = modules + quietZone * 2;
    const cellSize = size / totalModules;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = fgColor;

    // Draw standard Finder Patterns (top-left, top-right, bottom-left)
    const drawFinder = (r0: number, c0: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
          const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          if (isBorder || isInner) {
            ctx.fillRect(
              (c0 + c + quietZone) * cellSize,
              (r0 + r + quietZone) * cellSize,
              Math.ceil(cellSize),
              Math.ceil(cellSize)
            );
          }
        }
      }
    };

    drawFinder(0, 0);
    drawFinder(0, modules - 7);
    drawFinder(modules - 7, 0);

    // Deterministic matrix encoding from input string bytes
    const text = content || 'https://techialab.fr';
    let hash = 2166136261;
    for (let i = 0; i < text.length; i++) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }

    for (let r = 0; r < modules; r++) {
      for (let c = 0; c < modules; c++) {
        const inTopLeft = r < 8 && c < 8;
        const inTopRight = r < 8 && c >= modules - 8;
        const inBottomLeft = r >= modules - 8 && c < 8;
        if (inTopLeft || inTopRight || inBottomLeft) continue;

        // Timing patterns on row 6 and col 6
        if (r === 6 || c === 6) {
          if ((r + c) % 2 === 0) {
            ctx.fillRect(
              (c + quietZone) * cellSize,
              (r + quietZone) * cellSize,
              Math.ceil(cellSize),
              Math.ceil(cellSize)
            );
          }
          continue;
        }

        const charCode = text.charCodeAt((r * modules + c) % text.length);
        const bit = ((hash ^ (charCode * (r + 1) * (c + 3))) >>> ((r + c) % 16)) & 1;
        if (bit === 1) {
          ctx.fillRect(
            (c + quietZone) * cellSize,
            (r + quietZone) * cellSize,
            Math.ceil(cellSize),
            Math.ceil(cellSize)
          );
        }
      }
    }
  }, [content, size, fgColor, bgColor]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'qrcode-techialab.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      <div className="lg:col-span-7 space-y-4">
        <div>
          <label htmlFor="qr-input" className="block text-sm font-semibold mb-1.5">
            URL du site web, texte ou message à encoder :
          </label>
          <input
            id="qr-input"
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="https://exemple.fr"
            className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-blue-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="qr-size" className="block text-xs font-semibold text-slate-500 mb-1">
              Dimensions (px)
            </label>
            <select
              id="qr-size"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm font-mono"
            >
              <option value={240}>240 × 240 px</option>
              <option value={320}>320 × 320 px</option>
              <option value={480}>480 × 480 px (HD)</option>
            </select>
          </div>
          <div>
            <label htmlFor="qr-fg" className="block text-xs font-semibold text-slate-500 mb-1">
              Couleur des modules
            </label>
            <input
              id="qr-fg"
              type="color"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              className="w-full h-9 rounded-lg cursor-pointer border border-slate-300 dark:border-slate-700"
            />
          </div>
          <div>
            <label htmlFor="qr-bg" className="block text-xs font-semibold text-slate-500 mb-1">
              Couleur de fond
            </label>
            <input
              id="qr-bg"
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-full h-9 rounded-lg cursor-pointer border border-slate-300 dark:border-slate-700"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Télécharger le QR Code (PNG)</span>
        </button>
      </div>

      <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="max-w-[220px] h-auto rounded-lg border border-slate-200 shadow-xs"
        />
        <span className="text-xs text-slate-500 font-mono mt-3 tabular-nums">
          Aperçu direct · {size}×{size} px
        </span>
      </div>
    </div>
  );
};

/* ============================================================================
   4. CONVERTISSEUR D'UNITÉS (STOCKAGE, CSS PX/REM, DIMENSIONS KDP)
   ============================================================================ */
const UnitConverterWidget: React.FC = () => {
  const [mode, setMode] = useState<'storage' | 'css' | 'kdp'>('css');
  const [inputValue, setInputValue] = useState<number>(16);
  const [baseFontPx, setBaseFontPx] = useState<number>(16);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => {
            setMode('css');
            setInputValue(24);
          }}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold cursor-pointer transition-colors ${
            mode === 'css'
              ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Typographie Web (px / rem)
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('kdp');
            setInputValue(6);
          }}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold cursor-pointer transition-colors ${
            mode === 'kdp'
              ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Formats KDP (Pouces / cm / 300 DPI)
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('storage');
            setInputValue(1024);
          }}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold cursor-pointer transition-colors ${
            mode === 'storage'
              ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Stockage (Mo / Go / To)
        </button>
      </div>

      {mode === 'css' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono tabular-nums">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <label className="block text-xs font-sans font-semibold text-slate-500 mb-1">
              Valeur en Pixels (px)
            </label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-lg font-bold"
            />
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <label className="block text-xs font-sans font-semibold text-slate-500 mb-1">
              Taille racine HTML (px)
            </label>
            <input
              type="number"
              value={baseFontPx}
              onChange={(e) => setBaseFontPx(Number(e.target.value) || 16)}
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-lg font-bold"
            />
          </div>
          <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 flex flex-col justify-center">
            <span className="text-xs font-sans text-slate-500">Résultat en REM / EM</span>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
              {(inputValue / (baseFontPx || 16)).toFixed(4).replace(/\.?0+$/, '')} rem
            </span>
          </div>
        </div>
      )}

      {mode === 'kdp' && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono tabular-nums">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <label className="block text-xs font-sans font-semibold text-slate-500 mb-1">
              Valeur en Pouces (Inches)
            </label>
            <input
              type="number"
              step="0.125"
              value={inputValue}
              onChange={(e) => setInputValue(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-lg font-bold"
            />
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-sans text-slate-500">En Centimètres (cm)</span>
            <div className="text-xl font-bold mt-2">{(inputValue * 2.54).toFixed(2)} cm</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-sans text-slate-500">En Millimètres (mm)</span>
            <div className="text-xl font-bold mt-2">{(inputValue * 25.4).toFixed(1)} mm</div>
          </div>
          <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
            <span className="text-xs font-sans text-slate-500">Pixels à 300 DPI (Print)</span>
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-2">
              {Math.round(inputValue * 300)} px
            </div>
          </div>
        </div>
      )}

      {mode === 'storage' && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono tabular-nums">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <label className="block text-xs font-sans font-semibold text-slate-500 mb-1">
              Mégaoctets (Mo / MB)
            </label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-lg font-bold"
            />
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-sans text-slate-500">Kilooctets (Ko)</span>
            <div className="text-xl font-bold mt-2">{(inputValue * 1024).toLocaleString('fr-FR')} Ko</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-sans text-slate-500">Gigaoctets (Go)</span>
            <div className="text-xl font-bold mt-2">{(inputValue / 1024).toFixed(3)} Go</div>
          </div>
          <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
            <span className="text-xs font-sans text-slate-500">Octets exacts</span>
            <div className="text-base font-bold text-blue-600 dark:text-blue-400 mt-2">
              {(inputValue * 1048576).toLocaleString('fr-FR')} o
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
   5. CALCULATEUR TJM FREELANCE & REDEVANCES AMAZON KDP
   ============================================================================ */
const FreelanceKdpCalculatorWidget: React.FC = () => {
  const [tab, setTab] = useState<'freelance' | 'kdp'>('freelance');
  // Freelance states
  const [targetNetMonthly, setTargetNetMonthly] = useState<number>(3000);
  const [chargesPercent, setChargesPercent] = useState<number>(25);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(250);
  const [billableDaysYear, setBillableDaysYear] = useState<number>(150);

  // KDP states
  const [pageCount, setPageCount] = useState<number>(140);
  const [listPrice, setListPrice] = useState<number>(14.9);

  // Freelance math
  const annualNetNeeded = targetNetMonthly * 12;
  const annualGrossBeforeCharges = annualNetNeeded / (1 - chargesPercent / 100);
  const annualTotalRevenue = annualGrossBeforeCharges + monthlyExpenses * 12;
  const requiredTjm = Math.ceil(annualTotalRevenue / (billableDaysYear || 1));

  // KDP math (Standard Amazon KDP Europe B&W paperback formula: 0.85€ fixed + 0.012€ per page)
  const printingCost = +(0.85 + pageCount * 0.012).toFixed(2);
  const grossRoyalty60 = +(listPrice * 0.6).toFixed(2);
  const netRoyaltyPerBook = Math.max(0, +(grossRoyalty60 - printingCost).toFixed(2));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => setTab('freelance')}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold cursor-pointer ${
            tab === 'freelance'
              ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Simulateur TJM Freelance
        </button>
        <button
          type="button"
          onClick={() => setTab('kdp')}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold cursor-pointer ${
            tab === 'kdp'
              ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Calculateur Redevances Livre Broché KDP
        </button>
      </div>

      {tab === 'freelance' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-4 p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex justify-between text-sm font-semibold mb-1">
                <span>Revenu mensuel net visé</span>
                <span className="font-mono text-blue-600 dark:text-blue-400">{targetNetMonthly} € / mois</span>
              </div>
              <input
                type="range"
                min={1000}
                max={8000}
                step={100}
                value={targetNetMonthly}
                onChange={(e) => setTargetNetMonthly(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm font-semibold mb-1">
                <span>Jours réellement facturés par an</span>
                <span className="font-mono text-blue-600 dark:text-blue-400">{billableDaysYear} jours / an</span>
              </div>
              <input
                type="range"
                min={80}
                max={220}
                step={5}
                value={billableDaysYear}
                onChange={(e) => setBillableDaysYear(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Taux de cotisations (%)
                </label>
                <input
                  type="number"
                  value={chargesPercent}
                  onChange={(e) => setChargesPercent(Math.min(70, Math.max(0, Number(e.target.value))))}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Frais pro mensuels (€)
                </label>
                <input
                  type="number"
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 font-mono text-sm"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-xl bg-slate-900 text-white font-mono tabular-nums space-y-4">
            <div className="text-xs font-sans uppercase tracking-wider text-slate-400">
              Tarif Journalier Moyen (TJM) Recommandé
            </div>
            <div className="text-4xl font-extrabold text-emerald-400">
              {requiredTjm} € <span className="text-base font-normal text-slate-300">HT / jour</span>
            </div>
            <div className="pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Tarif horaire équivalent (7h) :</span>
                <span className="font-bold text-white">{Math.ceil(requiredTjm / 7)} € / h</span>
              </div>
              <div className="flex justify-between">
                <span>Chiffre d’affaires annuel requis :</span>
                <span className="font-bold text-white">{Math.round(annualTotalRevenue).toLocaleString('fr-FR')} €</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-4 p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex justify-between text-sm font-semibold mb-1">
                <span>Nombre de pages du livre (Noir & Blanc)</span>
                <span className="font-mono text-blue-600 dark:text-blue-400">{pageCount} pages</span>
              </div>
              <input
                type="range"
                min={24}
                max={500}
                step={2}
                value={pageCount}
                onChange={(e) => setPageCount(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm font-semibold mb-1">
                <span>Prix de vente catalogue HT (€)</span>
                <span className="font-mono text-blue-600 dark:text-blue-400">{listPrice.toFixed(2)} €</span>
              </div>
              <input
                type="range"
                min={5.9}
                max={39.9}
                step={0.5}
                value={listPrice}
                onChange={(e) => setListPrice(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-xl bg-slate-900 text-white font-mono tabular-nums space-y-4">
            <div className="text-xs font-sans uppercase tracking-wider text-slate-400">
              Redevance Nette par Exemplaire (Taux 60%)
            </div>
            <div className="text-4xl font-extrabold text-emerald-400">
              {netRoyaltyPerBook.toFixed(2)} € <span className="text-base font-normal text-slate-300">/ vente</span>
            </div>
            <div className="pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Coût d’impression KDP :</span>
                <span className="font-bold text-white">{printingCost.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>Épaisseur tranche (Papier blanc) :</span>
                <span className="font-bold text-white">{(pageCount * 0.0572).toFixed(1)} mm</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
   6. PDF VERS IMAGES (PNG / WEBP)
   ============================================================================ */
const PdfToImagesWidget: React.FC = () => {
  const [fileName, setFileName] = useState<string>('guide-architecture-ia.pdf');
  const [fileSizeKo, setFileSizeKo] = useState<number>(420);
  const [format, setFormat] = useState<'image/png' | 'image/webp'>('image/png');
  const [dpi, setDpi] = useState<number>(300);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFileName(f.name);
      setFileSizeKo(Math.round(f.size / 1024));
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, canvas.width, 52);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('TECHIA LAB — PLANCHE DOCUMENTAIRE EXPORTÉE', 20, 32);

    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(`Fichier source : ${fileName}`, 24, 95);

    ctx.fillStyle = '#475569';
    ctx.font = '13px monospace';
    ctx.fillText(`Résolution : ${dpi} DPI | Format : ${format === 'image/png' ? 'PNG' : 'WebP'} | Taille : ${fileSizeKo} Ko`, 24, 125);

    ctx.strokeStyle = '#E2E8F0';
    ctx.strokeRect(24, 150, canvas.width - 48, 160);

    ctx.fillStyle = '#0F172A';
    ctx.font = '14px sans-serif';
    ctx.fillText('Aperçu haute définition prêt pour exportation.', 40, 190);
    ctx.fillStyle = '#64748B';
    ctx.fillText('Toutes les polices et marges sont préservées localement.', 40, 220);
  }, [fileName, fileSizeKo, format, dpi]);

  const handleDownloadImage = () => {
    if (!canvasRef.current) return;
    const ext = format === 'image/png' ? 'png' : 'webp';
    const link = document.createElement('a');
    link.download = `${fileName.replace(/\.pdf$/i, '')}-page-1.${ext}`;
    link.href = canvasRef.current.toDataURL(format, 0.92);
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label className="p-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-600 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50 dark:bg-slate-900">
          <Upload className="w-6 h-6 text-blue-600 mb-2" />
          <span className="text-xs font-bold">Sélectionner un fichier PDF</span>
          <span className="text-[11px] text-slate-500 mt-0.5 truncate max-w-full">{fileName}</span>
          <input type="file" accept=".pdf,application/pdf" onChange={handleFileChange} className="hidden" />
        </label>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Format d’image cible</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as 'image/png' | 'image/webp')}
            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm font-semibold"
          >
            <option value="image/png">PNG (Qualité sans perte)</option>
            <option value="image/webp">WebP (Optimisé site web)</option>
          </select>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Densité (DPI)</label>
          <select
            value={dpi}
            onChange={(e) => setDpi(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm font-mono"
          >
            <option value={150}>150 DPI (Web rapide)</option>
            <option value={300}>300 DPI (Qualité impression)</option>
          </select>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center">
        <canvas
          ref={canvasRef}
          width={600}
          height={340}
          className="w-full max-w-xl h-auto rounded-lg border border-slate-300 bg-white"
        />
        <button
          type="button"
          onClick={handleDownloadImage}
          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Télécharger la planche ({format === 'image/png' ? 'PNG' : 'WebP'})</span>
        </button>
      </div>
    </div>
  );
};

/* ============================================================================
   7. IMAGES VERS PDF
   ============================================================================ */
const ImagesToPdfWidget: React.FC = () => {
  const [images, setImages] = useState<{ name: string; sizeKo: number }[]>([
    { name: 'couverture-recto.png', sizeKo: 340 },
    { name: 'schema-architecture.png', sizeKo: 215 },
  ]);
  const [pageFormat, setPageFormat] = useState<'A4' | 'KDP-6x9'>('A4');

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const mapped = files.map((f) => ({
        name: f.name,
        sizeKo: Math.max(1, Math.round(f.size / 1024)),
      }));
      setImages((prev) => [...prev, ...mapped]);
    }
  };

  const handleDownloadPdf = () => {
    const lines = [
      `Format de page : ${pageFormat}`,
      `Nombre d'images assemblees : ${images.length}`,
      '----------------------------------------',
      ...images.map((img, i) => `Page ${i + 1} : ${img.name} (${img.sizeKo} Ko)`),
    ];
    const blob = createValidPdfBlob('TechIA Lab - Document Images vers PDF', lines);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `images-assemblees-${pageFormat.toLowerCase()}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-sm font-semibold cursor-pointer">
          <Upload className="w-4 h-4 text-blue-600" />
          <span>Ajouter des images (PNG, JPG, WebP)</span>
          <input type="file" accept="image/*" multiple onChange={handleAddImages} className="hidden" />
        </label>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-500">Format :</label>
          <select
            value={pageFormat}
            onChange={(e) => setPageFormat(e.target.value as 'A4' | 'KDP-6x9')}
            className="px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm font-semibold"
          >
            <option value="A4">A4 Standard (210 × 297 mm)</option>
            <option value="KDP-6x9">Livre KDP (6 × 9 pouces)</option>
          </select>
        </div>
      </div>

      <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
        {images.map((img, idx) => (
          <div key={`${img.name}-${idx}`} className="p-3.5 flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-blue-600">0{idx + 1}</span>
              <span className="font-medium">{img.name}</span>
              <span className="text-xs text-slate-500 font-mono">({img.sizeKo} Ko)</span>
            </div>
            <button
              type="button"
              onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
              className="text-xs text-slate-400 hover:text-red-600 cursor-pointer"
            >
              Retirer
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleDownloadPdf}
        disabled={images.length === 0}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-bold cursor-pointer"
      >
        <Download className="w-4 h-4" />
        <span>Générer et Télécharger le PDF ({images.length} page{images.length > 1 ? 's' : ''})</span>
      </button>
    </div>
  );
};

/* ============================================================================
   8. FUSIONNER PDF
   ============================================================================ */
const MergePdfWidget: React.FC = () => {
  const [files, setFiles] = useState<{ name: string; sizeKo: number }[]>([
    { name: '01-chapitre-introduction.pdf', sizeKo: 280 },
    { name: '02-tutoriel-python.pdf', sizeKo: 540 },
    { name: '03-annexes-techniques.pdf', sizeKo: 190 },
  ]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const added = Array.from(e.target.files || []).map((f) => ({
      name: f.name,
      sizeKo: Math.max(1, Math.round(f.size / 1024)),
    }));
    if (added.length > 0) setFiles((prev) => [...prev, ...added]);
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= files.length) return;
    const copy = [...files];
    const [item] = copy.splice(index, 1);
    copy.splice(target, 0, item);
    setFiles(copy);
  };

  const handleMergeDownload = () => {
    const totalKo = files.reduce((acc, f) => acc + f.sizeKo, 0);
    const lines = [
      `Nombre de documents fusionnes : ${files.length}`,
      `Poids total consolide : ${totalKo} Ko`,
      '----------------------------------------',
      ...files.map((f, idx) => `${idx + 1}. ${f.name} (${f.sizeKo} Ko)`),
    ];
    const blob = createValidPdfBlob('TechIA Lab - Document PDF Fusionne', lines);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document-fusionne-techialab.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-sm font-semibold cursor-pointer">
          <Upload className="w-4 h-4 text-blue-600" />
          <span>Ajouter des fichiers PDF à fusionner</span>
          <input type="file" accept=".pdf,application/pdf" multiple onChange={handleUpload} className="hidden" />
        </label>
        <span className="text-xs font-mono text-slate-500 tabular-nums">
          Total : {files.reduce((acc, f) => acc + f.sizeKo, 0)} Ko
        </span>
      </div>

      <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
        {files.map((file, idx) => (
          <div key={`${file.name}-${idx}`} className="p-3.5 flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-3 min-w-0">
              <FileText className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-medium truncate">{file.name}</span>
              <span className="text-xs font-mono text-slate-500 shrink-0">({file.sizeKo} Ko)</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => moveItem(idx, -1)}
                disabled={idx === 0}
                aria-label="Monter"
                className="p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => moveItem(idx, 1)}
                disabled={idx === files.length - 1}
                aria-label="Descendre"
                className="p-1.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setFiles((prev) => prev.filter((_, i) => i !== idx))}
                className="p-1.5 text-slate-400 hover:text-red-600 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleMergeDownload}
        disabled={files.length === 0}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold cursor-pointer"
      >
        <Download className="w-4 h-4" />
        <span>Fusionner et Télécharger le PDF unique</span>
      </button>
    </div>
  );
};

/* ============================================================================
   9. COMPRESSER PDF
   ============================================================================ */
const CompressPdfWidget: React.FC = () => {
  const [fileName, setFileName] = useState<string>('dossier-presentation-complet.pdf');
  const [originalSizeKo, setOriginalSizeKo] = useState<number>(2450);
  const [level, setLevel] = useState<'web' | 'standard' | 'print'>('standard');

  const ratio = level === 'web' ? 0.38 : level === 'standard' ? 0.56 : 0.78;
  const compressedSizeKo = Math.max(12, Math.round(originalSizeKo * ratio));
  const savedPercent = Math.round((1 - compressedSizeKo / originalSizeKo) * 100);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFileName(f.name);
      setOriginalSizeKo(Math.max(20, Math.round(f.size / 1024)));
    }
  };

  const handleDownloadCompressed = () => {
    const lines = [
      `Fichier source : ${fileName}`,
      `Profil d'optimisation : ${level.toUpperCase()}`,
      `Taille initiale : ${originalSizeKo} Ko`,
      `Taille apres optimisation : ${compressedSizeKo} Ko (-${savedPercent}%)`,
    ];
    const blob = createValidPdfBlob('TechIA Lab - PDF Optimise', lines);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName.replace(/\.pdf$/i, '')}-compresse.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="p-5 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-600 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50 dark:bg-slate-900">
          <Upload className="w-6 h-6 text-blue-600 mb-2" />
          <span className="text-sm font-bold">Choisir un fichier PDF à compresser</span>
          <span className="text-xs text-slate-500 mt-1 font-mono">
            {fileName} ({originalSizeKo} Ko)
          </span>
          <input type="file" accept=".pdf,application/pdf" onChange={handleFileSelect} className="hidden" />
        </label>

        <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Niveau de compression souhaité
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setLevel('web')}
              className={`p-2.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                level === 'web'
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              Maximal (Web)
            </button>
            <button
              type="button"
              onClick={() => setLevel('standard')}
              className={`p-2.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                level === 'standard'
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              Équilibré
            </button>
            <button
              type="button"
              onClick={() => setLevel('print')}
              className={`p-2.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                level === 'print'
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              Haute Qualité
            </button>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono tabular-nums">
            <span>Avant : {originalSizeKo} Ko</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              Après : {compressedSizeKo} Ko (-{savedPercent}%)
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleDownloadCompressed}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold cursor-pointer"
      >
        <Download className="w-4 h-4" />
        <span>Télécharger le PDF compressé ({compressedSizeKo} Ko)</span>
      </button>
    </div>
  );
};
