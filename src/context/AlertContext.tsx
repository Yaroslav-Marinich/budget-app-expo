import React, { useEffect, useMemo, useState } from "react";
import { AlertButton, AlertOptions, Modal, Pressable, Text, View } from "react-native";

import { useTheme } from "@/src/context/ThemeContext";
import { registerAlertHandler } from "@/src/services/alert";
import { getStyles } from "./AlertContext.styles";

interface AlertState {
  visible: boolean;
  title: string;
  message?: string;
  buttons: AlertButton[];
  options?: AlertOptions;
}

const initialState: AlertState = {
  visible: false,
  title: "",
  message: "",
  buttons: [],
};

const defaultButtons: AlertButton[] = [{ text: "OK" }];

export const CustomAlertProvider = ({ children }: { children: React.ReactNode }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  
  const [state, setState] = useState<AlertState>(initialState);

  useEffect(() => {
    registerAlertHandler((title, message, buttons, options) => {
      setState({
        visible: true,
        title,
        message,
        buttons: buttons && buttons.length > 0 ? buttons : defaultButtons,
        options,
      });
    });

    return () => registerAlertHandler(null);
  }, []);

  const isTwoButtons = state.buttons.length === 2;

  const closeAlert = (onPress?: () => void) => {
    setState((prev) => ({ ...prev, visible: false }));
    if (onPress) {
      setTimeout(() => onPress(), 0);
    }
  };

  const handleDismiss = () => {
    if (state.options?.cancelable === false) {
      return;
    }

    const cancelButton = state.buttons.find((button) => button.style === "cancel");
    closeAlert(cancelButton?.onPress);
    state.options?.onDismiss?.();
  };

  const actionLayoutStyle = useMemo(
    () => [styles.actions, isTwoButtons ? styles.actionsRow : styles.actionsColumn],
    [isTwoButtons],
  );

  return (
    <>
      {children}

      <Modal
        transparent
        visible={state.visible}
        animationType="fade"
        onRequestClose={handleDismiss}
      >
        <Pressable style={styles.overlay} onPress={handleDismiss}>
          <Pressable style={styles.alertBox} onPress={(event) => event.stopPropagation()}>
            <Text style={styles.title}>{state.title}</Text>

            {!!state.message && <Text style={styles.message}>{state.message}</Text>}

            <View style={actionLayoutStyle}>
              {state.buttons.map((button, index) => {
                const isCancel = button.style === "cancel";
                const isDestructive = button.style === "destructive";
                const isDefault = !isCancel && !isDestructive;

                return (
                  <Pressable
                    key={`${button.text || "button"}-${index}`}
                    style={[
                      styles.button,
                      isTwoButtons && styles.rowButton,
                      isCancel && styles.buttonCancel,
                      isDestructive && styles.buttonDestructive,
                      isDefault && styles.buttonDefault,
                    ]}
                    onPress={() => closeAlert(button.onPress)}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        isCancel && styles.buttonTextCancel,
                        isDestructive && styles.buttonTextDestructive,
                        isDefault && styles.buttonTextDefault, 
                      ]}
                    >
                      {button.text || "OK"}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};