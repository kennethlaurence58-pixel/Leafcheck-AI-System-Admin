import { AuthButton } from "@/components/auth-button";
import { AuthLayout, authStyles } from "@/components/auth-layout";
import { CustomTextInput } from "@/components/custom-text-input";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  // Preserve the existing OTP route. Email delivery needs backend integration.
  const handleSendOTP = () => router.push({ pathname: "/otp-verification", params: { email } });
  const backToLogin = () => router.replace("/login");

  return (
    <AuthLayout recovery title="Forgot password?" description="Enter the email linked to your account to start resetting your password." onBack={backToLogin}>
      <CustomTextInput label="Email address" value={email} onChangeText={setEmail} placeholder="Enter your email address" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" returnKeyType="done" onSubmitEditing={handleSendOTP} />
      <Text style={authStyles.note}>Use your account email for the verification step.</Text>
      <AuthButton title="Send OTP" onPress={handleSendOTP} />
      <View style={authStyles.footer}>
        <Text style={authStyles.footerText}>Remember your password?</Text>
        <Pressable accessibilityRole="link" onPress={backToLogin} style={authStyles.linkButton}><Text style={authStyles.link}>Log in</Text></Pressable>
      </View>
    </AuthLayout>
  );
}
