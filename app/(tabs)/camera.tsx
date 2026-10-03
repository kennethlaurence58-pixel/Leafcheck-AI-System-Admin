import { BottomNav } from "@/components/bottom-nav";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions, type CameraType } from "expo-camera";
import { useRef, useState } from "react";
import { Alert, Image, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CameraScreen() {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<"off" | "on">("off");
  const [frontFlashActive, setFrontFlashActive] = useState(false);
  const [capturedUri, setCapturedUri] = useState<string>();
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View style={styles.center}><Text style={styles.message}>Preparing camera…</Text></View>;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.title}>Camera access</Text>
        <Text style={styles.message}>Allow camera access to capture a plant photo for your local space.</Text>
        <Pressable style={styles.primaryButton} onPress={requestPermission} accessibilityRole="button">
          <Text style={styles.primaryButtonText}>Allow camera</Text>
        </Pressable>
        <BottomNav />
      </SafeAreaView>
    );
  }

  const capture = async () => {
    const useFrontFlash = facing === "front" && flash === "on";
    try {
      if (useFrontFlash) {
        setFrontFlashActive(true);
        await new Promise((resolve) => setTimeout(resolve, 140));
      }
      const photo = await cameraRef.current?.takePictureAsync({ quality: 0.85 });
      if (photo?.uri) setCapturedUri(photo.uri);
    } catch {
      Alert.alert("Capture unavailable", "The camera could not capture an image. Please try again.");
    } finally {
      if (useFrontFlash) setFrontFlashActive(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]} pointerEvents="none">
        <Text style={styles.title}>Camera</Text>
        <Text style={styles.subtitle}>{capturedUri ? "Photo ready for a future AI connection" : "Capture a plant photo"}</Text>
      </View>
      <View style={styles.preview}>
        {capturedUri ? (
          <Image source={{ uri: capturedUri }} style={styles.previewImage} />
        ) : (
          <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing} flash={flash} animateShutter />
        )}
      </View>
      {frontFlashActive && <View pointerEvents="none" style={styles.frontFlash} />}
      {!capturedUri && (
        <Pressable
          style={styles.flashButton}
          onPress={() => setFlash((current) => current === "off" ? "on" : "off")}
          accessibilityRole="button"
          accessibilityLabel={flash === "off" ? "Turn flash on" : "Turn flash off"}
        >
          <Ionicons name={flash === "off" ? "flash-off-outline" : "flash-outline"} size={24} color="#FFF" />
        </Pressable>
      )}
      <Text style={[styles.helper, { bottom: insets.bottom + 154 }]}>
        {capturedUri ? "This image is stored locally only. AI analysis is not connected yet." : "Center one leaf inside the frame."}
      </Text>
      <View style={[styles.controls, { bottom: insets.bottom + 85 }]}>
        {capturedUri ? (
          <Pressable style={styles.primaryButton} onPress={() => setCapturedUri(undefined)} accessibilityRole="button">
            <Text style={styles.primaryButtonText}>Retake photo</Text>
          </Pressable>
        ) : (
          <>
            <Pressable style={styles.shutter} onPress={capture} accessibilityRole="button" accessibilityLabel="Capture plant photo">
              <View style={styles.shutterInner} />
            </Pressable>
            <Pressable style={styles.flipButton} onPress={() => setFacing((current) => current === "back" ? "front" : "back")} accessibilityRole="button" accessibilityLabel="Flip camera">
              <Ionicons name="camera-reverse-outline" size={24} color="#FFF" />
            </Pressable>
          </>
        )}
      </View>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: { position: "absolute", top: 0, left: 22, right: 22, zIndex: 2 },
  title: { color: "#FFF", fontSize: 28, fontWeight: "800" },
  subtitle: { color: "#E0E7E1", fontSize: 14, marginTop: 4 },
  preview: { ...StyleSheet.absoluteFill, backgroundColor: "#1A241D" },
  previewImage: { width: "100%", height: "100%", resizeMode: "cover" },
  helper: { position: "absolute", left: 24, right: 24, color: "#FFF", textAlign: "center", fontSize: 13, lineHeight: 19, paddingHorizontal: 16, zIndex: 2 },
  controls: { position: "absolute", left: 0, right: 0, bottom: 0, minHeight: 88, alignItems: "center", justifyContent: "center", zIndex: 2 },
  shutter: { width: 70, height: 70, borderRadius: 35, borderWidth: 5, borderColor: "#25B853", alignItems: "center", justifyContent: "center" },
  shutterInner: { width: 54, height: 54, borderRadius: 27, backgroundColor: "#25B853" },
  iconButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#0008", alignItems: "center", justifyContent: "center" },
  flipButton: { position: "absolute", left: "50%", marginLeft: 48, width: 48, height: 48, borderRadius: 24, backgroundColor: "#0008", alignItems: "center", justifyContent: "center" },
  flashButton: { position: "absolute", right: 24, top: "50%", marginTop: -24, width: 48, height: 48, borderRadius: 24, backgroundColor: "#0008", alignItems: "center", justifyContent: "center", zIndex: 3 },
  frontFlash: { ...StyleSheet.absoluteFill, backgroundColor: "#FFF", opacity: 0.92, zIndex: 4 },
  primaryButton: { backgroundColor: "#25B853", borderRadius: 25, paddingHorizontal: 26, paddingVertical: 14 },
  primaryButtonText: { color: "#FFF", fontWeight: "800" },
  center: { flex: 1, backgroundColor: "#FFF", alignItems: "center", justifyContent: "center", padding: 24 },
  message: { color: "#68716B", textAlign: "center", lineHeight: 21, marginTop: 8 },
});
