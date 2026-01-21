import { fetchLatestOccurrences, fetchOverview } from "@/shared/api/dashboard";

export const dashboardQueries = {
  overview: () => ({
    queryKey: ["dashboard", "overview"],
    queryFn: fetchOverview,
  }),
  latest: () => ({
    queryKey: ["dashboard", "latest-occurrences"],
    queryFn: fetchLatestOccurrences,
  }),
};
