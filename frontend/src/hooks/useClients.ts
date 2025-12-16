import { useEffect, useState, useCallback } from "react";
import {
  clientService,
  Client,
  CreateClientDto,
} from "@/services/client.service";

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filtered, setFiltered] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await clientService.getAll();
      const sortedData = [...data].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setClients(sortedData);
      setFiltered(sortedData);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Error al cargar clientes";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filterClients = (query: string) => {
    const q = query.toLowerCase();
    setFiltered(clients.filter((c) => c.nombre.toLowerCase().includes(q)));
  };

  const getClientById = useCallback(
    async (id: number): Promise<Client | null> => {
      try {
        return await clientService.getById(id);
      } catch (err) {
        return null;
      }
    },
    []
  );

  const createClient = async (
    data: CreateClientDto
  ): Promise<Client | null> => {
    try {
      const newClient = await clientService.create(data);
      const updatedClients = [...clients, newClient].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setClients(updatedClients);
      setFiltered(updatedClients);
      return newClient;
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Error al crear Client";
      setError(errorMsg);
      return null;
    }
  };

  const updateClient = async (
    id: number,
    data: Partial<CreateClientDto>
  ): Promise<Client | null> => {
    try {
      const response = await clientService.update(id, data);
      const updatedClients = clients
        .map((c) => (c.id === id ? response : c))
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      setClients(updatedClients);
      setFiltered(updatedClients);
      return response;
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Error al actualizar Client";
      setError(errorMsg);
      return null;
    }
  };

  const deleteClient = async (id: number): Promise<boolean> => {
    try {
      await clientService.delete(id);
      const updatedClients = clients.filter((c) => c.id !== id);
      setClients(updatedClients);
      setFiltered(updatedClients);
      return true;
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Error al eliminar Client";
      setError(errorMsg);
      return false;
    }
  };

  return {
    clients: filtered,
    allClients: clients,
    filterClients,
    loading,
    error,
    getClientById,
    createClient,
    updateClient,
    deleteClient,
    refetch: fetchClients,
  };
}
