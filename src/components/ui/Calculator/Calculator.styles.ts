import { Colors } from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  amountContainer: { 
    flexDirection: 'row', 
    alignItems: 'flex-end', 
    justifyContent: 'center', 
    paddingBottom: 20, 
    marginBottom: 20, 
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline,
  },
  amountText: { color: Colors.text, fontSize: 56, fontWeight: 'bold' },
  currencyLabel: { color: Colors.accent, fontSize: 24, marginLeft: 10, marginBottom: 10, fontWeight: '600' },
  
  keyboard: { width: '100%', marginBottom: 10 },
  keyboardRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 10,
    gap: 10, 
  },
  key: { 
    flex: 1, 
    height: 70, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1, 
    borderColor: Colors.outline,
    borderRadius: 20, 
    backgroundColor: Colors.surface,
  },
  keyText: { color: Colors.text, fontSize: 32, fontWeight: '500' },
});