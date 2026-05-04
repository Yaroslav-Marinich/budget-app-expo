import { Colors } from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  amountContainer: { 
    flexDirection: 'row', 
    alignItems: 'flex-end', 
    justifyContent: 'center', 
    marginBottom: 30 
  },
  amountText: { color: Colors.text, fontSize: 56, fontWeight: 'bold' },
  currencyLabel: { color: Colors.accent, fontSize: 24, marginLeft: 10, marginBottom: 10, fontWeight: '600' },
  
  keyboard: { width: '100%', marginBottom: 20 },
  keyboardRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  key: { flex: 1, height: 70, justifyContent: 'center', alignItems: 'center' },
  keyText: { color: Colors.text, fontSize: 32, fontWeight: '500' },
});