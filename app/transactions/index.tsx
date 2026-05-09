import { TransactionsScreen } from "@/src/screens/TransactionsScreen/TransactionsScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function WalletsRoute() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TransactionsScreen />
    </GestureHandlerRootView>
  );
}