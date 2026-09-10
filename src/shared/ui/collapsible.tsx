import { useState, type ReactNode } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "@/shared/theme";

type CollapsibleProps = {
  title: string;
  children: ReactNode;
};

export function Collapsible({ title, children }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const height = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    overflow: "hidden",
  }));

  const toggle = () => {
    setIsOpen(!isOpen);
    height.value = isOpen ? withTiming(0) : withTiming(200); // eslint-disable-line react-hooks/immutability
  };

  return (
    <View className="border border-[#e0e0e0] rounded-lg overflow-hidden">
      <Pressable
        onPress={toggle}
        className="flex-row justify-between items-center p-4"
      >
        <Text className="text-base font-semibold" style={{ color: theme.text }}>
          {title}
        </Text>
        <Text className="text-xs" style={{ color: theme.text }}>
          {isOpen ? "▼" : "▶"}
        </Text>
      </Pressable>
      {isOpen && (
        <Animated.View style={animatedStyle}>
          <View className="p-4 pt-0">{children}</View>
        </Animated.View>
      )}
    </View>
  );
}
