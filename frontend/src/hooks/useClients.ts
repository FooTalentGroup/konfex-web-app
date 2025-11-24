import { useEffect, useState } from "react";
import { apiClient } from "../config/apiClient";

interface Client {
  id: number;
  nombre: string;
}

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filtered, setFiltered] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await apiClient<{ data: Client[] }>("/clientes");
        setClients(response.data);
        setFiltered(response.data);
      } catch (error) {
        console.error("Error loading clients", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const filterClients = (query: string) => {
    const q = query.toLowerCase();
    setFiltered(
      clients.filter((c) => c.nombre.toLowerCase().includes(q))
    );
  };

  return { clients: filtered, filterClients, loading };
}
