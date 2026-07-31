import type { ImageSourcePropType } from "react-native";

export const burgerImage = require("@/assets/images/burger-two.png");
export const pizzaImage = require("@/assets/images/pizza-one.png");
export const burritoImage = require("@/assets/images/buritto.png");

export const TABS_SCREENS = [
  { name: "index", title: "Home", icon: "home-outline" },
  { name: "search", title: "Search", icon: "search" },
  { name: "cart", title: "Cart", icon: "cart-outline" },
  { name: "profile", title: "Profile", icon: "person-circle-outline" },
] as const;

export const FOOD_CATEGORIES = [
  { name: "burgers", image: burgerImage },
  { name: "pizza", image: pizzaImage },
  { name: "burrito", image: burritoImage },
] as const;

export const placeholderUrl = { blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" } as const;

export const PERKS = [
  {
    icon: "dollar",
    text: "free delivery",
  },
  { icon: "clock-o", text: "20-30 mins" },
  { icon: "star", text: "4.5" },
] as const;

export const CUSTOMIZATION_IMAGES: Record<string, ImageSourcePropType | undefined> = {
  // Toppings
  Avocado: require("@/assets/images/avocado.png"),
  Bacon: require("@/assets/images/bacon.png"),
  "Extra Cheese": require("@/assets/images/cheese.png"),
  Mushrooms: require("@/assets/images/mushrooms.png"),
  Onions: require("@/assets/images/onions.png"),
  Tomatoes: require("@/assets/images/tomatoes.png"),

  // Sides
  Fries: require("@/assets/images/fries.png"),
  // The asset filename is misspelled with a single "z"; the key matches the DB.
  "Mozzarella Sticks": require("@/assets/images/mozarella-sticks.png"),
  Salad: require("@/assets/images/salad.png"),
};
