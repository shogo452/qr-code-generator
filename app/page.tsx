"use client";

import { useState, useRef } from "react";
import QRCode from "qrcode";

export default function Home() {
  const [text, setText] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQR = async () => {
    if (!text.trim()) {
      setError("テキストまたはURLを入力してください");
      setQrDataUrl(null);
      return;
    }

    try {
      setError(null);
      const canvas = canvasRef.current;
      if (!canvas) return;

      await QRCode.toCanvas(canvas, text, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });

      const dataUrl = canvas.toDataURL("image/png");
      setQrDataUrl(dataUrl);
    } catch {
      setError("QRコードの生成に失敗しました");
      setQrDataUrl(null);
    }
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = qrDataUrl;
    link.click();
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          QRコード生成ツール
        </h1>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="qr-input"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              テキストまたはURL
            </label>
            <input
              id="qr-input"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") generateQR();
              }}
              placeholder="https://example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={generateQR}
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            生成
          </button>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
        )}

        <div className="mt-6 flex flex-col items-center">
          <canvas
            ref={canvasRef}
            className={qrDataUrl ? "block" : "hidden"}
          />

          {qrDataUrl && (
            <button
              onClick={downloadQR}
              className="mt-4 bg-gray-800 text-white font-medium px-6 py-2 rounded-lg hover:bg-gray-900 transition-colors"
            >
              ダウンロード
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
