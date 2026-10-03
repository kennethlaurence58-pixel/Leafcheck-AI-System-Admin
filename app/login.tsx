import { AuthButton } from "@/components/auth-button";
import { AuthLayout, authStyles } from "@/components/auth-layout";
import { CustomTextInput } from "@/components/custom-text-input";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // Prototype role routing only. Replace with the authenticated role returned by your backend.
  const handleLogin = () => {
    const isAdminPreview = email.trim().toLowerCase() === "admin@leafcheck.com";
    router.replace(isAdminPreview ? "/admin" : "/");
  };

  return (
    <AuthLayout title="Welcome back" description="Log in to your little world of green.">
      <CustomTextInput label="Email" value={email} onChangeText={setEmail} placeholder="Enter your email" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" returnKeyType="next" />
      <CustomTextInput label="Password" value={password} onChangeText={setPassword} placeholder="Enter your password" secureTextEntry={!showPassword} onToggleVisibility={() => setShowPassword((value) => !value)} autoCorrect={false} autoComplete="current-password" returnKeyType="done" onSubmitEditing={handleLogin} />
      <Pressable accessibilityRole="link" onPress={() => router.push("/forgot-password")} style={authStyles.recoveryLink}><Text style={authStyles.link}>Forgot password?</Text></Pressable>
      <AuthButton title="Log in" onPress={handleLogin} />
      <Text style={{ textAlign: "center", color: "#6B756F", fontSize: 12, marginTop: 8 }}>Admin UI preview: admin@leafcheck.com</Text>
      <View style={authStyles.footer}>
        <Text style={authStyles.footerText}>New to LeafCheck?</Text>
        <Pressable accessibilityRole="link" onPress={() => router.push("/register")} style={authStyles.linkButton}><Text style={authStyles.link}>Sign up</Text></Pressable>
      </View>
    </AuthLayout>
  );
}
