import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchOccurrences, deleteOccurrence } from "@/shared/api/occurrences";
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

export function useDeleteOccurrence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteOccurrence(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: occurrencesQueries.occurrences().queryKey,
      });
    },
  });
}
