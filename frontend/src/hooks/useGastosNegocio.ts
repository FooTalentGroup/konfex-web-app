import { useEffect, useState } from "react";
import { apiClient } from "../config/apiClient";

interface GastosNegocio {
  id: number;
  nombre: string;
  porcentaje: number;
  createdAt: string;
  updatedAt: string;
}

interface ImpuestoGeneral {
  id: number;
  nombre: string;
  porcentaje: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

interface GastoLocal {
  id: string;
  nombre: string;
  porcentaje: number;
  isNew?: boolean; // Para distinguir los que aún no se guardaron
}

export function useGastosNegocio() {
  const [gastosNegocio, setGastosNegocio] = useState<GastoLocal[]>([]);
  const [iva, setIva] = useState<number>(0);
  const [ivaId, setIvaId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch inicial de gastos e IVA
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch gastos de negocio
      const gastosResponse = await apiClient<ApiResponse<GastosNegocio[]>>("/gastos-negocio");
      const mappedGastos: GastoLocal[] = (gastosResponse.data || []).map(g => ({
        id: g.id.toString(),
        nombre: g.nombre,
        porcentaje: g.porcentaje,
        isNew: false,
      }));
      setGastosNegocio(mappedGastos);

      // Fetch IVA
      const ivaResponse = await apiClient<ApiResponse<ImpuestoGeneral[]>>("/impuesto-general");
      if (ivaResponse.data && ivaResponse.data.length > 0) {
        setIva(ivaResponse.data[0].porcentaje);
        setIvaId(ivaResponse.data[0].id);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al cargar datos";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Agregar un gasto localmente (no guardado aún)
  const addGasto = () => {
    const newGasto: GastoLocal = {
      id: `new-${Date.now()}`, // ID temporal
      nombre: "",
      porcentaje: 0,
      isNew: true,
    };
    setGastosNegocio(prev => [...prev, newGasto]);
  };

  // Actualizar gasto localmente
  const updateGasto = (id: string, field: "nombre" | "porcentaje", value: string) => {
    setGastosNegocio(prev =>
      prev.map(g =>
        g.id === id
          ? {
            ...g,
            [field]: field === "porcentaje" ? Number(value) : value,
          }
          : g
      )
    );
  };

  // Eliminar gasto localmente
  const removeGastoLocal = (id: string) => {
    setGastosNegocio(prev => prev.filter(g => g.id !== id));
  };

  // Eliminar gasto del backend
  const deleteGasto = async (id: string) => {
    try {
      // Si es un gasto nuevo que no se ha guardado, solo quitarlo localmente
      const gasto = gastosNegocio.find(g => g.id === id);
      if (gasto?.isNew) {
        removeGastoLocal(id);
        return true;
      }

      // Si ya está guardado, eliminarlo del backend
      await apiClient(`/gastos-negocio/${id}`, { method: "DELETE" });
      removeGastoLocal(id);
      return true;
    } catch (err) {
      setError("Error al eliminar el gasto");
      return false;
    }
  };

  // Guardar todos los cambios
  const saveChanges = async () => {
    try {
      setSaving(true);
      setError(null);

      // Guardar cada gasto
      for (const gasto of gastosNegocio) {
        const payload = {
          nombre: gasto.nombre,
          porcentaje: gasto.porcentaje,
        };

        if (gasto.isNew) {
          // Crear nuevo gasto
          await apiClient("/gastos-negocio", {
            method: "POST",
            body: payload,
          });
        } else {
          // Actualizar gasto existente
          await apiClient(`/gastos-negocio/${gasto.id}`, {
            method: "PUT",
            body: payload,
          });
        }
      }

      // Actualizar IVA si existe
      if (ivaId) {
        await apiClient(`/impuesto-general/${ivaId}`, {
          method: "PUT",
          body: {
            nombre: "IVA",
            porcentaje: iva,
          },
        });
      }

      // Refrescar datos después de guardar
      await fetchData();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al guardar";
      setError(errorMessage);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    gastosNegocio,
    iva,
    loading,
    saving,
    error,
    setIva,
    addGasto,
    updateGasto,
    removeGastoLocal,
    deleteGasto,
    saveChanges,
    fetchData,
  };
}