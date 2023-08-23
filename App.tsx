import React from "react";
import Constants from 'expo-constants';

import Header from "./components/Header";
import Editor from "./components/Editor";

import plausible from "./utils/plausible";

import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { RootSiblingParent } from 'react-native-root-siblings';
import { ScrollView, StyleSheet, View } from "react-native";

export default function App() {
  const [offset, setOffset] = useState(0);

  plausible();

  function handleUwuified() {
    setOffset(offset + 1);
  }

  return (
    <RootSiblingParent>
      <StatusBar style="light" />

      <View style={[styles.body, {paddingTop: Constants.statusBarHeight}]}>
        <ScrollView>
          <View style={styles.body__content}>
            <Header offset={offset} />

            <Editor onUwuified={handleUwuified} />
          </View>
        </ScrollView>
      </View>
    </RootSiblingParent>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: "#303030",
  },
  body__content: {
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
});
