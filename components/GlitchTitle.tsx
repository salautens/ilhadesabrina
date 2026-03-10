export default function GlitchTitle() {
  return (
    <h1
      style={{
        fontFamily: "var(--font-space)",
        fontWeight: 700,
        letterSpacing: "-0.02em",
        lineHeight: 0.88,
        color: "#F2EDE8",
        textTransform: "uppercase",
        userSelect: "none",
        position: "relative",
        zIndex: 10,
      }}
    >
      <span style={{ display: "block", fontSize: "clamp(3.2rem, 9.5vw, 12.7rem)" }}>
        AI PRODUCT
      </span>
      <span style={{ display: "block", fontSize: "clamp(4.5rem, 13.5vw, 18rem)", color: "#3DFF6E" }}>
        BUILDER
      </span>
    </h1>
  );
}
