import { useTheme } from "@/src/context/ThemeContext";
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard // 🟢 ДОДАЛИ імпорт Keyboard
  ,

  Modal,
  ModalProps,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface DefaultModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  animationType?: ModalProps['animationType'];
  overlayStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  showDragIndicator?: boolean;
}

export const DefaultModal: React.FC<DefaultModalProps> = ({
  visible,
  onClose,
  children,
  animationType = "slide",
  overlayStyle,
  contentStyle,
  showDragIndicator = true,
}) => {
  const insets = useSafeAreaInsets();
  const touchY = useRef(0);
    const { colors } = useTheme();
    const styles = getStyles(colors);
  
  // 🟢 НОВИЙ СТАН: Зберігаємо реальну висоту клавіатури
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // 🟢 РУЧНИЙ СЛУХАЧ КЛАВІАТУРИ
  useEffect(() => {
    // iOS використовує WillShow для плавності, Android - DidShow для точності
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <Modal 
      animationType={animationType} 
      transparent 
      visible={visible} 
      onRequestClose={onClose}
      statusBarTranslucent={true} 
    >
      {/* 🟢 Прибрали KeyboardAvoidingView. Передаємо висоту клавіатури прямо в paddingBottom оверлею! */}
      <Pressable 
        style={[styles.modalOverlay, overlayStyle, { paddingBottom: keyboardHeight }]} 
        onPress={onClose}
      >
        <Pressable
          style={[
            styles.modalContent, 
            { paddingBottom: insets.bottom + 20 }, 
            contentStyle
          ]}
          onPress={(e) => e.stopPropagation()} 
          onTouchStart={(e) => (touchY.current = e.nativeEvent.pageY)}
          onTouchEnd={(e) => {
            if (e.nativeEvent.pageY - touchY.current > 50) onClose();
          }}
        >
          {showDragIndicator && <View style={styles.dragIndicator} />}
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlayMax || 'rgba(0,0,0,0.5)', 
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  dragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: colors.outline,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
});