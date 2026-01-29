import { fetchUsers, updateUserRole } from "@/shared/api/users";
import { Role } from "@/store/types";
import { useQueryClient } from "node_modules/@tanstack/react-query/build/modern/QueryClientProvider";
import { useMutation } from "node_modules/@tanstack/react-query/build/modern/useMutation";
import { newCategory } from "@/shared/api/categories";
import { categoriesQueries } from "@/features/occurences/queries";
import { RiskLevel } from "../dashboard/types";
import { deleteCategory } from "@/shared/api/categories";
import {
  updateOccurrence,
  type UpdateOccurrencePayload,
} from "@/shared/api/occurrences";

export const usersQuery = {
  users: () => ({
    queryKey: ["users"],
    queryFn: fetchUsers,
  }),
};

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: { id: number; nextRole: Role }) => updateUserRole(vars),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: usersQuery.users().queryKey,
      });
    },
  });
}

export function useNewCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { title: string; riskLevel: RiskLevel }) =>
      newCategory(payload.title, payload.riskLevel),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: categoriesQueries.categories().queryKey,
      });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateOccurrence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateOccurrencePayload) => updateOccurrence(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["occurrences"] });
    },
  });
}
