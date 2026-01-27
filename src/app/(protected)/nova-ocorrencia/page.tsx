import OccurrenceClient from "@/features/new-occurrence/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nova ocorrência - SOS Bairro",
};

export default function NewOccurrencePage() {
  return <OccurrenceClient />;
}
