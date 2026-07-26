import { ReactNode } from "react";
import {
  GestureResponderEvent,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

interface AnimatedPressableProps extends Omit<PressableProps, "style" | "children"> {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Scale applied while pressed. Defaults to 0.95. */
  activeScale?: number;
  onPress: () => void;
}

export default function AnimatedPressable({
  children,
  style,
  activeScale = 0.95,
  onPressIn,
  onPressOut,
  onPress,
  ...props
}: AnimatedPressableProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value) }],
  }));

  function handlePressIn(e: GestureResponderEvent) {
    scale.value = activeScale;
    onPressIn?.(e);
  }

  function handlePressOut(e: GestureResponderEvent) {
    scale.value = 1;
    onPressOut?.(e);
  }

  return (
    <AnimatedPressableBase
      {...props}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, style]}
      onPress={onPress}
    >
      {children}
    </AnimatedPressableBase>
  );
}
