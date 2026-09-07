import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedIcon, HintRow, ThemedText, ThemedView, WebBadge } from '@/shared/ui';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/shared/theme';

function getDevMenuHint() {
  if (Platform.OS === 'web') {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === 'android' ? 'cmd+m (or ctrl+m)' : 'cmd+d';
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

export default function HomeScreen() {
  return (
    <ThemedView className="flex-1 justify-center flex-row">
      <SafeAreaView
        className="flex-1 items-center gap-4"
        style={{
          paddingHorizontal: Spacing.four,
          paddingBottom: BottomTabInset + Spacing.three,
          maxWidth: MaxContentWidth,
        }}
      >
        <ThemedView className="items-center justify-center flex-1 px-6 gap-6">
          <AnimatedIcon />
          <ThemedText type="title" className="text-center">
            Welcome to&nbsp;Expo
          </ThemedText>
        </ThemedView>

        <ThemedText type="code" className="uppercase">
          get started
        </ThemedText>

        <ThemedView
          type="backgroundElement"
          className="gap-4 self-stretch px-4 py-6 rounded-2xl"
        >
          <HintRow
            title="Try editing"
            hint={<ThemedText type="code">src/app/index.tsx</ThemedText>}
          />
          <HintRow title="Dev tools" hint={getDevMenuHint()} />
          <HintRow
            title="Fresh start"
            hint={<ThemedText type="code">npm run reset-project</ThemedText>}
          />
        </ThemedView>

        {Platform.OS === 'web' && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
  );
}
