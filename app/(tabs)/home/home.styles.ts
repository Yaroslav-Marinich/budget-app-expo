import { Colors } from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // =======================
  // Рахунки
  // =======================
  sectionTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: "700",
    paddingHorizontal: 20,
    marginBottom: 15,
    marginTop: 10,
  },

  walletList: {
    paddingLeft: 20,
    marginBottom: 25,
  },

  walletCard: {
    backgroundColor: Colors.surface,
    width: 240,
    padding: 20,
    borderRadius: 24,
    marginRight: 16,
    borderWidth: 1,
    borderColor: Colors.outline,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },

  walletTitle: {
    color: Colors.textSecondary,
    fontSize: 14,
  },

  walletAmount: {
    color: Colors.text,
    fontSize: 26,
    fontWeight: "bold",
  },

  currency: {
    color: Colors.accent,
    fontSize: 18,
  },

  // =======================
  // Вибір дати
  // =======================
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    gap: 15,
  },

  dateText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "600",
    textTransform: "capitalize",
  },

  // =======================
  // Перемикач Витрати / Доходи
  // =======================
  toggleContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 15,
    marginBottom: 25,
  },

  toggleBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.outline,
  },

  toggleBtnActiveExpense: {
    backgroundColor: "rgba(139, 0, 0, 0.15)",
    borderColor: Colors.error,
  },

  toggleBtnActiveIncome: {
    backgroundColor: "rgba(46, 125, 50, 0.15)",
    borderColor: Colors.primary,
  },

  toggleLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },

  toggleAmount: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: "bold",
  },

  // =======================
  // Список категорій
  // =======================
categoriesContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingBottom: 20 
  },
  categoryCard: { 
    backgroundColor: Colors.surface, 
    width: '48%', 
    flexDirection: 'row',
    alignItems: 'center', 
    padding: 8,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.outline
  },
  iconContainer: { 
    width: 44,
    height: 44, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 10 
  },
  textContainer: {
    flex: 1, 
    justifyContent: 'center',
  },
  categoryName: { 
    color: Colors.textSecondary, 
    fontSize: 12,
    fontWeight: '500', 
    marginBottom: 2, 
  },
  categoryAmount: { 
    color: Colors.text, 
    fontSize: 14,
    fontWeight: 'bold', 
  },
});