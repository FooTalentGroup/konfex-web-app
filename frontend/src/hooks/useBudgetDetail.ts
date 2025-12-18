import { useState, useEffect } from "react";
import { BudgetResponseDto } from "@/types/budget.types";
import { budgetService } from "@/services/budget.service";

export const useBudgetDetail = (id: number) => {
  const [budget, setBudget] = useState<BudgetResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBudget = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const presupuesto = await budgetService.getById(id);
        setBudget(presupuesto);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al cargar presupuesto";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBudget();
    }
  }, [id]);

  const refetch = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const presupuesto = await budgetService.getById(id);
      setBudget(presupuesto);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar presupuesto";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    budget,
    isLoading,
    error,
    refetch,
  };
};
