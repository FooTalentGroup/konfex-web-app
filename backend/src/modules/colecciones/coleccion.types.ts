export interface CreateColeccionDtoDb {
    codigo: number;
    nombre: string;
    imagen?: string;
    icono?: string;
}

export interface UpdateColeccionDtoDb {
    nombre?: string;
    imagen?: string;
    icono?: string;
}