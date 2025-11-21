import { Role } from "./role";

export interface User {
  id: number;
  nombre: string;
  email: string;
  role: Role;
}
