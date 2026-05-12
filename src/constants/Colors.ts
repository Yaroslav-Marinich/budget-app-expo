const commonColors = {
  white: "#FFFFFF",
  black: "#000000",
  
  primary: "#1B5E20",
  accent: "#2E7D32",
  accentSoft: "rgba(247,147,26,0.15)",
  accentBorderSoft: "rgba(247,147,26,0.3)",
  warning: "#FF9500",
  warningAccent: "#F7931A",
  
  error: "#8B0000",
  errorSoft: "rgba(244,67,54,0.1)",
  errorBright: "#F44336",
  errorLight: "#FFB4B4",
  danger: "#FF3B30",
  dangerSoft: "#FF3B3015",
  success: "#1B5E20",
  info: "#0a7ea4",

  overlay: "rgba(0,0,0,0.4)",
  overlayStrong: "rgba(0,0,0,0.6)",
  overlayHeavy: "rgba(0,0,0,0.8)",
  overlayMax: "rgba(0,0,0,0.85)",

  categoryColors: [
    "#E57373", "#81C784", "#BA68C8", "#4CAF50", "#FFB74D", "#64B5F6",
    "#4DB6AC", "#FFD54F", "#F06292", "#4DD0E1", "#A1887F", "#90A4AE",
    "#DCE775", "#FF8A65",
  ],

  meterColors: [
    "#FFB74D", "#64B5F6", "#E57373", "#FF8A65", "#4DB6AC", "#A1887F",
  ],

  analyticsColors: [
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
    "#F778A1", "#7FFFD4", "#8A2BE2", "#00CED1",
  ],
};

export const DarkTheme = {
  ...commonColors,
  
  background: "#000000",
  surface: "#1A1A1A",
  surfaceAlt: "#1C1C1E",
  surfaceMuted: "rgba(255,255,255,0.03)",
  surfaceSoft: "rgba(255,255,255,0.05)",
  surfaceSubtle: "rgba(255,255,255,0.06)",
  surfacePressed: "rgba(255,255,255,0.15)",
  surfaceOverlay: "#232323",
  surfaceDanger: "#3A1212",
  
  text: "#FFFFFF",
  textSecondary: "#A0A0A0",
  textHint: "#555555",
  textTertiary: "#666666",
  textFaint: "#999999",
  textSoft: "#DDDDDD",
  
  card: '#1C1C1E',
  
  outline: "#333333",
  outlineSoft: "rgba(255,255,255,0.05)",
  outlineSubtle: "rgba(255,255,255,0.02)",
  outlineMuted: "rgba(255,255,255,0.1)",
  
  shadow: "#000000",
  mutedBorder: "#ddd",
  mutedSurface: "#fafafa",
};

export const LightTheme = {
  ...commonColors,
  
  background: "#F2F2F7",
  surface: "#FFFFFF",   
  surfaceAlt: "#F8F8F8",
  surfaceMuted: "rgba(0,0,0,0.03)",
  surfaceSoft: "rgba(0,0,0,0.05)",
  surfaceSubtle: "rgba(0,0,0,0.06)",
  surfacePressed: "rgba(0,0,0,0.15)",
  surfaceOverlay: "#FFFFFF",
  surfaceDanger: "#FFEBEE", 
  
  text: "#000000",
  textSecondary: "#666666",
  textHint: "#999999",
  textTertiary: "#888888",
  textFaint: "#BBBBBB",
  textSoft: "#333333",
  
  card: '#FFFFFF',
  
  outline: "#E5E5EA",
  outlineSoft: "rgba(0,0,0,0.05)",
  outlineSubtle: "rgba(0,0,0,0.02)",
  outlineMuted: "rgba(0,0,0,0.1)",
  
  shadow: "rgba(0,0,0,0.1)",
  mutedBorder: "#E5E5EA",
  mutedSurface: "#F2F2F7",
};

export const Colors = DarkTheme;