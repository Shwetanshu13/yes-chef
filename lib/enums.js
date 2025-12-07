export const cuisineOptions = [
    "continental",
    "north_indian",
    "south_indian",
    "english",
    "american",
    "chinese",
    "japanese",
    "mediterranean",
    "mexican",
    "thai",
];

export const typeOptions = ["veg", "non_veg", "vegan"];

export const courseOptions = [
    "starter",
    "appetizer",
    "main_course",
    "beverage",
    "dessert",
    "snack",
];

export const nutritionKeys = ["carbs", "fats", "protein", "calories"];

export const recipeDefaults = {
    title: "",
    description: "",
    cuisine: cuisineOptions[0],
    type: typeOptions[0],
    course: courseOptions[0],
    nutrition: { carbs: "", fats: "", protein: "", calories: "" },
    ingredients: [""],
    steps: [""],
    image: "",
    link: "",
};
