import { BottomNav } from "@/components/bottom-nav";
import { useSpaces } from "@/context/spaces";
import { useAppData } from "@/context/app-data";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, BackHandler, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SpaceDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { space } = useLocalSearchParams<{ space?: string }>();
  const currentSpace = space || "";
  const { plantsBySpace, addPlant, archiveSpace, deleteSpace } = useSpaces();
  const appData = useAppData();
  const plants = plantsBySpace[currentSpace] ?? [];
  const [modalVisible, setModalVisible] = useState(false);
  const [plantName, setPlantName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      router.replace("/(tabs)/spaces");
      return true;
    });
    return () => subscription.remove();
  }, [router]);

  const createPlant = () => {
    const result = addPlant(currentSpace, plantName);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setPlantName("");
    setError("");
    setModalVisible(false);
  };

  const openSpaceMenu = () => {
    Alert.alert(currentSpace, "Manage this space", [
      { text: "Archive", onPress: () => { archiveSpace(currentSpace); router.replace("/(tabs)/spaces"); } },
      { text: "Delete", style: "destructive", onPress: () => { deleteSpace(currentSpace); router.replace("/(tabs)/spaces"); } },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 105 }]}>
      <View style={styles.topRow}>
        <Pressable onPress={() => router.replace("/(tabs)/spaces")} style={styles.back} accessibilityRole="button" accessibilityLabel="Go back">
          <Ionicons name="chevron-back" size={22} color="#111111" />
        </Pressable>
        <Pressable onPress={openSpaceMenu} style={styles.menuDots} accessibilityRole="button" accessibilityLabel="Manage space">
          <View style={styles.dot} /><View style={styles.dot} /><View style={styles.dot} />
        </Pressable>
      </View>
      <Text style={styles.title}>{space || "Space"}</Text>
      <View style={styles.plantGrid}>
        {plants.map((plant, index) => (
          <Pressable key={plant} style={styles.plantCard} onPress={() => { const found = appData.plants.find(p => p.name.toLowerCase().includes(plant.toLowerCase().split(" ")[0])); router.push({ pathname: "/plant-profile", params: { id: found?.id || "1" } }); }} accessibilityRole="button" accessibilityLabel={`Open ${plant}`}>
            <Ionicons name="leaf-outline" size={68} color="#2E8A3F" />
            <Text style={styles.plantName}>{plant}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable style={styles.detailPlus} onPress={() => setModalVisible(true)} accessibilityRole="button" accessibilityLabel="Add plant">
        <Ionicons name="add" size={35} color="#20B64D" />
      </Pressable>
      <BottomNav />
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add a plant</Text>
            <TextInput autoFocus value={plantName} onChangeText={(value) => { setPlantName(value); setError(""); }} placeholder="Plant name" maxLength={10} style={styles.input} />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <View style={styles.modalActions}>
              <Pressable onPress={() => setModalVisible(false)} style={styles.cancel}><Text>Cancel</Text></Pressable>
              <Pressable onPress={createPlant} style={styles.create}><Text style={styles.createText}>Add</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", paddingHorizontal: 16 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  back: { width: 50, height: 50, borderRadius: 25, borderWidth: 1, borderColor: "#111111", alignItems: "center", justifyContent: "center" },
  menuDots: { flexDirection: "row", gap: 4, width: 48, height: 30, justifyContent: "center", alignItems: "center" },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#20B64D" },
  title: { fontSize: 28, color: "#111111", marginTop: 22, marginBottom: 8 },
  plantGrid: { flex: 1, flexDirection: "row", flexWrap: "wrap", alignContent: "flex-start", justifyContent: "space-between", rowGap: 17, paddingBottom: 80 },
  plantCard: { width: "47%", height: 142, borderRadius: 18, borderWidth: 1, borderColor: "#E8E8E8", backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  plantName: { fontSize: 15, color: "#222222", marginTop: 5 },
  detailPlus: { position: "absolute", right: 31, bottom: 91, width: 55, height: 55, borderRadius: 28, borderWidth: 2, borderColor: "#20B64D", backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center", zIndex: 3 },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", alignItems: "center", justifyContent: "center", padding: 24 },
  modalCard: { width: "100%", borderRadius: 22, backgroundColor: "#FFFFFF", padding: 22 },
  modalTitle: { fontSize: 22, fontWeight: "700", color: "#25833C", marginBottom: 15 },
  input: { borderWidth: 1, borderColor: "#25B853", borderRadius: 12, paddingHorizontal: 14, height: 48, fontSize: 16 },
  error: { color: "#D93636", marginTop: 8, fontSize: 13 },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: 12, marginTop: 18 },
  cancel: { padding: 12 },
  create: { backgroundColor: "#36BF5A", borderRadius: 12, paddingHorizontal: 18, paddingVertical: 12 },
  createText: { color: "#FFFFFF", fontWeight: "700" },
});
