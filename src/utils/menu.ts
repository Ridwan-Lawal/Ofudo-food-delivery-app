export function getEmptyCopy(q?: string, category?: string) {
  if (q) {
    return { title: `No results for "${q}"`, message: "Try a different search term." };
  }
  if (category && category !== "all") {
    return { title: "Nothing here yet", message: "There are no meals in this category." };
  }
  return { title: "Menu is empty", message: "New meals are on the way — check back soon." };
}
