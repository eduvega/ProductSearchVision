export interface Joyeria{
    EAN: string;
    codigo: string;
    foto: string;
    descripcion: string;
    precio: number,
    cantidad?: number,
    
}

export interface Pedido {
    id: string
    productos: ProductoPedido[];
    precioTotal: number;
}

export interface ProductoPedido{
    producto: Joyeria;
    cantidad: number;
}