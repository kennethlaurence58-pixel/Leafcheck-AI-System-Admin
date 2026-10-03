import { BottomNav } from "@/components/bottom-nav";
import { GreetingHeader } from "@/components/greeting-header";
import { PlantOverviewCard } from "@/components/plant-overview-card";
import { usePlantData } from "@/context/plant-data";
import { useSpaces } from "@/context/spaces";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Modal, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { spaces, plantsBySpace } = useSpaces();
  const sensor = usePlantData();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const plantNames = spaces.flatMap((space) => plantsBySpace[space] ?? []);
  const [showAiSummary, setShowAiSummary] = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const refresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 450); };
  const openSpace = (space: string) => router.navigate({ pathname: "/(tabs)/space-detail", params: { space } });

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.topBackground} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 120 }]}
      >
        <GreetingHeader />

        {!sensor.connected && !alertDismissed && (
          <View style={styles.sensorAlert} accessibilityLiveRegion="polite">
            <View style={styles.alertHeader}>
              <Text style={styles.alertTitle}>Alerts</Text>
            </View>
            <Text style={styles.alertText}>No sensors detected. Tap Connect Device to connect an IoT device, or continue using AI Camera and manual tracking.</Text>
            <View style={styles.alertActions}>
              <Pressable style={styles.connectButton} onPress={() => Alert.alert("IoT connection unavailable", "The device transport is ready for integration, but no IoT device connection is configured in this build.")} accessibilityRole="button" accessibilityLabel="Connect IoT device">
                <Text style={styles.connectButtonText}>Connect Device</Text>
              </Pressable>
              <Pressable style={styles.dismissButton} onPress={() => setAlertDismissed(true)} accessibilityRole="button" accessibilityLabel="Dismiss alert">
                <Text style={styles.dismissText}>Dismiss</Text>
              </Pressable>
            </View>
          </View>
        )}

        <Pressable style={styles.aiEstimatesContainer} onPress={() => setShowAiSummary(true)} accessibilityRole="button" accessibilityLabel="Open AI estimates">
          <Text style={styles.sectionTitle}>AI Summary</Text>
          <View>
            <Text style={styles.summaryTitle}>{spaces.length === 0 ? "No plant captures yet" : "Your plant collection"}</Text>
            <Text style={styles.summaryText}>
              {spaces.length === 0
                ? "When you add plants or post photos in My Spaces, their local summary will appear here."
                : `${plantNames.length} plants across ${spaces.length} spaces: ${plantNames.join(", ")}. AI analysis is ready for a future connection.`}
            </Text>
            <Text style={styles.summaryLink}>Tap to read the full summary</Text>
          </View>
        </Pressable>

        <PlantOverviewCard />
      </ScrollView>

      <BottomNav />
      <Modal visible={showAiSummary} transparent animationType="fade" onRequestClose={() => setShowAiSummary(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>AI Summary</Text>
              <Pressable onPress={() => setShowAiSummary(false)} accessibilityRole="button" accessibilityLabel="Close AI estimates">
                <Text style={styles.close}>Close</Text>
              </Pressable>
            </View>
            <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator>
              <Text style={styles.summaryTitle}>{spaces.length === 0 ? "No plant captures yet" : "Plant summary"}</Text>
              <Text style={styles.summaryText}>
                {spaces.length === 0
                  ? "There are no plants or photos in your spaces yet. Add a plant or choose a local photo from My Spaces to prepare it for a future AI connection."
                  : `Your spaces contain ${plantNames.length} plants. No diagnosis, health score, or measurement has been generated because AI analysis is not connected yet.`}
              </Text>
              {spaces.map((space) => (
                <Pressable key={space} onPress={() => { setShowAiSummary(false); openSpace(space); }} accessibilityRole="button" accessibilityLabel={`Open ${space} details`} style={styles.spaceSummaryLink}>
                  <Text style={styles.summaryLink}>{space}</Text>
                  <Text style={styles.summaryText}>{(plantsBySpace[space] ?? []).join(", ") || "No plants yet"} · Open space details</Text>
                </Pressable>
              ))}
              <Text style={styles.modalSection}>Connection status</Text>
              {spaces.length > 0 && sensor.connected ? (
                <Pressable onPress={() => { setShowAiSummary(false); openSpace(spaces[0]); }} accessibilityRole="button" accessibilityLabel={`Open live IoT details for ${spaces[0]}`}>
                  <Text style={styles.summaryText}>AI estimates will appear here when the analysis service is connected. <Text style={styles.summaryLink}>View live IoT details in {spaces[0]}</Text>.</Text>
                </Pressable>
              ) : (
                <Text style={styles.summaryText}>AI estimates will appear here when the analysis service is connected. Current information comes only from your local spaces and plants.</Text>
              )}
              <Pressable onPress={() => { setShowAiSummary(false); router.navigate("/(tabs)/spaces"); }} style={styles.modalAction} accessibilityRole="button">
                <Text style={styles.modalActionText}>Open My Spaces</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  content: {
    flexGrow: 1,
  },
  topBackground: {
    position: "absolute",
    top: 0,
    width: 476,
    height: 263,
    left: "50%",
    marginLeft: -238,
    backgroundColor: "#2F8135",
    borderBottomLeftRadius: 112,
    borderBottomRightRadius: 112,
  },
  sensorAlert: { backgroundColor: "#193E27", borderRadius: 22, padding: 14, marginBottom: 16, gap: 10 },
  alertHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  alertTitle: { color: "#F4A900", fontSize: 14, fontWeight: "800" },
  alertText: { color: "#FFFFFF", fontSize: 13, lineHeight: 19 },
  alertActions: { flexDirection: "row", gap: 10 },
  connectButton: { flex: 1, minHeight: 44, borderRadius: 14, backgroundColor: "#F4A900", alignItems: "center", justifyContent: "center" },
  connectButtonText: { color: "#193E27", fontWeight: "800" },
  dismissButton: { flex: 1, minHeight: 44, borderRadius: 14, backgroundColor: "#AAB2AC", alignItems: "center", justifyContent: "center" },
  dismissText: { color: "#FFFFFF", fontWeight: "700" },
  aiEstimatesContainer: {
    width: "100%",
    padding: 16,
    marginBottom: 16,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "#25B853",
    backgroundColor: "#FFFFFF",
    maxHeight: 360,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1B1B1B",
    marginBottom: 14,
  },
  summaryTitle: { fontSize: 18, fontWeight: "700", color: "#193E27", marginBottom: 8 },
  summaryText: { color: "#66746A", lineHeight: 21 },
  summaryLink: { color: "#20B64D", fontWeight: "700", marginTop: 14 },
  spaceSummaryLink: { borderTopWidth: 1, borderTopColor: "#DBE7DA", paddingTop: 10 },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(16, 39, 25, 0.6)", justifyContent: "center", padding: 24 },
  modalCard: { maxHeight: "82%", width: "100%", maxWidth: 520, alignSelf: "center", borderRadius: 24, backgroundColor: "#FFFFFF", padding: 20 },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  modalTitle: { fontSize: 22, fontWeight: "800", color: "#193E27" },
  close: { color: "#278448", fontWeight: "700", padding: 8 },
  modalScroll: { flexGrow: 0 },
  modalContent: { paddingBottom: 8, gap: 12 },
  modalSection: { fontSize: 13, fontWeight: "800", color: "#278448", letterSpacing: 1, marginTop: 8 },
  modalAction: { minHeight: 50, borderRadius: 25, backgroundColor: "#278448", alignItems: "center", justifyContent: "center", marginTop: 10 },
  modalActionText: { color: "#FFFFFF", fontWeight: "700" },
});
