import { Colors } from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingBottom: 40,
  },
  dragIndicator: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.outline,
    alignSelf: 'center',
    marginBottom: 20,
  },
  // --- Стилі вибору року ---
  yearSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  arrowBtn: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 15,
  },
  yearText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  // --- Стилі сітки місяців ---
  monthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  monthBtn: {
    width: '31%',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 5,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  monthBtnActive: {
    backgroundColor: `${Colors.primary}15`,
    borderColor: Colors.primary,
  },
  monthText: {
    color: Colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  monthTextActive: {
    color: Colors.primary,
    fontWeight: 'bold',
  },

  currentMonthBtn: {
    flexDirection: 'row',
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: `${Colors.primary}15`,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: `${Colors.primary}30`,
  },
  currentMonthText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});