import { Request } from "express";
import { controllerHandler } from "../../common/handlers";
import { productoService } from "./producto.service";
import { CreateProductoDto, UpdateProductoDto } from "./producto.schema";

export const createProductoController = controllerHandler(
  async (req: Request) => {
    const data: CreateProductoDto = req.body;
    return await productoService.create(data);
  },
  "Producto creado exitosamente",
  201
);

export const getAllProductosController = controllerHandler(
  async () => {
    return await productoService.getAll();
  },
  "Productos obtenidos correctamente"
);

export const getProductoByIdController = controllerHandler(
  async (req: Request) => {
    const id = Number(req.params.id);
    return await productoService.getById(id);
  },
  "Producto obtenido correctamente"
);

export const updateProductoController = controllerHandler(
  async (req: Request) => {
    const id = Number(req.params.id);
    const data: UpdateProductoDto = req.body;
    return await productoService.update(id, data);
  },
  "Producto actualizado correctamente"
);

export const deleteProductoController = controllerHandler(
  async (req: Request) => {
    const id = Number(req.params.id);
    await productoService.delete(id);
    return null;
  },
  "Producto eliminado correctamente",
  204
);
