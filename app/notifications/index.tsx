import { NotificationsScreen } from "@/src/screens/NotificationsScreen/NotificationsScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function NotificationsRoute() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NotificationsScreen />
    </GestureHandlerRootView>
  );
}