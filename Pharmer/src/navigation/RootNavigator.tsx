// D:\temp\Pharmer\src\navigation\RootNavigator.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInScreen from "../../src/screens/SignInScreen";
import SignUpScreen from "../../src/screens/SignUpScreen";
import GoogleAuth from "../../src/screens/googleAuth";
import HomeScreen from '../HomeScreen/HomeScreen';
import AboutScreen from "../screens/AboutScreen";
import { RootStackParamList } from "../types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();



export default function App() {
  return (
    <Stack.Navigator initialRouteName="SignUp" 
      screenOptions={{ headerShown: false }}
    >

      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="GoogleAuth" component={GoogleAuth} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />

    </Stack.Navigator>
    
  );
}
