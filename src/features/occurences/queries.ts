import { fetchOccurrences } from "@/shared/api/occurrences";
import { fetchCategories } from "@/shared/api/categories";

export const occurrencesQueries = {
  occurrences: () => ({
    queryKey: ["occurrences", "occurrences"],
    queryFn: fetchOccurrences,
  }),
};

export const categoriesQueries = {
  categories: () => ({
    queryKey: ["categories", "categories"],
    queryFn: fetchCategories,
  }),
};
