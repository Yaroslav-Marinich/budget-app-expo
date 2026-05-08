import { Colors } from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // =======================
  // Overlay / Modal
  // =======================
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },

  dragIndicator: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.outline,
    alignSelf: "center",
    marginBottom: 15,
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
    color: Colors.text,
    fontSize: 20,
    fontWeight: "bold",
  },

  // =======================
  // Inputs
  // =======================
  label: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginBottom: 8,
    marginLeft: 5,
    marginTop: 15,
  },

  input: {
    backgroundColor: Colors.background,
    color: Colors.text,
    padding: 15,
    borderRadius: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.outline,
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
    backgroundColor: Colors.outline,
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
    backgroundColor: Colors.background,
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.outline,
    alignItems: "center",
  },

  toggleBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}10`,
  },

  toggleText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },

  toggleTextActive: {
    color: Colors.primary,
  },

  toggleSubtext: {
    color: Colors.textSecondary,
    fontSize: 11,
    textAlign: "center",
  },

  // =======================
  // Button
  // =======================
  saveBtn: {
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },

  saveBtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});