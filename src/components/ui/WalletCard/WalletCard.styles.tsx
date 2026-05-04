import { Colors } from "@/src/constants/Colors";
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: { 
    backgroundColor: Colors.surface, 
    width: 240, 
    padding: 20, 
    borderRadius: 24, 
    marginRight: 16, 
    borderWidth: 1, 
    borderColor: Colors.outline 
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  walletTitle: { color: Colors.textSecondary, fontSize: 14 },
  walletAmount: { color: Colors.text, fontSize: 26, fontWeight: 'bold' },
  currency: { color: Colors.accent, fontSize: 18 },
});