import { CategoriesScreen } from "@/src/screens/CategoriesScreen/CategoriesScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function CategoriesRoute() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CategoriesScreen />
    </GestureHandlerRootView>
  );
}