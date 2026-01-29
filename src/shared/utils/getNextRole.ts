import type { Role } from "@/store/types";

function getNextRole(current: Role): Role | null {
  if (current === "MODERADOR") return "MORADOR";
  if (current === "MORADOR") return "MODERADOR";
  return null; // pra não mexer com ADMIN por acidente
}

export default getNextRole;
