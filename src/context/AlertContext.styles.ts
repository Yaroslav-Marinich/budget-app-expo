import { StyleSheet } from "react-native";

export const getStyles = (colors: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlayStrong,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  alertBox: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: 16,
    paddingTop: 20,
    paddingHorizontal: 18,
    paddingBottom: 14,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },
  message: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 18,
  },
  actions: {
    gap: 10,
    width: "100%",
  },
  actionsRow: {
    flexDirection: "row",
  },
  actionsColumn: {
    flexDirection: "column",
  },
  button: {
    minHeight: 44,
    width: "100%",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.outline,
    backgroundColor: colors.surfaceOverlay,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  buttonCancel: {
    backgroundColor: "transparent",
    borderColor: colors.outline,
  },
  buttonDestructive: {
    backgroundColor: colors.surfaceDanger,
    borderColor: colors.dangerSoft, 
  },
  buttonDefault: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  buttonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  buttonTextCancel: {
    color: colors.textSecondary,
  },
  buttonTextDestructive: {
    color: colors.danger, 
  },
  buttonTextDefault: {
    color: colors.white, 
  },
  rowButton: {
    flex: 1,
    width: undefined,
  },
});