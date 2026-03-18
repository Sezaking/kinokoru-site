import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { KinokoruItem } from "../types";
import { copyToClipboard, playClick } from "../ui/sfx";

export default function Detail(props: { items: KinokoruItem[] }) {
  const { id } = useParams();
  const nav = useNavigate();

  const item = useMemo(() => props.items.find((x) => x.id === id), [props.items, id]);

  if (!item) {
    return (
      <div className="container">
        <button className="btn" onClick={() => (playClick(), nav("/"))}>← 戻る</button>
        <div style={{ marginTop: 14 }} className="panel">見つからなかった…（id: {id}）</div>
      </div>
    );
  }

  return (
    <div className="container">
      <button className="btn" onClick={() => (playClick(), nav("/"))}>← 戻る</button>

      <div style={{ marginTop: 14 }} className="detail">
        <div className="panel">
          <div className="badge">
            <span>{item.category || "その他"}</span>
            <span className="meta">Lv.{item.level || 0}</span>
          </div>

          <h2 style={{ margin: "10px 0 6px", fontSize: 22 }}>{item.title}</h2>
          <div className="small">{item.name} / {item.job}</div>

          <div style={{ marginTop: 14 }}>
            <h3>購入者が得られること</h3>
            <p className="p">{item.benefit}</p>
          </div>

          <div style={{ marginTop: 14 }}>
            <h3>コンテンツの内容</h3>
            <p className="p">{item.description}</p>
          </div>

          <div style={{ marginTop: 14 }}>
            <h3>条件・コメント</h3>
            <p className="p">{item.notes || "—"}</p>
          </div>

          <div style={{ marginTop: 14 }}>
            <h3>過去の実績</h3>
            <p className="p">{item.achievements || "—"}</p>
          </div>

          <div style={{ marginTop: 14 }}>
            <h3>プロフィール</h3>
            <p className="p">{item.background || "—"}</p>
          </div>
        </div>

        <div className="panel">
          <h3>概要</h3>
          <p className="p">
            所要時間：{item.duration || "—"}{"\n"}
            価格：{item.price_text || "—"}{"\n"}
            提供可能日時：{item.availability || "—"}
          </p>

          <h3 style={{ marginTop: 14 }}>連絡先（文字列）</h3>
          <p className="p" style={{ background: "#00000022", padding: 10, borderRadius: 12, border: "1px solid #ffffff14" }}>
            {item.contact_text || "—"}
          </p>

          <button
            className="btn"
            onClick={() => {
              playClick();
              copyToClipboard(item.contact_text || "");
            }}
          >
            連絡先をコピー
          </button>

          {item.slides_url ? (
            <div style={{ marginTop: 14 }}>
              <h3>資料（PDF）</h3>
              <iframe src={item.slides_url} title="slides" loading="lazy" />
              <div className="small" style={{ marginTop: 8 }}>
                ※表示されない時はPDFの共有設定/URL形式を確認（Driveなら /preview が安定）
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}