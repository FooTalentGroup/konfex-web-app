export interface ClienteCreateInput {
    nombre: string;
    telefono?: string | null;
    email?: string | null;
    origen?: string | null;
    instagramUser?: string | null;
    notas?: string | null;
}
  
export interface ClienteUpdateInput {
    nombre?: string;
    telefono?: string | null;
    email?: string | null;
    origen?: string | null;
    instagramUser?: string | null;
    notas?: string | null;
}