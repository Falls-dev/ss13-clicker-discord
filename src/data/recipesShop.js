import { RESEARCH_RECIPES_I, RESEARCH_RECIPES_II, RESEARCH_RECIPES_III } from "@/data/recipes";

export const SECTIONS = [
	{
		id: "researchRecipes1",
		name: "Research Recipes I: Simple Recipes & Tools",
		purchases: Object.keys(RESEARCH_RECIPES_I)
	},
	{
		id: "researchRecipes2",
		name: "Research Recipes II: Facewear",
		purchases: Object.keys(RESEARCH_RECIPES_II)
	},
	{
		id: "researchRecipes3",
		name: "Research Recipes III: Advanced Recipes",
		purchases: Object.keys(RESEARCH_RECIPES_III)
	},
]

export const PURCHASES = {
	...RESEARCH_RECIPES_I,
	...RESEARCH_RECIPES_II,
	...RESEARCH_RECIPES_III
}