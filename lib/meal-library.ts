import type { FoodItem } from "./mock-data";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";
export type MealCategory = "loss" | "gain" | "maintain" | "all";

export interface LibraryMeal {
  id: string;
  name: string;
  time: string;
  mealType: MealType;
  category: MealCategory;
  foods: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

function makeMeal(
  id: string,
  name: string,
  time: string,
  mealType: MealType,
  category: MealCategory,
  foods: Omit<FoodItem, "id">[]
): LibraryMeal {
  const withIds = foods.map((f, i) => ({ ...f, id: `${id}f${i + 1}` }));
  return {
    id,
    name,
    time,
    mealType,
    category,
    foods: withIds,
    totalCalories: withIds.reduce((a, f) => a + f.calories, 0),
    totalProtein: withIds.reduce((a, f) => a + f.protein, 0),
    totalCarbs: withIds.reduce((a, f) => a + f.carbs, 0),
    totalFat: withIds.reduce((a, f) => a + f.fat, 0),
  };
}

// ── Breakfasts (12) ───────────────────────────────────────────────────────────

const breakfasts: LibraryMeal[] = [
  makeMeal("b1", "Omelete Proteico", "07:00", "breakfast", "gain", [
    { name: "Ovos inteiros", quantity: "3 un", calories: 210, protein: 18, carbs: 2, fat: 15 },
    { name: "Queijo cottage", quantity: "100g", calories: 98, protein: 11, carbs: 4, fat: 4 },
    { name: "Espinafre", quantity: "50g", calories: 12, protein: 1, carbs: 2, fat: 0 },
    { name: "Pão integral", quantity: "2 fatias", calories: 140, protein: 6, carbs: 26, fat: 2 },
  ]),
  makeMeal("b2", "Vitamina Fitness", "07:30", "breakfast", "gain", [
    { name: "Whey Protein", quantity: "1 scoop", calories: 130, protein: 25, carbs: 5, fat: 2 },
    { name: "Banana", quantity: "1 un", calories: 90, protein: 1, carbs: 23, fat: 0 },
    { name: "Aveia", quantity: "40g", calories: 152, protein: 5, carbs: 27, fat: 3 },
    { name: "Leite desnatado", quantity: "200ml", calories: 70, protein: 7, carbs: 10, fat: 0 },
  ]),
  makeMeal("b3", "Tapioca com Frango", "07:00", "breakfast", "maintain", [
    { name: "Tapioca", quantity: "2 un (70g)", calories: 186, protein: 0, carbs: 46, fat: 0 },
    { name: "Frango desfiado", quantity: "80g", calories: 133, protein: 25, carbs: 0, fat: 3 },
    { name: "Requeijão light", quantity: "30g", calories: 60, protein: 2, carbs: 3, fat: 4 },
    { name: "Suco de laranja", quantity: "200ml", calories: 88, protein: 1, carbs: 21, fat: 0 },
  ]),
  makeMeal("b4", "Café Leve", "07:30", "breakfast", "loss", [
    { name: "Iogurte grego 0%", quantity: "150g", calories: 90, protein: 15, carbs: 6, fat: 0 },
    { name: "Morango", quantity: "100g", calories: 32, protein: 1, carbs: 7, fat: 0 },
    { name: "Granola light", quantity: "20g", calories: 80, protein: 2, carbs: 14, fat: 2 },
    { name: "Café sem açúcar", quantity: "200ml", calories: 5, protein: 0, carbs: 1, fat: 0 },
  ]),
  makeMeal("b5", "Panqueca de Aveia", "08:00", "breakfast", "gain", [
    { name: "Aveia em flocos", quantity: "60g", calories: 228, protein: 7, carbs: 41, fat: 4 },
    { name: "Ovos", quantity: "2 un", calories: 140, protein: 12, carbs: 1, fat: 10 },
    { name: "Banana madura", quantity: "1 un", calories: 90, protein: 1, carbs: 23, fat: 0 },
    { name: "Mel", quantity: "1 col", calories: 64, protein: 0, carbs: 17, fat: 0 },
  ]),
  makeMeal("b6", "Overnight Oats", "07:00", "breakfast", "maintain", [
    { name: "Aveia", quantity: "50g", calories: 190, protein: 6, carbs: 34, fat: 3 },
    { name: "Leite desnatado", quantity: "150ml", calories: 52, protein: 5, carbs: 7, fat: 0 },
    { name: "Chia", quantity: "15g", calories: 73, protein: 2, carbs: 5, fat: 5 },
    { name: "Maçã", quantity: "1 un média", calories: 72, protein: 0, carbs: 19, fat: 0 },
  ]),
  makeMeal("b7", "Bowl de Açaí Fit", "08:00", "breakfast", "loss", [
    { name: "Açaí sem adição de açúcar", quantity: "100g", calories: 130, protein: 2, carbs: 6, fat: 11 },
    { name: "Banana", quantity: "1 un", calories: 90, protein: 1, carbs: 23, fat: 0 },
    { name: "Granola light", quantity: "20g", calories: 80, protein: 2, carbs: 14, fat: 2 },
    { name: "Morangos", quantity: "50g", calories: 16, protein: 0, carbs: 4, fat: 0 },
  ]),
  makeMeal("b8", "Torrada com Ovo", "07:30", "breakfast", "loss", [
    { name: "Pão integral", quantity: "2 fatias", calories: 140, protein: 6, carbs: 26, fat: 2 },
    { name: "Ovo mexido (sem manteiga)", quantity: "2 un", calories: 140, protein: 12, carbs: 1, fat: 10 },
    { name: "Tomate", quantity: "1 un médio", calories: 22, protein: 1, carbs: 5, fat: 0 },
    { name: "Café preto", quantity: "200ml", calories: 5, protein: 0, carbs: 1, fat: 0 },
  ]),
  makeMeal("b9", "Iogurte Proteico", "07:00", "breakfast", "gain", [
    { name: "Iogurte grego integral", quantity: "200g", calories: 190, protein: 20, carbs: 8, fat: 8 },
    { name: "Whey Protein", quantity: "1 scoop", calories: 130, protein: 25, carbs: 5, fat: 2 },
    { name: "Banana", quantity: "1 un", calories: 90, protein: 1, carbs: 23, fat: 0 },
    { name: "Amendoim", quantity: "20g", calories: 116, protein: 5, carbs: 4, fat: 10 },
  ]),
  makeMeal("b10", "Mingau de Aveia", "07:30", "breakfast", "maintain", [
    { name: "Aveia", quantity: "60g", calories: 228, protein: 7, carbs: 41, fat: 4 },
    { name: "Leite semidesnatado", quantity: "200ml", calories: 100, protein: 7, carbs: 10, fat: 3 },
    { name: "Maçã picada", quantity: "1 un", calories: 72, protein: 0, carbs: 19, fat: 0 },
    { name: "Canela", quantity: "1 pitada", calories: 3, protein: 0, carbs: 1, fat: 0 },
  ]),
  makeMeal("b11", "Wrap Proteico", "08:00", "breakfast", "gain", [
    { name: "Tortilha integral", quantity: "1 un", calories: 120, protein: 4, carbs: 22, fat: 2 },
    { name: "Claras de ovo", quantity: "4 un", calories: 68, protein: 14, carbs: 0, fat: 0 },
    { name: "Queijo cottage", quantity: "60g", calories: 59, protein: 7, carbs: 2, fat: 2 },
    { name: "Espinafre fresco", quantity: "30g", calories: 7, protein: 1, carbs: 1, fat: 0 },
    { name: "Abacate", quantity: "30g", calories: 48, protein: 1, carbs: 2, fat: 4 },
  ]),
  makeMeal("b12", "Smoothie Verde", "07:00", "breakfast", "loss", [
    { name: "Espinafre", quantity: "30g", calories: 7, protein: 1, carbs: 1, fat: 0 },
    { name: "Maçã verde", quantity: "1 un", calories: 72, protein: 0, carbs: 19, fat: 0 },
    { name: "Pepino", quantity: "100g", calories: 16, protein: 1, carbs: 3, fat: 0 },
    { name: "Whey Protein Vanilla", quantity: "1 scoop", calories: 130, protein: 25, carbs: 5, fat: 2 },
    { name: "Água de coco", quantity: "200ml", calories: 38, protein: 0, carbs: 9, fat: 0 },
  ]),
];

// ── Lunches (12) ──────────────────────────────────────────────────────────────

const lunches: LibraryMeal[] = [
  makeMeal("l1", "Frango, Arroz e Salada", "12:00", "lunch", "maintain", [
    { name: "Frango grelhado", quantity: "200g", calories: 330, protein: 62, carbs: 0, fat: 7 },
    { name: "Arroz integral", quantity: "150g", calories: 195, protein: 4, carbs: 40, fat: 1 },
    { name: "Feijão preto", quantity: "100g", calories: 77, protein: 5, carbs: 14, fat: 1 },
    { name: "Brócolis", quantity: "100g", calories: 34, protein: 3, carbs: 7, fat: 0 },
  ]),
  makeMeal("l2", "Atum com Batata Doce", "12:30", "lunch", "gain", [
    { name: "Atum em lata (água)", quantity: "2 latas (240g)", calories: 236, protein: 52, carbs: 0, fat: 2 },
    { name: "Batata doce assada", quantity: "200g", calories: 172, protein: 4, carbs: 40, fat: 0 },
    { name: "Salada verde", quantity: "100g", calories: 20, protein: 1, carbs: 3, fat: 0 },
    { name: "Azeite de oliva", quantity: "1 col", calories: 90, protein: 0, carbs: 0, fat: 10 },
  ]),
  makeMeal("l3", "Prato Magro", "12:00", "lunch", "loss", [
    { name: "Tilápia grelhada", quantity: "200g", calories: 220, protein: 44, carbs: 0, fat: 4 },
    { name: "Legumes no vapor", quantity: "200g", calories: 80, protein: 4, carbs: 15, fat: 0 },
    { name: "Arroz integral", quantity: "80g cozido", calories: 104, protein: 2, carbs: 22, fat: 1 },
    { name: "Salada verde", quantity: "100g", calories: 20, protein: 1, carbs: 3, fat: 0 },
  ]),
  makeMeal("l4", "Bowl de Proteína", "12:00", "lunch", "gain", [
    { name: "Frango desfiado", quantity: "200g", calories: 330, protein: 62, carbs: 0, fat: 7 },
    { name: "Quinoa cozida", quantity: "150g", calories: 180, protein: 7, carbs: 32, fat: 3 },
    { name: "Grão-de-bico", quantity: "100g", calories: 164, protein: 9, carbs: 27, fat: 3 },
    { name: "Azeite + limão", quantity: "1 col", calories: 90, protein: 0, carbs: 1, fat: 10 },
  ]),
  makeMeal("l5", "Salada Completa", "12:00", "lunch", "loss", [
    { name: "Frango grelhado", quantity: "150g", calories: 248, protein: 47, carbs: 0, fat: 5 },
    { name: "Mix de folhas", quantity: "100g", calories: 20, protein: 2, carbs: 3, fat: 0 },
    { name: "Tomate cereja", quantity: "100g", calories: 18, protein: 1, carbs: 4, fat: 0 },
    { name: "Pepino", quantity: "100g", calories: 16, protein: 1, carbs: 3, fat: 0 },
    { name: "Azeite + vinagre", quantity: "1 col", calories: 90, protein: 0, carbs: 1, fat: 10 },
  ]),
  makeMeal("l6", "Macarrão Integral", "12:30", "lunch", "maintain", [
    { name: "Macarrão integral", quantity: "100g seco", calories: 356, protein: 12, carbs: 71, fat: 2 },
    { name: "Frango moído", quantity: "150g", calories: 248, protein: 47, carbs: 0, fat: 5 },
    { name: "Molho de tomate caseiro", quantity: "100g", calories: 35, protein: 2, carbs: 7, fat: 0 },
    { name: "Queijo parmesão", quantity: "10g", calories: 39, protein: 4, carbs: 0, fat: 3 },
  ]),
  makeMeal("l7", "Carne Magra + Purê", "12:00", "lunch", "gain", [
    { name: "Contrafilé grelhado", quantity: "200g", calories: 400, protein: 46, carbs: 0, fat: 22 },
    { name: "Purê de batata doce", quantity: "200g", calories: 172, protein: 4, carbs: 40, fat: 0 },
    { name: "Aspargos", quantity: "100g", calories: 20, protein: 2, carbs: 4, fat: 0 },
  ]),
  makeMeal("l8", "Wrap Light", "12:00", "lunch", "loss", [
    { name: "Tortilha integral", quantity: "1 un", calories: 120, protein: 4, carbs: 22, fat: 2 },
    { name: "Atum em água", quantity: "1 lata", calories: 118, protein: 26, carbs: 0, fat: 1 },
    { name: "Alface", quantity: "30g", calories: 5, protein: 0, carbs: 1, fat: 0 },
    { name: "Tomate", quantity: "50g", calories: 9, protein: 0, carbs: 2, fat: 0 },
    { name: "Iogurte (molho)", quantity: "30g", calories: 18, protein: 2, carbs: 2, fat: 0 },
  ]),
  makeMeal("l9", "Salmão ao Molho", "12:30", "lunch", "maintain", [
    { name: "Salmão grelhado", quantity: "180g", calories: 350, protein: 36, carbs: 0, fat: 22 },
    { name: "Arroz branco", quantity: "120g cozido", calories: 156, protein: 3, carbs: 34, fat: 0 },
    { name: "Brócolis", quantity: "100g", calories: 34, protein: 3, carbs: 7, fat: 0 },
  ]),
  makeMeal("l10", "PF Fit", "12:00", "lunch", "maintain", [
    { name: "Frango grelhado", quantity: "180g", calories: 297, protein: 56, carbs: 0, fat: 6 },
    { name: "Arroz integral", quantity: "120g cozido", calories: 156, protein: 3, carbs: 34, fat: 1 },
    { name: "Feijão", quantity: "80g cozido", calories: 62, protein: 4, carbs: 11, fat: 1 },
    { name: "Salada de tomate e pepino", quantity: "150g", calories: 30, protein: 1, carbs: 6, fat: 0 },
  ]),
  makeMeal("l11", "Strogonoff Light", "12:30", "lunch", "maintain", [
    { name: "Frango em cubos", quantity: "200g", calories: 330, protein: 62, carbs: 0, fat: 7 },
    { name: "Creme de leite light", quantity: "50g", calories: 65, protein: 2, carbs: 5, fat: 4 },
    { name: "Arroz integral", quantity: "120g", calories: 156, protein: 3, carbs: 34, fat: 1 },
    { name: "Champignon", quantity: "50g", calories: 12, protein: 1, carbs: 2, fat: 0 },
  ]),
  makeMeal("l12", "Marmita Hipertrofia", "12:00", "lunch", "gain", [
    { name: "Frango grelhado", quantity: "250g", calories: 413, protein: 78, carbs: 0, fat: 9 },
    { name: "Arroz integral", quantity: "200g cozido", calories: 260, protein: 5, carbs: 56, fat: 2 },
    { name: "Feijão preto", quantity: "150g", calories: 116, protein: 8, carbs: 21, fat: 1 },
    { name: "Ovo cozido", quantity: "1 un", calories: 70, protein: 6, carbs: 0, fat: 5 },
  ]),
];

// ── Dinners (12) ──────────────────────────────────────────────────────────────

const dinners: LibraryMeal[] = [
  makeMeal("d1", "Salmão com Legumes", "20:00", "dinner", "maintain", [
    { name: "Salmão assado", quantity: "180g", calories: 350, protein: 36, carbs: 0, fat: 22 },
    { name: "Aspargos grelhados", quantity: "100g", calories: 20, protein: 2, carbs: 4, fat: 0 },
    { name: "Cenoura assada", quantity: "100g", calories: 41, protein: 1, carbs: 10, fat: 0 },
    { name: "Azeite de oliva", quantity: "1 col", calories: 90, protein: 0, carbs: 0, fat: 10 },
  ]),
  makeMeal("d2", "Frango ao Forno Leve", "19:30", "dinner", "loss", [
    { name: "Peito de frango assado", quantity: "200g", calories: 330, protein: 62, carbs: 0, fat: 7 },
    { name: "Abobrinha grelhada", quantity: "150g", calories: 26, protein: 2, carbs: 5, fat: 0 },
    { name: "Salada de folhas", quantity: "100g", calories: 20, protein: 2, carbs: 3, fat: 0 },
  ]),
  makeMeal("d3", "Omelete Noturno", "20:00", "dinner", "loss", [
    { name: "Claras de ovo", quantity: "5 un", calories: 85, protein: 18, carbs: 0, fat: 0 },
    { name: "Queijo cottage", quantity: "80g", calories: 78, protein: 9, carbs: 3, fat: 3 },
    { name: "Espinafre", quantity: "50g", calories: 12, protein: 1, carbs: 2, fat: 0 },
    { name: "Tomate", quantity: "1 un", calories: 22, protein: 1, carbs: 5, fat: 0 },
  ]),
  makeMeal("d4", "Carne com Batata Doce", "20:30", "dinner", "gain", [
    { name: "Patinho moído grelhado", quantity: "200g", calories: 290, protein: 44, carbs: 0, fat: 11 },
    { name: "Batata doce cozida", quantity: "200g", calories: 172, protein: 4, carbs: 40, fat: 0 },
    { name: "Brócolis no vapor", quantity: "100g", calories: 34, protein: 3, carbs: 7, fat: 0 },
  ]),
  makeMeal("d5", "Sopa Proteica", "19:30", "dinner", "loss", [
    { name: "Caldo de legumes", quantity: "300ml", calories: 30, protein: 1, carbs: 6, fat: 0 },
    { name: "Frango desfiado", quantity: "100g", calories: 165, protein: 31, carbs: 0, fat: 4 },
    { name: "Legumes variados", quantity: "200g", calories: 80, protein: 4, carbs: 15, fat: 0 },
    { name: "Grão-de-bico", quantity: "60g cozido", calories: 98, protein: 5, carbs: 16, fat: 2 },
  ]),
  makeMeal("d6", "Tilápia Grelhada", "20:00", "dinner", "maintain", [
    { name: "Tilápia grelhada", quantity: "200g", calories: 220, protein: 44, carbs: 0, fat: 4 },
    { name: "Purê de couve-flor", quantity: "150g", calories: 45, protein: 3, carbs: 9, fat: 0 },
    { name: "Salada verde", quantity: "100g", calories: 20, protein: 2, carbs: 3, fat: 0 },
    { name: "Azeite de oliva", quantity: "1 col", calories: 90, protein: 0, carbs: 0, fat: 10 },
  ]),
  makeMeal("d7", "Frango ao Curry", "20:00", "dinner", "maintain", [
    { name: "Frango em cubos", quantity: "200g", calories: 330, protein: 62, carbs: 0, fat: 7 },
    { name: "Leite de coco light", quantity: "100ml", calories: 80, protein: 1, carbs: 6, fat: 6 },
    { name: "Arroz basmati", quantity: "100g cozido", calories: 130, protein: 3, carbs: 28, fat: 0 },
    { name: "Espinafre", quantity: "50g", calories: 12, protein: 1, carbs: 2, fat: 0 },
  ]),
  makeMeal("d8", "Bacalhau com Grão-de-bico", "20:30", "dinner", "maintain", [
    { name: "Bacalhau desfiado", quantity: "150g", calories: 195, protein: 42, carbs: 0, fat: 1 },
    { name: "Grão-de-bico cozido", quantity: "120g", calories: 197, protein: 11, carbs: 33, fat: 3 },
    { name: "Tomate", quantity: "100g", calories: 18, protein: 1, carbs: 4, fat: 0 },
    { name: "Azeite + alho", quantity: "1 col", calories: 90, protein: 0, carbs: 1, fat: 10 },
  ]),
  makeMeal("d9", "Bowl de Atum", "19:30", "dinner", "loss", [
    { name: "Atum em água", quantity: "2 latas", calories: 236, protein: 52, carbs: 0, fat: 2 },
    { name: "Abacate", quantity: "60g", calories: 96, protein: 1, carbs: 5, fat: 9 },
    { name: "Tomate cereja", quantity: "100g", calories: 18, protein: 1, carbs: 4, fat: 0 },
    { name: "Mix de folhas", quantity: "80g", calories: 16, protein: 2, carbs: 2, fat: 0 },
  ]),
  makeMeal("d10", "Proteína + Legumes Assados", "20:00", "dinner", "loss", [
    { name: "Peito de frango", quantity: "200g", calories: 330, protein: 62, carbs: 0, fat: 7 },
    { name: "Abobrinha", quantity: "100g", calories: 17, protein: 1, carbs: 3, fat: 0 },
    { name: "Berinjela", quantity: "100g", calories: 25, protein: 1, carbs: 6, fat: 0 },
    { name: "Pimentão", quantity: "100g", calories: 20, protein: 1, carbs: 5, fat: 0 },
    { name: "Azeite de oliva", quantity: "1 col", calories: 90, protein: 0, carbs: 0, fat: 10 },
  ]),
  makeMeal("d11", "Ovos Cozidos com Salada", "19:30", "dinner", "loss", [
    { name: "Ovos cozidos", quantity: "3 un", calories: 210, protein: 18, carbs: 2, fat: 15 },
    { name: "Salada caprese", quantity: "150g", calories: 75, protein: 5, carbs: 4, fat: 5 },
    { name: "Folhas variadas", quantity: "100g", calories: 20, protein: 2, carbs: 3, fat: 0 },
    { name: "Azeite + limão", quantity: "1 col", calories: 90, protein: 0, carbs: 1, fat: 10 },
  ]),
  makeMeal("d12", "Massa de Ganho", "20:30", "dinner", "gain", [
    { name: "Macarrão integral", quantity: "120g seco", calories: 427, protein: 15, carbs: 85, fat: 2 },
    { name: "Carne moída magra", quantity: "200g", calories: 290, protein: 44, carbs: 0, fat: 11 },
    { name: "Molho de tomate", quantity: "100g", calories: 35, protein: 2, carbs: 7, fat: 0 },
    { name: "Queijo parmesão", quantity: "15g", calories: 58, protein: 5, carbs: 0, fat: 4 },
  ]),
];

// ── Snacks (8) ────────────────────────────────────────────────────────────────

const snacks: LibraryMeal[] = [
  makeMeal("s1", "Whey + Banana", "16:00", "snack", "gain", [
    { name: "Whey Protein", quantity: "1 scoop", calories: 130, protein: 25, carbs: 5, fat: 2 },
    { name: "Banana", quantity: "1 un", calories: 90, protein: 1, carbs: 23, fat: 0 },
  ]),
  makeMeal("s2", "Iogurte Grego com Frutas", "15:30", "snack", "maintain", [
    { name: "Iogurte grego 0%", quantity: "150g", calories: 90, protein: 15, carbs: 6, fat: 0 },
    { name: "Morango", quantity: "100g", calories: 32, protein: 1, carbs: 7, fat: 0 },
  ]),
  makeMeal("s3", "Pasta de Amendoim + Maçã", "10:30", "snack", "maintain", [
    { name: "Maçã", quantity: "1 un", calories: 72, protein: 0, carbs: 19, fat: 0 },
    { name: "Pasta de amendoim", quantity: "30g", calories: 174, protein: 7, carbs: 6, fat: 15 },
  ]),
  makeMeal("s4", "Castanhas Mix", "16:00", "snack", "maintain", [
    { name: "Mix de castanhas", quantity: "30g", calories: 180, protein: 5, carbs: 6, fat: 17 },
    { name: "Uva passa", quantity: "15g", calories: 45, protein: 0, carbs: 12, fat: 0 },
  ]),
  makeMeal("s5", "Batata Doce com Ovo", "15:30", "snack", "gain", [
    { name: "Batata doce assada", quantity: "100g", calories: 86, protein: 2, carbs: 20, fat: 0 },
    { name: "Ovos cozidos", quantity: "2 un", calories: 140, protein: 12, carbs: 1, fat: 10 },
  ]),
  makeMeal("s6", "Shake Leve", "16:00", "snack", "loss", [
    { name: "Whey isolado", quantity: "1 scoop", calories: 110, protein: 27, carbs: 1, fat: 0 },
    { name: "Água de coco", quantity: "200ml", calories: 38, protein: 0, carbs: 9, fat: 0 },
  ]),
  makeMeal("s7", "Cenoura com Húmus", "10:30", "snack", "loss", [
    { name: "Cenoura baby", quantity: "100g", calories: 41, protein: 1, carbs: 10, fat: 0 },
    { name: "Húmus", quantity: "50g", calories: 82, protein: 4, carbs: 9, fat: 4 },
  ]),
  makeMeal("s8", "Ovo Mexido + Torrada", "10:00", "snack", "maintain", [
    { name: "Ovo mexido", quantity: "2 un", calories: 140, protein: 12, carbs: 1, fat: 10 },
    { name: "Pão integral", quantity: "1 fatia", calories: 70, protein: 3, carbs: 13, fat: 1 },
  ]),
];

// ── Combined library & helpers ─────────────────────────────────────────────────

export const mealLibrary: LibraryMeal[] = [
  ...breakfasts,
  ...lunches,
  ...dinners,
  ...snacks,
];

export function getMealsByType(type: MealType): LibraryMeal[] {
  return mealLibrary.filter((m) => m.mealType === type);
}

export function getRecommendedMeals(
  goal: MealCategory,
  type: MealType,
  limit = 3
): LibraryMeal[] {
  const exact = mealLibrary.filter(
    (m) => m.mealType === type && (m.category === goal || m.category === "all")
  );
  if (exact.length >= limit) return exact.slice(0, limit);
  const rest = mealLibrary
    .filter((m) => m.mealType === type && m.category !== goal)
    .slice(0, limit - exact.length);
  return [...exact, ...rest];
}

export function getDayMealPlan(goal: MealCategory): {
  breakfast: LibraryMeal;
  lunch: LibraryMeal;
  dinner: LibraryMeal;
  snack: LibraryMeal;
} {
  const pick = (type: MealType) => getRecommendedMeals(goal, type, 1)[0];
  return {
    breakfast: pick("breakfast"),
    lunch: pick("lunch"),
    dinner: pick("dinner"),
    snack: pick("snack"),
  };
}
