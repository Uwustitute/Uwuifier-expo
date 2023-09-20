import React from "react";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Header from "./components/Header";
import Editor from "./components/Editor";
import plausible from "./utils/plausible";

import { AppState } from "react-native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { RootSiblingParent } from "react-native-root-siblings";
import { useState, useEffect } from "react";
import { TouchableWithoutFeedback, Keyboard } from "react-native";

import * as StoreReview from "expo-store-review";
import * as Sentry from "sentry-expo";

Sentry.init({
  dsn: "https://acadd9a0860971ccb67c8b0b06552cc6@o4505897577414656.ingest.sentry.io/4505897580888064",
});

export default function App() {
  const [offset, setOffset] = useState(0);
  const [state, setState] = useState(AppState.currentState);
  const [loading, setLoading] = useState(true);
  const [personal, setPersonal] = useState(0);

  useEffect(() => {
    // Offset's can only be generated by writing a sentence so we can increment the personal count
    setPersonal((prevPersonal) => prevPersonal + 1);
    setPersonal(112);

    if (personal == 25) plausible("Uwuified 25 sentences");
    if (personal == 50) plausible("Uwuified 50 sentences");
    if (personal == 100) plausible("Uwuified 100 sentences");
    if (personal == 250) plausible("Uwuified 250 sentences");
    if (personal == 500) plausible("Uwuified 500 sentences");
  }, [offset]);

  useEffect(() => {
    if (loading) {
      return;
    }

    const value = JSON.stringify(personal);

    try {
      AsyncStorage.setItem("personal", value);
    } catch (error) {
      console.error("Error saving personal data:", error);
    }
  }, [personal]);

  async function loadPersonal() {
    try {
      const personalRaw = await AsyncStorage.getItem("personal");
      const personalParsed = personalRaw ? JSON.parse(personalRaw) : 0;

      setPersonal(personalParsed);
      setLoading(false);
    } catch (error) {
      console.error("Error loading personal data:", error);
    }
  }

  async function attemptReview() {
    const shownRaw = await AsyncStorage.getItem("shown");
    const shownParsed = shownRaw ? JSON.parse(shownRaw) : false;

    if (personal < 50 || shownParsed) {
      return;
    }

    // Prevent the popup from showing again
    AsyncStorage.setItem("shown", JSON.stringify(true));

    try {
      console.log("Showing review");
      await StoreReview.requestReview();
    } catch (error) {
      console.error("Error showing review:", error);
    }
  }

  useEffect(() => {
    loadPersonal();

    // Send a generic page view
    plausible();
  }, []);

  useEffect(() => {
    if (loading === false) {
      attemptReview();
    }
  }, [loading]);

  useEffect(() => {
    if (state === "active") {
      attemptReview();
    }
  }, [state]);

  useEffect(() => {
    const listener = AppState.addEventListener("change", (state) =>
      setState(state)
    );

    return () => {
      listener.remove();
    };
  }, []);

  function handleUwuified() {
    setOffset(offset + 1);
  }

  function handleDismiss() {
    Keyboard.dismiss();
  }

  return (
    <RootSiblingParent>
      <StatusBar style="light" />

      <TouchableWithoutFeedback onPress={handleDismiss}>
        <View style={[styles.body, { paddingTop: Constants.statusBarHeight }]}>
          <View style={styles.body__content}>
            <Header offset={offset} personal={personal} />

            <Editor onUwuified={handleUwuified} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </RootSiblingParent>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#303030",
  },
  body__content: {
    gap: 16,
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
});
