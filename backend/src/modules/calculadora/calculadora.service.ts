import { AppError } from "@/common/errors";
import { calculadoraRepository } from "./calculadora.repository";
import {
  CreateCalculadoraDto,
  UpdateCalculadoraDto,
} from "./calculadora.schema";
import { clienteRepository } from "../cliente/cliente.repository";
import { PresupuestoRepository } from "../presupuesto";

export const calculadoraService = {
  create: async (data: CreateCalculadoraDto) => {
    const cliente = await clienteRepository.findById(data.clienteId);
    if (!cliente) throw new AppError("Cliente no encontrado", 404);

    const presupuesto = await PresupuestoRepository.findById(
      data.numeroPresupuesto,
    );
    if (!presupuesto) throw new AppError("Presupuesto no encontrado", 404);

    return calculadoraRepository.create(data);
  },

  getAll: () => calculadoraRepository.findAll(),

  getById: async (id: number) => {
    if (!id || isNaN(id)) throw new AppError("ID inválido", 400);

    const calculadora = await calculadoraRepository.findById(id);

    if (!calculadora) throw new AppError("Calculadora no encontrada", 404);

    return calculadora;
  },

  update: async (id: number, data: UpdateCalculadoraDto) => {
    await calculadoraService.getById(id);

    if (data.clienteId) {
      const cliente = await clienteRepository.findById(data.clienteId);
      if (!cliente) throw new AppError("Cliente no encontrado", 404);
    }

    if (data.numeroPresupuesto) {
      const presupuesto = await PresupuestoRepository.findById(
        data.numeroPresupuesto,
      );
      if (!presupuesto) throw new AppError("Presupuesto no encontrado", 404);
    }

    return calculadoraRepository.update(id, data);
  },

  delete: async (id: number) => {
    await calculadoraService.getById(id);
    return calculadoraRepository.delete(id);
  },
};
