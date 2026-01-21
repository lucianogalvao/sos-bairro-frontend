import { OccurrenceStatus } from "@/features/dashboard/types";

const STATUS_COLORS: Record<OccurrenceStatus, string> = {
  REGISTRADA: "#DC2626",
  EM_ANALISE: "#FBBF24",
  RESOLVIDA: "#22C55E",
};

export default STATUS_COLORS;
