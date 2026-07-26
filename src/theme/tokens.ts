export const palette = {
  orange: "#FE8C00",
  orangeTint: "rgba(254, 140, 0, 0.05)",
  ink: "#101010",
  bodyGray: "#6A6A6A",
  labelGray: "#878787",
  cocoa: "#3C2F2F",
  red: "#F14141",
  redTint: "rgba(241, 65, 65, 0.06)",
  green: "#2FA84F",
  greenTint: "rgba(47, 168, 79, 0.08)",
  white: "#FFFFFF",
  black: "#000000",
  almostBlack: "#181C2E",
} as const;

export const colors = {
  primary: palette.orange,
  primarySoft: palette.orangeTint,
  danger: palette.red,
  dangerSoft: palette.redTint,
  success: palette.green,
  successSoft: palette.greenTint,
  rating: palette.orange,

  background: palette.white,
  surface: palette.white,
  surfaceDark: palette.cocoa,

  text: {
    primary: palette.ink,
    secondary: palette.labelGray,
    muted: palette.bodyGray,
    inverse: palette.white,
    accent: palette.orange,
  },
} as const;

export const fontFamily = {
  light: "Quicksand_300Light",
  regular: "Quicksand_400Regular",
  medium: "Quicksand_500Medium",
  semibold: "Quicksand_600SemiBold",
  bold: "Quicksand_700Bold",
  rubik: "Rubik_900Black",
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
} as const;

export const lineHeight = {
  tight: 20,
  body: 27,
} as const;

export const textVariants = {
  h1: { fontFamily: fontFamily.bold, fontSize: fontSize.xl },
  quantity: { fontFamily: fontFamily.bold, fontSize: fontSize.lg },
  sectionTitle: { fontFamily: fontFamily.bold, fontSize: fontSize.md },
  value: { fontFamily: fontFamily.semibold, fontSize: fontSize.md },
  subtitle: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  body: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    lineHeight: lineHeight.body,
    color: colors.text.muted,
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  infoLabel: { fontFamily: fontFamily.semibold, fontSize: fontSize.sm },
  button: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: colors.text.inverse,
  },
  chip: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.xs,
    color: colors.text.inverse,
  },
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 30,
} as const;

export const radius = {
  sm: 8,
  md: 15,
  lg: 20,
  xl: 30,
  full: 9999,
} as const;

export const shadow = {
  soft: {
    shadowColor: palette.black,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 60,
    elevation: 2,
  },
  card: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  raised: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 8,
  },
  bar: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
} as const;

export const tokens = {
  palette,
  colors,
  fontFamily,
  fontSize,
  lineHeight,
  textVariants,
  spacing,
  radius,
  shadow,
} as const;

export type Tokens = typeof tokens;
export type ColorToken = keyof typeof colors;
export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof radius;

export default tokens;
