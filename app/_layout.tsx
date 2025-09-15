import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { Text } from 'react-native';
import React from "react";

const oldRender = (Text as any).render;
(Text as any).render = function (...args: any[]) {
  const origin = oldRender.call(this, ...args);
  return React.cloneElement(origin, {
    style: [{ fontFamily: 'FilsonProRegular' }, origin.props.style],
  });
};


export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    FilsonProLight: require('../assets/fonts/FilsonProLight.otf'),
    FilsonProRegular: require('../assets/fonts/FilsonProRegular.otf'),
  });
  useFrameworkReady();
  if (!fontsLoaded) {
    return null;
  }
  // @ts-ignore
  Text.defaultProps = Text.defaultProps || {};
  // @ts-ignore
  Text.defaultProps.style = { fontFamily: 'FilsonProLight' };

  return (
    <AuthProvider>
    <View style={{ flex: 1 }}>
    <LinearGradient
      colors={['#FFF3E5', '#FFE1C5']}
      start={{ x: 0.95, y: 0.37 }}
      end={{ x: 0.1, y: 1 }}
      style={StyleSheet.absoluteFillObject} // 🔑 makes it background
    />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
      </View>
    </AuthProvider>
  );
}


