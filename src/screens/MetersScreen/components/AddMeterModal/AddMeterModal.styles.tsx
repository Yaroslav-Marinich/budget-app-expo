import { StyleSheet } from "react-native";

export const getStyles = (colors: any) => StyleSheet.create({
  // =======================
  // Overlay / Modal
  // =======================
  overlay: {
    flex: 1,
    backgroundColor: colors.overlayHeavy,
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // =======================
  // Header
  // =======================
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  modalTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
  },

  // =======================
  // Inputs
  // =======================
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 8,
    marginLeft: 5,
    marginTop: 15,
  },

  input: {
    backgroundColor: colors.background,
    color: colors.text,
    padding: 15,
    borderRadius: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.outline,
  },

  // =======================
  // Icons Grid
  // =======================
  iconsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  iconBox: {
    width: "30%",
    borderRadius: 18,
    paddingVertical: 12,
    backgroundColor: colors.outline,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },

  // =======================
  // Toggle
  // =======================
  toggleContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 5,
  },

  toggleBtn: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.outline,
    alignItems: "center",
  },

  toggleBtnActive: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },

  toggleText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },

  toggleTextActive: {
    color: colors.primary,
  },

  toggleSubtext: {
    color: colors.textSecondary,
    fontSize: 11,
    textAlign: "center",
  },

  // =======================
  // Button
  // =======================
  saveBtn: {
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },

  saveBtnText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});