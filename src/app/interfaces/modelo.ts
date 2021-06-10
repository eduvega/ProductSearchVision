export interface Producto{
    nombre: string;
    precio: number;
    codigoBarras: any;
    foto: string;
    id: string;
    fecha: Date;
    cantidad?: number,
}

export interface Joyeria{
    EAN: string;
    codigo: string;
    foto: string;
    descripcion: string;
    precio: number,
}

export interface Pedido {
    id: string
    productos: ProductoPedido[];
    precioTotal: number;
}

export interface ProductoPedido{
    producto: Producto;
    cantidad: number;
}