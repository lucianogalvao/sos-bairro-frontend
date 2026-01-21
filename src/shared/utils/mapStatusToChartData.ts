import {
  ChartItem,
  OccurrenceStatus,
  StatusCountMap,
} from "@/features/dashboard/types";
import STATUS_COLORS from "./STATUS_COLORS";

export function mapStatusToChartData(
  data?: StatusCountMap | null,
): ChartItem[] {
  if (!data) return [];

  return (Object.entries(data) as [OccurrenceStatus, number][])
    .map(([status, value]) => ({
      label: status.replace("_", " "),
      value,
      color: STATUS_COLORS[status],
    }))
    .filter((item) => item.value > 0);
}
