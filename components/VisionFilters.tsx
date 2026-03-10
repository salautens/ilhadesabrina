/**
 * Hidden SVG filter definitions for colorblind vision simulation.
 * Must be rendered in the DOM so CSS `filter: url(#id)` can reference them.
 * Color matrices from Vienot et al. (1999) research.
 */
export default function VisionFilters() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      style={{
        position: "absolute",
        width: 0,
        height: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <defs>
        {/* Deuteranopia — M-cone (green) absent */}
        <filter id="cb-deuteranopia" colorInterpolationFilters="linearRGB">
          <feColorMatrix
            type="matrix"
            values="0.625 0.375 0     0 0
                    0.7   0.3   0     0 0
                    0     0.3   0.7   0 0
                    0     0     0     1 0"
          />
        </filter>

        {/* Protanopia — L-cone (red) absent */}
        <filter id="cb-protanopia" colorInterpolationFilters="linearRGB">
          <feColorMatrix
            type="matrix"
            values="0.567 0.433 0     0 0
                    0.558 0.442 0     0 0
                    0     0.242 0.758 0 0
                    0     0     0     1 0"
          />
        </filter>

        {/* Tritanopia — S-cone (blue) absent */}
        <filter id="cb-tritanopia" colorInterpolationFilters="linearRGB">
          <feColorMatrix
            type="matrix"
            values="0.95  0.05  0     0 0
                    0     0.433 0.567 0 0
                    0     0.475 0.525 0 0
                    0     0     0     1 0"
          />
        </filter>

        {/* Achromatopsia — no color cones (luminance only) */}
        <filter id="cb-achromatopsia" colorInterpolationFilters="linearRGB">
          <feColorMatrix
            type="matrix"
            values="0.299 0.587 0.114 0 0
                    0.299 0.587 0.114 0 0
                    0.299 0.587 0.114 0 0
                    0     0     0     1 0"
          />
        </filter>
      </defs>
    </svg>
  );
}
