import { WalletsScreen } from "@/src/screens/WalletsScreen/WalletsScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function WalletsRoute() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <WalletsScreen />
    </GestureHandlerRootView>
  );
}