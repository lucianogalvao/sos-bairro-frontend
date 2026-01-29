import OccurrenceClient from "@/features/new-occurrence/client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nova ocorrência - SOS Bairro",
};

export default function NewOccurrencePage() {
  return <OccurrenceClient />;
}
