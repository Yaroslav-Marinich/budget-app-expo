import { Colors } from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlayHeavy,
    justifyContent: 'flex-end',
  },
modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    maxHeight: '95%',
  },
  dragIndicator: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.outline,
    alignSelf: 'center',
    marginBottom: 15,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeBtn: {
    padding: 4,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 5,
  },
  input: {
    backgroundColor: Colors.background,
    color: Colors.text,
    padding: 15,
    borderRadius: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.outline,
    marginBottom: 20,
  },
  iconsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  iconBox: {
    width: '18%', 
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: Colors.background,
    alignItems: 'center',
      justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  iconBoxActive: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}15`,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveBtnText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});