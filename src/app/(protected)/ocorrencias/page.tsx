import OccurrencesClient from "@/features/occurences/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ocorrências - SOS Bairro",
};

export default function OccurrencesPage() {
  return <OccurrencesClient />;
}
