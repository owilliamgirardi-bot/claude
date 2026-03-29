import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

// ─── Paleta médica premium ────────────────────────────────────────────────────
const COLORS = {
  bg: "#F8F7F4",           // branco quente / off-white
  bgDark: "#ECEAE5",       // fundo do gradiente
  gold: "#B89B72",         // dourado discreto
  goldLight: "#D4B896",    // dourado claro
  navy: "#1C2B3A",         // azul-marinho profundo
  navyMid: "#2E4257",      // azul médio
  slate: "#6B7C8E",        // cinza azulado
  white: "#FFFFFF",
};

// ─── Linha decorativa horizontal ─────────────────────────────────────────────
const DecorativeLine: React.FC<{ progress: number; width?: number }> = ({
  progress,
  width = 120,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
    }}
  >
    {/* linha esquerda */}
    <div
      style={{
        width: interpolate(progress, [0, 1], [0, width]),
        height: 1,
        background: `linear-gradient(to right, transparent, ${COLORS.gold})`,
      }}
    />
    {/* diamante central */}
    <div
      style={{
        width: 6,
        height: 6,
        background: COLORS.gold,
        transform: `rotate(45deg) scale(${progress})`,
        opacity: progress,
      }}
    />
    {/* linha direita */}
    <div
      style={{
        width: interpolate(progress, [0, 1], [0, width]),
        height: 1,
        background: `linear-gradient(to left, transparent, ${COLORS.gold})`,
      }}
    />
  </div>
);

export const VinhetaRaquel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // ── tempos (em frames) ──
  const bgReveal    = 0;
  const lineDelay   = Math.round(0.4 * fps);
  const subtitleDelay = Math.round(0.7 * fps);
  const nameDelay   = Math.round(1.1 * fps);
  const crmDelay    = Math.round(1.6 * fps);
  const outStart    = durationInFrames - Math.round(0.8 * fps);

  // ── fade-out global ──
  const fadeOut = interpolate(frame, [outStart, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── fundo: gradiente que surge ──
  const bgOpacity = interpolate(frame, [bgReveal, bgReveal + fps * 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  // ── linhas decorativas ──
  const lineProgress = spring({
    frame: frame - lineDelay,
    fps,
    config: { damping: 200 },
    durationInFrames: Math.round(0.6 * fps),
  });

  // ── "Você já foi atendida por" (fade + slide) ──
  const subtitleOpacity = interpolate(
    frame,
    [subtitleDelay, subtitleDelay + Math.round(0.5 * fps)],
    [0, 1],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }
  );
  const subtitleY = interpolate(
    frame,
    [subtitleDelay, subtitleDelay + Math.round(0.5 * fps)],
    [20, 0],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }
  );

  // ── "Raquel Sperling" (spring dramático) ──
  const nameScale = spring({
    frame: frame - nameDelay,
    fps,
    config: { damping: 18, stiffness: 140 },
    durationInFrames: Math.round(0.9 * fps),
  });
  const nameOpacity = interpolate(
    frame,
    [nameDelay, nameDelay + Math.round(0.3 * fps)],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  // ── CRM / especialidade ──
  const crmOpacity = interpolate(
    frame,
    [crmDelay, crmDelay + Math.round(0.4 * fps)],
    [0, 1],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.sin) }
  );

  return (
    <AbsoluteFill
      style={{
        opacity: fadeOut,
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      {/* ── Fundo com gradiente médico premium ── */}
      <AbsoluteFill
        style={{
          opacity: bgOpacity,
          background: `radial-gradient(ellipse at 50% 40%, ${COLORS.bg} 0%, ${COLORS.bgDark} 100%)`,
        }}
      />

      {/* ── Borda sutil ── */}
      <AbsoluteFill
        style={{
          border: `1px solid ${COLORS.gold}22`,
          margin: 48,
          pointerEvents: "none",
        }}
      />

      {/* ── Faixa vertical dourada (esquerda) ── */}
      <div
        style={{
          position: "absolute",
          left: 48,
          top: 48,
          bottom: 48,
          width: 3,
          background: `linear-gradient(to bottom, transparent, ${COLORS.gold}, transparent)`,
          opacity: lineProgress,
        }}
      />
      {/* ── Faixa vertical dourada (direita) ── */}
      <div
        style={{
          position: "absolute",
          right: 48,
          top: 48,
          bottom: 48,
          width: 3,
          background: `linear-gradient(to bottom, transparent, ${COLORS.gold}, transparent)`,
          opacity: lineProgress,
        }}
      />

      {/* ── Conteúdo centralizado ── */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
          padding: "0 120px",
        }}
      >
        {/* Linha decorativa superior */}
        <div style={{ marginBottom: 32 }}>
          <DecorativeLine progress={lineProgress} width={140} />
        </div>

        {/* "Você já foi atendida por" */}
        <div
          style={{
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
            marginBottom: 18,
          }}
        >
          <span
            style={{
              fontSize: 28,
              fontFamily: "'Georgia', serif",
              fontStyle: "italic",
              color: COLORS.slate,
              letterSpacing: "0.12em",
              fontWeight: 400,
            }}
          >
            Você já foi atendida por
          </span>
        </div>

        {/* "Raquel Sperling" */}
        <div
          style={{
            opacity: nameOpacity,
            transform: `scale(${interpolate(nameScale, [0, 1], [0.85, 1])})`,
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: 72,
              fontFamily: "'Georgia', serif",
              fontWeight: 700,
              color: COLORS.navy,
              letterSpacing: "0.04em",
              lineHeight: 1.1,
              display: "block",
            }}
          >
            Raquel Sperling
          </span>
        </div>

        {/* Linha decorativa inferior */}
        <div style={{ marginBottom: 24 }}>
          <DecorativeLine progress={lineProgress} width={140} />
        </div>

        {/* CRM + Especialidade */}
        <div
          style={{
            opacity: crmOpacity,
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginTop: 8,
          }}
        >
          <span
            style={{
              fontSize: 16,
              color: COLORS.gold,
              letterSpacing: "0.25em",
              fontFamily: "'Georgia', serif",
              fontWeight: 400,
              textTransform: "uppercase",
            }}
          >
            Médica
          </span>
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: COLORS.gold,
            }}
          />
          <span
            style={{
              fontSize: 16,
              color: COLORS.gold,
              letterSpacing: "0.25em",
              fontFamily: "'Georgia', serif",
              fontWeight: 400,
              textTransform: "uppercase",
            }}
          >
            Alto Padrão
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
