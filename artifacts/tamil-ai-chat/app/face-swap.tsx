import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  NativeModules,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type FaceSwapBridge = {
  openFaceSwap: () => Promise<boolean>;
};

export default function FaceSwapRoute() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    if (Platform.OS !== "android") {
      setError("The on-device Face Swap screen is available in the Android app.");
      return () => {
        mounted = false;
      };
    }

    const bridge = NativeModules.FaceSwapStudio as FaceSwapBridge | undefined;
    if (!bridge || typeof bridge.openFaceSwap !== "function") {
      setError("The native Face Swap module is not available in this build.");
      return () => {
        mounted = false;
      };
    }

    bridge
      .openFaceSwap()
      .then(() => {
        if (mounted) router.back();
      })
      .catch(() => {
        if (mounted) setError("Could not open the on-device Face Swap screen.");
      });

    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {error ? (
        <>
          <Text style={styles.title}>Face Swap could not open</Text>
          <Text style={styles.message}>{error}</Text>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => router.back()}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Back to My Dream Women</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <ActivityIndicator color="#00d5e8" size="large" />
          <Text style={styles.message}>Opening on-device Face Swap…</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#080b12",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    color: "#c3cedb",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 14,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#00b8ca",
    borderRadius: 12,
    marginTop: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  buttonText: {
    color: "#00161a",
    fontSize: 14,
    fontWeight: "700",
  },
});
