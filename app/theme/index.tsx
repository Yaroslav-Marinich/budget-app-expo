import { ThemeScreen } from "@/src/screens/ThemeScreen/ThemeScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function ThemeRoute() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeScreen />
    </GestureHandlerRootView>
  );
}