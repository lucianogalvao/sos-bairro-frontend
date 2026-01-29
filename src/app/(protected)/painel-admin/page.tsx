import AdminPanelClient from "@/features/admin-panel/client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Usuários - SOS Bairro",
};
export default function AdminPanelPage() {
  return <AdminPanelClient />;
}
