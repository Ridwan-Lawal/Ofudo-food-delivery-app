const burgerImage = require("@/assets/images/burger-two.png");
const pizzaImage = require("@/assets/images/pizza-one.png");
const burritoImage = require("@/assets/images/buritto.png");

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
