import { BottomNav } from "@/components/bottom-nav";
import { useSpaces } from "@/context/spaces";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useState } from "react";

export default function SpacesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { spaces, addSpace, archiveSpace, deleteSpace } = useSpaces();
  const backgrounds = ["#E8F2E8", "#E3EFEF", "#F3EBD8", "#EDE6F1", "#F5E5DE"];
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [background, setBackground] = useState(backgrounds[0]);

  const createSpace = () => {
    const result = addSpace(name, background);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setName("");
    setBackground(backgrounds[0]);
    setError("");
    setModalVisible(false);
  };

  const openSpaceMenu = (space: string) => {
    Alert.alert(space, "Manage this space", [
      { text: "Archive", onPress: () => archiveSpace(space) },
      { text: "Delete", style: "destructive", onPress: () => deleteSpace(space) },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 14, paddingBottom: insets.bottom + 106 }]}>
      <View style={styles.header}>
        <View><Text style={styles.my}>MY</Text><Text style={styles.spacesTitle}>SPACES</Text></View>
        <View style={styles.headerActions}>
          <Pressable style={styles.headerButton} onPress={() => router.push("/notifications")} accessibilityRole="button" accessibilityLabel="Notifications"><Ionicons name="notifications-outline" size={17} color="#20B64D" /></Pressable>
          <Pressable style={styles.headerButton} onPress={() => router.replace("/profile")} accessibilityRole="button" accessibilityLabel="Open profile"><Ionicons name="person-outline" size={17} color="#20B64D" /></Pressable>
        </View>
      </View>
      <View style={styles.spaceList}>
        {spaces.map((space) => (
          <Pressable key={space} style={styles.spaceCard} onPress={() => router.push({ pathname: "/(tabs)/space-detail", params: { space } })} accessibilityRole="button" accessibilityLabel={`Open ${space}`}>
            <Pressable style={styles.menuDots} onPress={(event) => { event.stopPropagation(); openSpaceMenu(space); }} accessibilityRole="button" accessibilityLabel={`Manage ${space}`}>
              <View style={styles.dot} /><View style={styles.dot} /><View style={styles.dot} />
            </Pressable>
            <Text style={styles.spaceName}>{space}</Text>
            <View style={styles.addPlant}><Text style={styles.addPlantText}>Add a Plant</Text></View>
          </Pressable>
        ))}
      </View>
      <Pressable style={styles.plus} onPress={() => setModalVisible(true)} accessibilityRole="button" accessibilityLabel="Create a space"><Ionicons name="add" size={35} color="#20B64D" /></Pressable>
      <BottomNav />
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Create a space</Text>
            <TextInput autoFocus value={name} onChangeText={(value) => { setName(value); setError(""); }} placeholder="Space name" maxLength={10} style={styles.input} />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Text style={styles.colorLabel}>Choose a background</Text>
            <View style={styles.colors}>{backgrounds.map((color) => <Pressable key={color} onPress={() => setBackground(color)} accessibilityRole="button" accessibilityLabel={`Choose background ${color}`} style={[styles.color, { backgroundColor: color }, background === color && styles.selectedColor]} />)}</View>
            <View style={styles.modalActions}>
              <Pressable onPress={() => setModalVisible(false)} style={styles.cancel}><Text>Cancel</Text></Pressable>
              <Pressable onPress={createSpace} style={styles.create}><Text style={styles.createText}>Create</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", paddingHorizontal: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 },
  my: { fontSize: 36, lineHeight: 39, color: "#111111", fontWeight: "300" },
  spacesTitle: { fontSize: 36, lineHeight: 39, color: "#20B64D", fontWeight: "300" },
  headerActions: { flexDirection: "row", gap: 8, paddingTop: 3 },
  headerButton: { width: 38, height: 38, borderRadius: 20, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center", elevation: 2 },
  spaceList: { gap: 12, alignItems: "center", paddingHorizontal: 4 },
  spaceCard: { width: "100%", height: 145, borderRadius: 20, borderWidth: 1, borderColor: "#E8E8E8", backgroundColor: "#FFFFFF", padding: 15, justifyContent: "flex-end", shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  menuDots: { position: "absolute", top: 8, right: 8, flexDirection: "row", gap: 2, width: 30, height: 10, justifyContent: "flex-end", alignItems: "center" },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: "#20B64D" },
  spaceName: { fontSize: 27, color: "#171717" },
  addPlant: { position: "absolute", right: 11, bottom: 11, backgroundColor: "#36BF5A", borderRadius: 12, paddingHorizontal: 11, paddingVertical: 5 },
  addPlantText: { fontSize: 9, color: "#FFFFFF" },
  plus: { position: "absolute", right: 31, bottom: 91, width: 55, height: 55, borderRadius: 28, borderWidth: 2, borderColor: "#20B64D", backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center", zIndex: 2 },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", alignItems: "center", justifyContent: "center", padding: 24 },
  modalCard: { width: "100%", borderRadius: 22, backgroundColor: "#FFFFFF", padding: 22 },
  modalTitle: { fontSize: 22, fontWeight: "700", color: "#25833C", marginBottom: 15 },
  input: { borderWidth: 1, borderColor: "#25B853", borderRadius: 12, paddingHorizontal: 14, height: 48, fontSize: 16 },
  error: { color: "#D93636", marginTop: 8, fontSize: 13 },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: 12, marginTop: 18 },
  cancel: { padding: 12 },
  create: { backgroundColor: "#36BF5A", borderRadius: 12, paddingHorizontal: 18, paddingVertical: 12 },
  createText: { color: "#FFFFFF", fontWeight: "700" },
  colorLabel: { color: "#66746A", marginTop: 16, marginBottom: 8 },
  colors: { flexDirection: "row", gap: 10 },
  color: { width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: "#DBE7DA" },
  selectedColor: { borderWidth: 3, borderColor: "#278448" },
});
