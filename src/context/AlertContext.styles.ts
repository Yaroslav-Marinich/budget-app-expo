import { StyleSheet } from "react-native";

import { Colors } from "@/src/constants/Colors";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlayStrong,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  alertBox: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderRadius: 16,
    paddingTop: 20,
    paddingHorizontal: 18,
    paddingBottom: 14,
  },
  title: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },
  message: {
    color: Colors.textSecondary,
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
    borderColor: Colors.outline,
    backgroundColor: Colors.surfaceOverlay,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  buttonCancel: {
    backgroundColor: "transparent",
  },
  buttonDestructive: {
    backgroundColor: Colors.surfaceDanger,
    borderColor: Colors.error,
  },
  buttonDefault: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  buttonText: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  buttonTextCancel: {
    color: Colors.textSecondary,
  },
  buttonTextDestructive: {
    color: Colors.errorLight,
  },
  rowButton: {
    flex: 1,
    width: undefined,
  },
});
