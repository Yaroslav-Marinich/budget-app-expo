import { Colors } from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  listContent: { padding: 20 },

  primaryBorder: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  primaryBadge: {
    position: 'absolute',
    top: 0,
    left: 20, 
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
  },
  primaryBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  // Рядок рахунку
  walletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  itemContainer: {
    marginBottom: 12,
    position: 'relative',
    paddingTop: 10,
  },
  deleteAction: {
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 20,
    borderRadius: 20,
    width: 100,
    height: '100%',
    borderWidth: 1,
    borderColor: Colors.outline,
    borderLeftWidth: 0,
    marginLeft: -40,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoBox: { flex: 1 },
  title: { color: Colors.text, fontSize: 16, fontWeight: 'bold' },
  balance: { color: Colors.textSecondary, fontSize: 14, marginTop: 2 },
  
  actions: { flexDirection: 'row', alignItems: 'center' },
    actionBtn: { padding: 8, marginLeft: 4 },
  
    fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  screenTitle: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: 'bold',
  },
  archivedRow: {
    opacity: 0.6,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  archivedBadge: {
    position: 'absolute',
    top: 0,
    right: 60,
    backgroundColor: Colors.textSecondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    zIndex: 10,
  },
  archivedBadgeText: {
    color: Colors.background,
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },

  // Модалка
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    maxHeight: '90%',
  },
  inputLabel: { color: Colors.textSecondary, fontSize: 12, marginBottom: 8, marginTop: 15, marginLeft: 5 },
  input: {
    backgroundColor: Colors.background,
    color: Colors.text,
    padding: 15,
    borderRadius: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  
  // Пошук валют
  currencyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline,
  },
  currencyCode: { color: Colors.accent, fontWeight: 'bold' },
  currencyName: { color: Colors.textSecondary, fontSize: 13 },
});