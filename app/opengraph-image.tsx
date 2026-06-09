import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ゲーミング比較ラボ";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        <div style={{ fontSize: 90, marginBottom: 24 }}>🎮</div>
        <div
          style={{
            fontSize: 60,
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          ゲーミング比較ラボ
        </div>
        <div
          style={{
            fontSize: 30,
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: 800,
            marginBottom: 48,
          }}
        >
          PS5・Xbox 周辺機器おすすめ比較サイト
        </div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          {["コントローラー", "ヘッドセット", "モニター", "キーボード", "マウス"].map((cat) => (
            <div
              key={cat}
              style={{
                background: "rgba(139, 92, 246, 0.2)",
                border: "1px solid rgba(139, 92, 246, 0.5)",
                borderRadius: 8,
                padding: "10px 20px",
                color: "#a78bfa",
                fontSize: 20,
              }}
            >
              {cat}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
