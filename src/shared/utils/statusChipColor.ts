import { OccurrenceStatus } from "@/features/dashboard/types";

function statusChipColor(
  status: OccurrenceStatus,
): "success" | "warning" | "error" | "default" {
  if (status === "RESOLVIDA") return "success";
  if (status === "EM_ANALISE") return "warning";
  if (status === "REGISTRADA") return "error";
  return "default";
}
export default statusChipColor;
