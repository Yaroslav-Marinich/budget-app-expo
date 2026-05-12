import { StyleSheet } from "react-native";

export const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
    },
    logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
  buttonsContainer: {
    gap: 15,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 20,
    gap: 10,
  },
  googleBtnText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  anonymousBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.outline,
    gap: 10,
  },
  anonymousBtnText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});