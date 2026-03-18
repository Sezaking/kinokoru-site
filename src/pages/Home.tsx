import { useMemo, useState } from "react";
import type { KinokoruItem } from "../types";
import { playClick } from "../ui/sfx";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  "全て",
  "IT/プログラミング",
  "デザイン/クリエイティブ",
  "語学/異文化理解",
  "専門知識",
  "専門技能/技術",
  "ソフトスキル/ノウハウ",
  "趣味/レクリエーション",
  "その他",
];

type SortMode = "new" | "level" | "shuffle";

export default function Home(props: { items: KinokoruItem[] }) {
  const { items } = props;
  const nav = useNavigate();

  const [q, setQ] = useState("");
  const [cat, setCat] = useState("全て");
  const [sort, setSort] = useState<SortMode>("new");
  const [shuffleSeed, setShuffleSeed] = useState(0);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return items.filter((it) => {
      const okCat = cat === "全て" || (it.category || "").includes(cat);
      if (!okCat) return false;
      if (!qq) return true;

      const hay = [it.title, it.name, it.job, it.benefit, it.description, it.category]
        .join(" ")
        .toLowerCase();
      return hay.includes(qq);
    });
  }, [items, q, cat]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sort === "new") {
      arr.sort((a, b) => (b.timestamp || "").localeCompare(a.timestamp || ""));
      return arr;
    }
    if (sort === "level") {
      arr.sort((a, b) => (b.level || 0) - (a.level || 0));
      return arr;
    }
    if (cat !== "全て") return shuffle(arr, shuffleSeed);
    return arr;
  }, [filtered, sort, shuffleSeed, cat]);

  const byCategory = useMemo(() => {
    const map = new Map<string, KinokoruItem[]>();
    for (const it of filtered) {
      const key = it.category || "その他";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(it);
    }
    const cats = Array.from(map.keys()).sort();
    const out: Array<[string, KinokoruItem[]]> = [];
    for (const c of cats) {
      const list = map.get(c)!;
      out.push([c, sort === "shuffle" ? shuffle(list, shuffleSeed) : list]);
    }
    return out;
  }, [filtered, sort, shuffleSeed]);

  function openDetail(id: string) {
    playClick();
    nav(`/content/${id}`);
  }

  const displayed = sort === "shuffle" && cat === "全て" ? null : sorted;

  return (
    <div className="container">
      <div className="header">
        <div className="brand">
          <div className="logo" />
          <div>
            <div className="title">きのこる計画</div>
            <div className="sub">スタッフのスキル/知識コンテンツ一覧</div>
          </div>
        </div>

        <div className="controls">
          <input
            className="input"
            placeholder="検索：コンテンツ名 / 氏名 / 得られること…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="select"
            value={sort}
            onChange={(e) => {
              const v = e.target.value as SortMode;
              setSort(v);
              if (v === "shuffle") setShuffleSeed((s) => s + 1);
            }}
          >
            <option value="new">新着順</option>
            <option value="level">習熟度順</option>
            <option value="shuffle">カテゴリ内ランダム</option>
          </select>
        </div>
      </div>

      <div className="tabs">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`tab ${cat === c ? "active" : ""}`}
            onClick={() => {
              playClick();
              setCat(c);
              if (sort === "shuffle") setShuffleSeed((s) => s + 1);
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {displayed ? (
        <div className="grid">
          {displayed.map((it) => (
            <div key={it.id} className="card" onClick={() => openDetail(it.id)}>
              <div className="badge">
                <span>{it.category || "その他"}</span>
                <span className="meta">Lv.{it.level || 0}</span>
              </div>

              <div className="h2">{it.title}</div>
              <div className="meta">{it.name} / {it.job}</div>

              <div className="benefit">{it.benefit}</div>

              <div className="meta" style={{ marginTop: 10 }}>
                {it.duration} / {it.price_text}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ marginTop: 18 }}>
          {byCategory.map(([c, list]) => (
            <div key={c} style={{ marginBottom: 18 }}>
              <div className="badge" style={{ marginBottom: 10 }}>{c}</div>
              <div className="grid">
                {list.map((it) => (
                  <div key={it.id} className="card" onClick={() => openDetail(it.id)}>
                    <div className="badge">
                      <span>{it.category || "その他"}</span>
                      <span className="meta">Lv.{it.level || 0}</span>
                    </div>
                    <div className="h2">{it.title}</div>
                    <div className="meta">{it.name} / {it.job}</div>
                    <div className="benefit">{it.benefit}</div>
                    <div className="meta" style={{ marginTop: 10 }}>
                      {it.duration} / {it.price_text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function shuffle<T>(arr: T[], seed: number) {
  const a = [...arr];
  let s = seed + 1;
  const rand = () => (s = (s * 48271) % 0x7fffffff) / 0x7fffffff;

  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}