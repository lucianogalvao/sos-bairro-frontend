import { Role } from "@/store/types";

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
};
