import { Router } from 'express';
import { validationSchema } from '../../middleware';
import {
  createPresupuestoSchema,
  updatePresupuestoSchema,
  partialUpdatePresupuestoSchema,
} from './presupuesto.schema';

import {
  getPresupuestosController,
  getPresupuestoByIdController,
  createPresupuestoController,
  updatePresupuestoController,
  partialUpdatePresupuestoController,
  deletePresupuestoController,
  getNextNumeroPresupuestoController,
} from './presupuesto.controller';

const router = Router();

// GET /presupuestos — listar con paginación/filtros
router.get('/', getPresupuestosController);

// GET /presupuestos/next-number — obtener siguiente número de presupuesto
router.get('/next-number', getNextNumeroPresupuestoController);

// POST /presupuestos — crear (detalles opcionales embebidos)
router.post('/', validationSchema(createPresupuestoSchema), createPresupuestoController);

// GET /presupuestos/:id — obtener uno
router.get('/:id', getPresupuestoByIdController);

// PUT /presupuestos/:id — actualizar completo
router.put('/:id', validationSchema(updatePresupuestoSchema), updatePresupuestoController);

// PATCH /presupuestos/:id — actualización parcial
router.patch('/:id', validationSchema(partialUpdatePresupuestoSchema), partialUpdatePresupuestoController);

// DELETE /presupuestos/:id — eliminar
router.delete('/:id', deletePresupuestoController);

export default router;
