import { palette, shadow, textVariants } from "@/theme/tokens";
import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

interface AnimatedPrimaryButtonProps {
  onPress: () => void;
  buttonText: string;
  buttonStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function AnimatedPrimaryButton({
  onPress,
  buttonText,
  buttonStyle,
  disabled,
}: AnimatedPrimaryButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: withSpring(scale.value) }],
    }),
    [scale],
  );

  function handlePressIn() {
    scale.value = 0.95;
  }

  function handlePressOut() {
    scale.value = 1;
  }

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.button, animatedStyle, buttonStyle]}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{buttonText}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    gap: 8,
    alignSelf: "stretch",
    borderRadius: 100,
    backgroundColor: palette.orange,
    width: "100%",
    ...shadow.card,
  },
  buttonText: {
    ...textVariants.button,
    fontSize: 16,
  },
});
