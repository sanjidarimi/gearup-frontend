import { apiFetch } from "@/lib/api";
interface GearResponse {
  id: string;
  name : string, 
  price : string
}
export const getGear = () => {
  const res = apiFetch<GearResponse>("/gear");
  return res;
};
