 ```mermaid
erDiagram
    CLIENTE {
        int cliente_id PK
        string nombre
        string email UK
        string telefono
        string password_hash
        datetime fecha_registro
        boolean activo
    }
    
    DIRECCION {
        int direccion_id PK
        int cliente_id FK
        string calle
        string numero
        string colonia
        string ciudad
        string codigo_postal
        float latitud
        float longitud
        boolean predeterminada
    }
    
    SUCURSAL {
        int sucursal_id PK
        string nombre
        string direccion
        string telefono
        float latitud
        float longitud
        time hora_apertura
        time hora_cierre
        boolean activa
        int radio_entrega_km
    }
    
    CATEGORIA {
        int categoria_id PK
        string nombre
        string descripcion
        boolean activa
        int orden
    }
    
    PRODUCTO {
        int producto_id PK
        int categoria_id FK
        string nombre
        text descripcion
        decimal precio_base
        string imagen_url
        boolean activo
        int tiempo_preparacion_min
    }
    
    PRODUCTO_SUCURSAL {
        int producto_sucursal_id PK
        int producto_id FK
        int sucursal_id FK
        decimal precio_local
        int stock_disponible
        boolean disponible
    }
    
    PEDIDO {
        int pedido_id PK
        int cliente_id FK
        int sucursal_id FK
        int direccion_id FK
        int repartidor_id FK
        string numero_pedido UK
        datetime fecha_pedido
        decimal subtotal
        decimal costo_envio
        decimal descuentos
        decimal total
        string estado
        text notas_cliente
        datetime tiempo_estimado
        datetime tiempo_entrega
    }
    
    DETALLE_PEDIDO {
        int detalle_id PK
        int pedido_id FK
        int producto_id FK
        int cantidad
        decimal precio_unitario
        decimal subtotal
        text notas_producto
    }
    
    REPARTIDOR {
        int repartidor_id PK
        int sucursal_id FK
        string nombre
        string telefono
        string email
        string vehiculo_tipo
        string placa_vehiculo
        boolean disponible
        float latitud_actual
        float longitud_actual
        datetime ultima_ubicacion
    }
    
    PAGO {
        int pago_id PK
        int pedido_id FK
        string metodo_pago
        string referencia_externa
        decimal monto
        string estado_pago
        datetime fecha_procesamiento
        text detalles_transaccion
    }
    
    EMPLEADO {
        int empleado_id PK
        int sucursal_id FK
        string nombre
        string email UK
        string telefono
        string rol
        string password_hash
        boolean activo
        datetime fecha_contratacion
    }
    
    PROMOCION {
        int promocion_id PK
        string nombre
        text descripcion
        string tipo_descuento
        decimal valor_descuento
        decimal monto_minimo
        date fecha_inicio
        date fecha_fin
        boolean activa
    }
    
    PROMOCION_SUCURSAL {
        int promocion_sucursal_id PK
        int promocion_id FK
        int sucursal_id FK
    }
    
    TRACKING_PEDIDO {
        int tracking_id PK
        int pedido_id FK
        string estado_anterior
        string estado_nuevo
        datetime timestamp
        int empleado_id FK
        text comentarios
    }
    
    %% Relaciones
    CLIENTE ||--o{ DIRECCION : tiene
    CLIENTE ||--o{ PEDIDO : realiza
    
    SUCURSAL ||--o{ PRODUCTO_SUCURSAL : maneja
    SUCURSAL ||--o{ PEDIDO : recibe
    SUCURSAL ||--o{ REPARTIDOR : emplea
    SUCURSAL ||--o{ EMPLEADO : tiene
    SUCURSAL ||--o{ PROMOCION_SUCURSAL : aplica
    
    CATEGORIA ||--o{ PRODUCTO : agrupa
    
    PRODUCTO ||--o{ PRODUCTO_SUCURSAL : disponible_en
    PRODUCTO ||--o{ DETALLE_PEDIDO : incluido_en
    
    PEDIDO ||--o{ DETALLE_PEDIDO : contiene
    PEDIDO ||--o| PAGO : procesado_con
    PEDIDO ||--o{ TRACKING_PEDIDO : seguido_por
    PEDIDO }o--|| DIRECCION : entregado_en
    PEDIDO }o--o| REPARTIDOR : entregado_por
    
    PROMOCION ||--o{ PROMOCION_SUCURSAL : aplicable_en
    
    EMPLEADO ||--o{ TRACKING_PEDIDO : registra