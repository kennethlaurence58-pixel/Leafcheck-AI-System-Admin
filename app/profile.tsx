import { BottomNav } from "@/components/bottom-nav";
import { useProfile } from "@/context/profile";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Editor = "name" | "email" | "password" | null;

export default function Profile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const profile = useProfile();
  const [editor, setEditor] = useState<Editor>(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const openEditor = (kind: Exclude<Editor, null>) => {
    setEditor(kind);
    setError("");
    setDraft(kind === "name" ? profile.name : kind === "email" ? profile.email : "");
    setPassword("");
    setConfirm("");
  };

  const save = () => {
    if (editor === "name") {
      const value = draft.trim();
      if (!value) return setError("Enter your name.");
      if (Array.from(value).length > 20) return setError("Name must be 20 characters or fewer.");
      profile.setName(value);
    } else if (editor === "email") {
      const value = draft.trim();
      if (!/^[^\s@]+@gmail\.com$/i.test(value)) return setError("Enter a valid Gmail address ending in @gmail.com.");
      profile.setEmail(value);
    } else if (editor === "password") {
      if (password.length > 20 || confirm.length > 20) return setError("Password must be 20 characters or fewer.");
      if (password.length < 8) return setError("Use at least 8 characters.");
      if (password !== confirm) return setError("Passwords must match.");
      Alert.alert("Password saved locally", "Password changes will sync when authentication is connected.");
    }
    setEditor(null);
  };

  const choosePhoto = async () => {
    try {
      if (Platform.OS !== "web") {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          Alert.alert("Photo access needed", "Allow photo access to choose a profile picture.");
          return;
        }
      }
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, aspect: [1, 1], quality: 0.85 });
      if (!result.canceled && result.assets[0]) profile.setPhotoUri(result.assets[0].uri);
    } catch {
      Alert.alert("Photo unavailable", "The photo library could not be opened.");
    }
  };

  return (
    <KeyboardAvoidingView style={[styles.container, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 100 }]} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.header}>
        <Pressable onPress={() => router.navigate("/(tabs)")} accessibilityRole="button" accessibilityLabel="Back to Home"><Ionicons name="chevron-back-circle-outline" size={32} color="#111" /></Pressable>
        <Pressable onPress={() => router.navigate("/settings")} accessibilityRole="button" accessibilityLabel="Open settings"><Ionicons name="ellipsis-horizontal" size={26} color="#20B64D" /></Pressable>
      </View>
      <Pressable onPress={choosePhoto} accessibilityRole="button" accessibilityLabel="Upload profile picture" style={styles.avatarWrap}>
        {profile.photoUri ? <Image source={{ uri: profile.photoUri }} style={styles.avatar} /> : <View style={styles.avatar}><Ionicons name="person" size={58} color="#2F8135" /></View>}
        <View style={styles.addPhoto}><Ionicons name="add" size={20} color="#20B64D" /></View>
      </Pressable>
      <Pressable onPress={() => openEditor("name")} accessibilityRole="button" accessibilityLabel="Edit name"><Text style={styles.name}>{profile.name} <Ionicons name="pencil" size={15} color="#111" /></Text></Pressable>
      <Text style={styles.email}>{profile.email}</Text>
      {profile.photoUri && <Pressable onPress={() => profile.setPhotoUri(undefined)} accessibilityRole="button" accessibilityLabel="Remove profile picture"><Text style={styles.removePhoto}>Remove photo</Text></Pressable>}
      <View style={styles.card}>
        <ProfileRow icon="person-outline" label="Update Profile" onPress={() => openEditor("name")} />
        <ProfileRow icon="camera-outline" label="Upload Profile" onPress={choosePhoto} />
        <ProfileRow icon="mail-outline" label="Edit Email" onPress={() => openEditor("email")} />
        <ProfileRow icon="key-outline" label="Edit Password" onPress={() => openEditor("password")} last />
      </View>
      <BottomNav />
      <Modal visible={editor !== null} transparent animationType="fade" onRequestClose={() => setEditor(null)}>
        <View style={styles.backdrop}><View style={styles.dialog}>
          <Text style={styles.dialogTitle}>{editor === "name" ? "Update Profile" : editor === "email" ? "Edit Email" : "Edit Password"}</Text>
          {editor !== "password" ? <TextInput autoFocus value={draft} onChangeText={setDraft} maxLength={editor === "email" ? undefined : 20} keyboardType={editor === "email" ? "email-address" : "default"} autoCapitalize={editor === "email" ? "none" : "words"} style={styles.input} placeholder={editor === "email" ? "Email address (@gmail.com)" : "Your name"} /> : <><TextInput autoFocus value={password} onChangeText={setPassword} maxLength={20} secureTextEntry style={styles.input} placeholder="New password" /><TextInput value={confirm} onChangeText={setConfirm} maxLength={20} secureTextEntry style={styles.input} placeholder="Confirm password" /></>}
          {!!error && <Text style={styles.error}>{error}</Text>}
          <View style={styles.actions}><Pressable onPress={() => setEditor(null)} style={styles.cancel}><Text>Cancel</Text></Pressable><Pressable onPress={save} style={styles.save}><Text style={styles.saveText}>Save</Text></Pressable></View>
        </View></View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

function ProfileRow({ icon, label, onPress, last = false }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void; last?: boolean }) {
  return <Pressable onPress={onPress} style={[styles.row, last && styles.lastRow]} accessibilityRole="button" accessibilityLabel={label}><Ionicons name={icon} size={20} color="#25B853" /><Text style={styles.rowText}>{label}</Text><Ionicons name="chevron-forward" size={17} color="#BBB" /></Pressable>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF", paddingHorizontal: 24 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  avatarWrap: { alignSelf: "center", marginTop: 45, position: "relative" },
  avatar: { width: 110, height: 110, borderRadius: 55, backgroundColor: "#EAF8ED", alignItems: "center", justifyContent: "center" },
  addPhoto: { position: "absolute", right: -2, bottom: 0, width: 25, height: 25, borderRadius: 13, backgroundColor: "#FFF", borderWidth: 3, borderColor: "#20B64D", alignItems: "center", justifyContent: "center" },
  name: { fontSize: 22, fontWeight: "800", textAlign: "center", marginTop: 12 },
  email: { textAlign: "center", color: "#999", marginTop: 5 },
  removePhoto: { textAlign: "center", color: "#AD3434", marginTop: 8, fontWeight: "600" },
  card: { marginTop: 35, borderWidth: 1, borderColor: "#E7E7E7", borderRadius: 18, paddingHorizontal: 16 },
  row: { height: 58, flexDirection: "row", alignItems: "center", gap: 14, borderBottomWidth: 1, borderBottomColor: "#EEE" },
  lastRow: { borderBottomWidth: 0 },
  rowText: { flex: 1, fontSize: 15 },
  backdrop: { flex: 1, backgroundColor: "#0006", justifyContent: "center", padding: 24 },
  dialog: { backgroundColor: "#FFF", borderRadius: 24, padding: 22, gap: 12 },
  dialogTitle: { fontSize: 22, fontWeight: "800", color: "#193E27" },
  input: { minHeight: 50, borderRadius: 25, borderWidth: 1, borderColor: "#DBE7DA", paddingHorizontal: 18, fontSize: 16 },
  error: { color: "#AD3434" },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 12, marginTop: 4 },
  cancel: { padding: 13 },
  save: { borderRadius: 25, backgroundColor: "#278448", paddingHorizontal: 24, paddingVertical: 13 },
  saveText: { color: "#FFF", fontWeight: "700" },
});
