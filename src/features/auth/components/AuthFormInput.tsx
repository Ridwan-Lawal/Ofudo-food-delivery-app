import { fontFamily, palette, textVariants } from "@/theme/tokens";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

interface AuthFormInputProps extends TextInputProps {
  label: string;
  error?: string;
  children?: React.ReactNode;
}

export default function AuthFormInput({ error, label, children, ...props }: AuthFormInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} underlineColorAndroid="transparent" {...props} />
        {children}
      </View>
      {error && <Text style={styles.errorMessage}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },

  label: {
    ...textVariants.subtitle,
  },

  input: {
    paddingBottom: 4,
    color: palette.black,
    fontFamily: fontFamily.semibold,
    fontSize: 18,
    alignSelf: "stretch",
    paddingVertical: 10,
    paddingHorizontal: 8,
    includeFontPadding: false,
    paddingTop: 0,
    paddingLeft: 0,
    flex: 1,
  },

  errorMessage: {
    fontFamily: fontFamily.semibold,
    textAlign: "right",
    color: palette.red,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1.5,
    borderBottomColor: "#cbcbcb",
  },
});
