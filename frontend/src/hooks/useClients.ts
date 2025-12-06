import { useEffect, useState, useCallback } from "react";
import { clienteService, Cliente, CreateClienteDto } from "@/services/cliente.service";

export function useClients() {
  const [clients, setClients] = useState<Cliente[]>([]);
  const [filtered, setFiltered] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await clienteService.getAll();
      setClients(data);
      setFiltered(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al cargar clientes';
      setError(errorMsg);
      console.error("Error loading clients", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filterClients = (query: string) => {
    const q = query.toLowerCase();
    setFiltered(
      clients.filter((c) => c.nombre.toLowerCase().includes(q))
    );
  };

  const getClientById = useCallback(async (id: number): Promise<Cliente | null> => {
    try {
      return await clienteService.getById(id);
    } catch (err) {
      console.error('Error getting client:', err);
      return null;
    }
  }, []);

  const createClient = async (data: CreateClienteDto): Promise<Cliente | null> => {
    try {
      const newClient = await clienteService.create(data);
      setClients([...clients, newClient]);
      setFiltered([...clients, newClient]);
      return newClient;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al crear cliente';
      setError(errorMsg);
      console.error('Error creating client:', err);
      return null;
    }
  };

  const updateClient = async (id: number, data: Partial<CreateClienteDto>): Promise<Cliente | null> => {
    try {
      const response = await clienteService.update(id, data);
      const updatedClients = clients.map(c => c.id === id ? response : c);
      setClients(updatedClients);
      setFiltered(updatedClients);
      return response;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al actualizar cliente';
      setError(errorMsg);
      console.error('Error updating client:', err);
      return null;
    }
  };

  const deleteClient = async (id: number): Promise<boolean> => {
    try {
      await clienteService.delete(id);
      const updatedClients = clients.filter(c => c.id !== id);
      setClients(updatedClients);
      setFiltered(updatedClients);
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al eliminar cliente';
      setError(errorMsg);
      console.error('Error deleting client:', err);
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
