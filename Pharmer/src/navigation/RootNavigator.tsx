// D:\temp\Pharmer\src\navigation\RootNavigator.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInScreen from "../../src/screens/SignInScreen";
import SignUpScreen from "../../src/screens/SignUpScreen";
import GoogleAuth from "../../src/screens/googleAuth";
import SearchScreen from "../HomeScreen/SearchBox";
import AppTabs from "../HomeScreen/appsTabs"; // 1. Import the new Tab component
import { CartProvider } from '../cart/contents';
import CartScreen from "../cart/screen";
import AboutScreen from "../screens/AboutScreen";
import { RootStackParamList } from "../types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <CartProvider>
      <Stack.Navigator initialRouteName="SignUp"
        screenOptions={{ headerShown: false }}
      >

        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="GoogleAuth" component={GoogleAuth} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="Home" component={AppTabs} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />

      </Stack.Navigator>
    </CartProvider>

  );
}
