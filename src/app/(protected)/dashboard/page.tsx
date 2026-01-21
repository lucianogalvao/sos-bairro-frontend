import DashboardClient from "@/features/dashboard/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - SOS Bairro",
};

export default async function DashboardPage() {
  return <DashboardClient />;
}
