import { BottomNav } from "@/components/bottom-nav";
import { useAppData } from "@/context/app-data";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Search() {
  const router = useRouter();
  const data = useAppData();
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const results = data.plants.filter((plant) => `${plant.name}${plant.species}${plant.space}`.toLowerCase().includes(query.toLowerCase()));
  const refresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 450); };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 100 }]}>
      <Text style={styles.title}>Search</Text>
      <View style={styles.search}>
        <Ionicons name="search" size={20} color="#888" />
        <TextInput value={query} onChangeText={setQuery} placeholder="Search plants or plant type" style={styles.input} />
      </View>
      <Text style={styles.about}>ABOUT PLANTS</Text>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />} contentContainerStyle={styles.results}>
        {results.map((plant) => (
          <Pressable key={plant.id} onPress={() => router.navigate({ pathname: "/plant-profile", params: { id: plant.id } })} style={styles.row}>
            <Ionicons name="leaf" size={28} color="#2F8135" />
            <View><Text style={styles.name}>{plant.name}</Text><Text style={styles.meta}>{plant.species} • {plant.space}</Text></View>
          </Pressable>
        ))}
      </ScrollView>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", paddingHorizontal: 22 },
  title: { fontSize: 25, fontWeight: "700" },
  search: { height: 48, borderWidth: 1, borderColor: "#25B853", borderRadius: 15, marginTop: 25, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 10 },
  input: { flex: 1 },
  about: { color: "#20B64D", fontWeight: "800", fontSize: 12, marginTop: 30 },
  row: { flexDirection: "row", gap: 14, alignItems: "center", paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#EEEEEE" },
  results: { paddingBottom: 110 },
  name: { fontWeight: "700" },
  meta: { color: "#999999", fontSize: 12 },
});
