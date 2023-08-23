import React from 'react';
import supabase from "../../utils/supabase";

import { useState } from 'react';
import { useEffect } from 'react';
import { formatNumber } from '../../helper';
import { Text, View, StyleSheet } from 'react-native';

type HeaderProps = {
  offset: number;
}

export default function Header({ offset }: HeaderProps) {
  const [count, setCount] = useState(0);

  async function subscribeStatistics() {
    supabase
    .channel('schema-db-changes')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        table: 'statistics',
        schema: 'public'
      },
      (payload) => {
        setCount(payload.new.uwuified_sentence - offset);
      }
    )
    .subscribe()
  }

  async function LoadStatistics() {
    const { data } = await supabase
      .from('statistics')
      .select('uwuified_sentence')
      .single();

    setCount(data?.uwuified_sentence);
  }

  useEffect(() => {
    LoadStatistics();
    subscribeStatistics();
  }, []);

  return (
    <View style={styles.header}>
      <Text style={styles.header__emoji}>🥺👉👈</Text>
      
      <Text style={styles.header__title}>
        This month we've 
        <Text style={styles.header__title__bold}> uwuified </Text> 
        over <Text>{formatNumber(count + offset)}</Text> sentences!
      </Text>

      <Text style={styles.header__subtitle}>
        And you're the one to blame for that!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 16,
  },
  header__emoji: {
    fontSize: 32,
  },
  header__title: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "400",
  },
  header__title__bold: {
    fontWeight: "700",
  },
  header__subtitle: {
    color: "#ffffff",
    opacity: 0.5,
    fontSize: 24,
    fontWeight: "700",
  },
});
