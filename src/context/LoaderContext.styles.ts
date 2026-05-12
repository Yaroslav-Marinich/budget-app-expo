import { StyleSheet } from "react-native";

export const getStyles = (colors: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderBox: {
    padding: 24,
    backgroundColor: colors.surface,
    borderRadius: 20,
    // Легка тінь
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  }
});