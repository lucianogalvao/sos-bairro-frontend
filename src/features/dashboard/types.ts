export type Overview = {
  total: number;
  byStatus: {
    REGISTRADA: number;
    EM_ANALISE: number;
    RESOLVIDA: number;
  };
};

export type RiskLevel = "ALTO" | "MEDIO" | "BAIXO";

export type OccurrenceStatus = "REGISTRADA" | "EM_ANALISE" | "RESOLVIDA";

export type StatusCountMap = Record<OccurrenceStatus, number>;

export type ChartItem = {
  label: string;
  value: number;
  color: string;
};

export type OccurrenceCategory = {
  id: number;
  title: string;
  riskLevel: RiskLevel;
  createdAt: string;
};

export type UserSummary = {
  id: number;
  name: string;
  email: string;
};

export type Occurrence = {
  id: number;

  description: string;
  imageUrl: string | null;

  status: OccurrenceStatus;

  locationLatitude: number;
  locationLongitude: number;

  createdAt: string;
  updatedAt: string;

  categoryId: number;
  residentId: number;
  moderatorId: number | null;

  category: OccurrenceCategory;
  resident: UserSummary;
  moderator: UserSummary | null;
};

export type PieItem = { label: string; value: number; color: string };

export type Order = "asc" | "desc";
export type SortKey = "description" | "category" | "createdAt" | "status";
