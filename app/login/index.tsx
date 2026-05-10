import { AuthScreen } from "@/src/screens/AuthScreen/AuthScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function LoginRoute() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthScreen />
    </GestureHandlerRootView>
  );
}