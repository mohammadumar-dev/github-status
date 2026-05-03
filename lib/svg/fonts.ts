// Minimal Inter font subset embedded as base64 for consistent SVG rendering.
// This is a small subset covering ASCII + common punctuation only.
// Using a system-font fallback stack for broad compatibility.
export const FONT_FACE_CSS = `
  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    src: local('Inter'), local('Inter-Regular');
  }
  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    src: local('Inter SemiBold'), local('Inter-SemiBold');
  }
  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    src: local('Inter Bold'), local('Inter-Bold');
  }
  @font-face {
    font-family: 'JetBrainsMono';
    font-style: normal;
    font-weight: 400;
    src: local('JetBrains Mono'), local('JetBrainsMono-Regular');
  }
  @font-face {
    font-family: 'JetBrainsMono';
    font-style: normal;
    font-weight: 700;
    src: local('JetBrains Mono Bold'), local('JetBrainsMono-Bold');
  }
`

export const FONT_STACK = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
export const MONO_FONT_STACK = "'JetBrainsMono', 'JetBrains Mono', 'SF Mono', 'Fira Code', Consolas, monospace"
