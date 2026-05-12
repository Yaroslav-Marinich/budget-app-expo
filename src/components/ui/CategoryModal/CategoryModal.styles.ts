import { StyleSheet } from "react-native";

export const getStyles = (colors: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlayHeavy,
    justifyContent: 'flex-end',
  },
modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    maxHeight: '95%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeBtn: {
    padding: 4,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 5,
  },
  input: {
    backgroundColor: colors.background,
    color: colors.text,
    padding: 15,
    borderRadius: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.outline,
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
    backgroundColor: colors.background,
    alignItems: 'center',
      justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  iconBoxActive: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}15`,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveBtnText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});