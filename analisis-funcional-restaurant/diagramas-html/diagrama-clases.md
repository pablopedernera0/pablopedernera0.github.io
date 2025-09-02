 ```mermaid
classDiagram
    %% Clases del Dominio de Usuario
    class Usuario {
        -int usuarioId
        -string email
        -string nombre
        -string telefono
        -string passwordHash
        -DateTime fechaRegistro
        -boolean activo
        +autenticar(password: string): boolean
        +actualizarPerfil(datos: UsuarioDatos): void
        +cambiarPassword(passwordAnterior: string, passwordNuevo: string): boolean
    }
    
    class Cliente {
        -List~Direccion~ direcciones
        -List~Pedido~ historialPedidos
        +agregarDireccion(direccion: Direccion): void
        +obtenerDireccionPredeterminada(): Direccion
        +realizarPedido(carrito: Carrito, direccion: Direccion): Pedido
        +consultarHistorial(): List~Pedido~
    }
    
    class Empleado {
        -string rol
        -int sucursalId
        -DateTime fechaContratacion
        +tienePermiso(accion: string): boolean
        +cambiarSucursal(nuevaSucursal: int): void
    }
    
    class Repartidor {
        -string vehiculoTipo
        -string placaVehiculo
        -boolean disponible
        -Ubicacion ubicacionActual
        -List~Pedido~ pedidosAsignados
        +actualizarUbicacion(lat: float, lng: float): void
        +aceptarPedido(pedidoId: int): boolean
        +marcarEntregaCompletada(pedidoId: int): void
        +calcularRutaOptima(): List~Ubicacion~
    }
    
    %% Clases del Dominio de Productos
    class Categoria {
        -int categoriaId
        -string nombre
        -string descripcion
        -boolean activa
        -int orden
        +activar(): void
        +desactivar(): void
    }
    
    class Producto {
        -int productoId
        -int categoriaId
        -string nombre
        -string descripcion
        -decimal precioBase
        -string imagenUrl
        -boolean activo
        -int tiempoPreparacion
        +actualizarPrecio(nuevoPrecio: decimal): void
        +estaDisponibleEnSucursal(sucursalId: int): boolean
        +obtenerPrecioEnSucursal(sucursalId: int): decimal
    }
    
    class ProductoSucursal {
        -int productoSucursalId
        -int productoId
        -int sucursalId
        -decimal precioLocal
        -int stockDisponible
        -boolean disponible
        +actualizarStock(cantidad: int): void
        +verificarDisponibilidad(): boolean
        +aplicarOferta(descuento: decimal): void
    }
    
    %% Clases del Dominio de Pedidos
    class Carrito {
        -List~ItemCarrito~ items
        -decimal subtotal
        -int sucursalId
        +agregarItem(producto: Producto, cantidad: int): void
        +removerItem(productoId: int): void
        +calcularTotal(): decimal
        +aplicarPromocion(promocion: Promocion): void
        +vaciar(): void
    }
    
    class ItemCarrito {
        -int productoId
        -string nombreProducto
        -int cantidad
        -decimal precioUnitario
        -decimal subtotal
        -string notas
        +actualizarCantidad(nuevaCantidad: int): void
        +calcularSubtotal(): decimal
    }
    
    class Pedido {
        -int pedidoId
        -string numeroPedido
        -int clienteId
        -int sucursalId
        -int direccionId
        -DateTime fechaPedido
        -EstadoPedido estado
        -List~DetallePedido~ detalles
        -decimal total
        -DateTime tiempoEstimado
        -string notasCliente
        +confirmar(): void
        +cancelar(motivo: string): boolean
        +actualizarEstado(nuevoEstado: EstadoPedido): void
        +calcularTiempoEntrega(): DateTime
        +aplicarDescuento(descuento: decimal): void
    }
    
    class DetallePedido {
        -int detalleId
        -int productoId
        -int cantidad
        -decimal precioUnitario
        -decimal subtotal
        -string notasProducto
        +calcularSubtotal(): decimal
        +modificarCantidad(nuevaCantidad: int): void
    }
    
    %% Clases del Dominio de Ubicación
    class Sucursal {
        -int sucursalId
        -string nombre
        -Direccion direccion
        -string telefono
        -TimeSpan horaApertura
        -TimeSpan horaCierre
        -boolean activa
        -int radioEntregaKm
        -List~Empleado~ empleados
        -List~Repartidor~ repartidores
        +estaAbierta(): boolean
        +estaEnZonaEntrega(direccion: Direccion): boolean
        +obtenerProductosDisponibles(): List~Producto~
        +asignarRepartidor(pedido: Pedido): Repartidor
    }
    
    class Direccion {
        -int direccionId
        -string calle
        -string numero
        -string colonia
        -string ciudad
        -string codigoPostal
        -float latitud
        -float longitud
        -boolean predeterminada
        +calcularDistancia(otraDireccion: Direccion): float
        +validarFormato(): boolean
        +obtenerTextoCompleto(): string
    }
    
    class Ubicacion {
        -float latitud
        -float longitud
        -DateTime timestamp
        +calcularDistancia(otraUbicacion: Ubicacion): float
        +estaEnRadio(centro: Ubicacion, radioKm: float): boolean
    }
    
    %% Clases de Pago
    class Pago {
        -int pagoId
        -int pedidoId
        -MetodoPago metodoPago
        -string referenciaExterna
        -decimal monto
        -EstadoPago estado
        -DateTime fechaProcesamiento
        +procesar(): boolean
        +reembolsar(monto: decimal): boolean
        +verificarEstado(): EstadoPago
    }
    
    class MetodoPago {
        -string tipo
        -string proveedor
        -boolean activo
        +validar(): boolean
        +calcularComision(monto: decimal): decimal
    }
    
    %% Clases de Promociones
    class Promocion {
        -int promocionId
        -string nombre
        -string descripcion
        -TipoDescuento tipo
        -decimal valorDescuento
        -decimal montoMinimo
        -Date fechaInicio
        -Date fechaFin
        -boolean activa
        +estaVigente(): boolean
        +esAplicable(pedido: Pedido): boolean
        +calcularDescuento(monto: decimal): decimal
    }
    
    %% Clases de Servicios
    class ServicioPedido {
        +crearPedido(carrito: Carrito, cliente: Cliente): Pedido
        +confirmarPedido(pedidoId: int): boolean
        +actualizarEstadoPedido(pedidoId: int, estado: EstadoPedido): void
        +calcularTiempoEntrega(pedido: Pedido): DateTime
        +asignarRepartidor(pedido: Pedido): boolean
    }
    
    class ServicioInventario {
        +actualizarStock(productoId: int, sucursalId: int, cantidad: int): void
        +verificarDisponibilidad(productoId: int, sucursalId: int): boolean
        +sincronizarConPOS(): void
        +alertarStockBajo(): List~ProductoSucursal~
    }
    
    class ServicioNotificacion {
        +enviarNotificacionPush(usuarioId: int, mensaje: string): void
        +enviarSMS(telefono: string, mensaje: string): void
        +enviarEmail(email: string, asunto: string, contenido: string): void
        +notificarCambioEstado(pedido: Pedido): void
    }
    
    %% Enumeraciones
    class EstadoPedido {
        <<enumeration>>
        PENDIENTE
        CONFIRMADO
        EN_PREPARACION
        LISTO
        EN_ENTREGA
        ENTREGADO
        CANCELADO
    }
    
    class EstadoPago {
        <<enumeration>>
        PENDIENTE
        PROCESANDO
        COMPLETADO
        FALLIDO
        REEMBOLSADO
    }
    
    class TipoDescuento {
        <<enumeration>>
        PORCENTAJE
        MONTO_FIJO
        PRODUCTO_GRATIS
        ENVIO_GRATIS
    }
    
    %% Relaciones de Herencia
    Usuario <|-- Cliente
    Usuario <|-- Empleado
    Empleado <|-- Repartidor
    
    %% Relaciones de Composición y Agregación
    Cliente *-- Direccion : "1..*"
    Cliente *-- Pedido : "0..*"
    Carrito *-- ItemCarrito : "1..*"
    Pedido *-- DetallePedido : "1..*"
    Pedido *-- Pago : "0..1"
    Sucursal *-- Empleado : "1..*"
    Sucursal *-- Repartidor : "0..*"
    
    %% Relaciones de Asociación
    Categoria --> Producto : "1..*"
    Producto --> ProductoSucursal : "1..*"
    Sucursal --> ProductoSucursal : "1..*"
    Pedido --> Sucursal
    Pedido --> Direccion
    Pedido --> Cliente
    Repartidor --> Pedido : "0..*"
    Promocion --> Sucursal : "1..*"
    
    %% Relaciones con Servicios
    ServicioPedido --> Pedido
    ServicioPedido --> Carrito
    ServicioInventario --> ProductoSucursal
    ServicioNotificacion --> Usuario