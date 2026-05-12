import { useTheme } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { getStyles } from "./Calculator.styles";

interface CalculatorProps {
  amount: string;
  setAmount: (val: string | ((prev: string) => string)) => void;
  currencySymbol?: string; 
}

export const Calculator: React.FC<CalculatorProps> = ({ 
  amount, 
  setAmount, 
  currencySymbol = "₴" 
}) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  
  const handleKeyPress = (val: string) => {
    setAmount((prev) => {
      if (prev === "0" && val !== ".") return val;
      if (val === "." && prev.includes(".")) return prev;
      if (prev.length > 9) return prev;
      return prev + val;
    });
  };

  const handleBackspace = () => {
    setAmount((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
  };

  const keys = [["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"], [".", "0", "delete"]];

  return (
    <View>
      <View style={styles.amountContainer}>
        <Text style={styles.amountText}>{amount}</Text>
        <Text style={styles.currencyLabel}>{currencySymbol}</Text>
      </View>

      <View style={styles.keyboard}>
        {keys.map((row, i) => (
          <View key={i} style={styles.keyboardRow}>
            {row.map((key) => (
              <TouchableOpacity 
                key={key} 
                style={styles.key} 
                onPress={() => key === "delete" ? handleBackspace() : handleKeyPress(key)}
              >
                {key === "delete" ? (
                  <Ionicons name="backspace-outline" size={32} color={colors.text} />
                ) : (
                  <Text style={styles.keyText}>{key}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};