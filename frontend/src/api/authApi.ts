import api from "./axios";
import { AuthResponse } from "../types";

export const registerUser = (name: string, email: string, password: string) =>
  api.post<AuthResponse>("/auth/register", { name, email, password });

export const loginUser = (email: string, password: string) =>
  api.post<AuthResponse>("/auth/login", { email, password });
