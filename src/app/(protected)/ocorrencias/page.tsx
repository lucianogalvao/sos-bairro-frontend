import OccurrencesClient from "@/features/occurences/client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ocorrências - SOS Bairro",
};

export default function OccurrencesPage() {
  return <OccurrencesClient />;
}
