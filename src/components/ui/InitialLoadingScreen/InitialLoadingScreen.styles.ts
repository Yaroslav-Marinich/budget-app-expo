import { StyleSheet } from "react-native";

export const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  loader: {
    marginBottom: 15,
  },
  subtitle: {
    color: colors.textSecondary || '#aaa',
    fontSize: 17,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
  },
  footerText: {
    color: '#666', // Тьмяний колір, щоб не відволікати увагу
    fontSize: 12,
    letterSpacing: 1.5, // Робимо букви трохи розрідженими для стилю
    textTransform: 'uppercase', // Робимо текст великими літерами
    fontWeight: '600',
  },
});