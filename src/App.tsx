import { useEffect, useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import type { KinokoruItem } from "./types";
import { DATA_API_URL } from "./config";
import { loadJsonp } from "./lib/jsonp";
import Home from "./pages/Home";
import Detail from "./pages/Detail";

export default function App() {
  const [items, setItems] = useState<KinokoruItem[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadJsonp<KinokoruItem[]>(DATA_API_URL)
      .then(setItems)
      .catch((e) => setError(String(e?.message || e)));
  }, []);

  if (error) {
    return (
      <div className="container">
        <div className="panel">
          <h3>データ取得に失敗</h3>
          <div className="p">{error}</div>
          <div className="small">GASのURL（DATA_API_URL）かデプロイ設定を確認してね。</div>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="container">
        <div className="panel">読み込み中…</div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home items={items} />} />
        <Route path="/content/:id" element={<Detail items={items} />} />
      </Routes>
    </HashRouter>
  );
}