import { Colors } from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  content: { backgroundColor: Colors.surface, width: '90%', borderRadius: 24, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  yearText: { color: Colors.text, fontSize: 20, fontWeight: 'bold' },
  monthsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  
  // Змінили ширину на 48% (2 в ряд) і додали горизонтальне вирівнювання
  monthBtn: { 
    width: '48%', 
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16, 
    paddingHorizontal: 15,
    borderRadius: 16, 
    marginBottom: 12, 
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.outline
  },
  monthBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  
  // Стилі для номера та назви
  monthNum: { color: Colors.textSecondary, fontSize: 16, fontWeight: 'bold', marginRight: 10 },
  monthText: { color: Colors.text, fontSize: 16, fontWeight: '500' },
  textActive: { color: 'white' } // Спільний стиль для білого тексту при виділенні
});