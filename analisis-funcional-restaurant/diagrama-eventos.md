 ```mermaid
graph TD
    %% Eventos de Cliente
    A[Cliente se registra] --> B[UsuarioRegistrado]
    C[Cliente navega menú] --> D[MenuConsultado]
    E[Cliente agrega producto] --> F[ProductoAgregado]
    G[Cliente confirma pedido] --> H[PedidoCreado]
    
    %% Eventos de Pago
    H --> I[PagoSolicitado]
    I --> J{Pago exitoso?}
    J -->|Sí| K[PagoCompletado]
    J -->|No| L[PagoFallido]
    
    %% Eventos de Cocina
    K --> M[PedidoConfirmado]
    M --> N[NotificacionCocina]
    N --> O[PreparacionIniciada]
    O --> P[PedidoEnPreparacion]
    P --> Q[PedidoListo]
    
    %% Eventos de Entrega
    Q --> R[RepartidorAsignado]
    R --> S[EntregaIniciada]
    S --> T[UbicacionActualizada]
    T --> U{Llegó al destino?}
    U -->|No| T
    U -->|Sí| V[EntregaCompletada]
    
    %% Eventos de Sistema POS
    W[SincronizacionPOS] --> X[InventarioActualizado]
    X --> Y[PreciosActualizados]
    Y --> Z[ProductosDisponiblesActualizados]
    
    %% Eventos de Notificaciones
    K --> AA[NotificacionCliente: PedidoConfirmado]
    O --> BB[NotificacionCliente: PreparacionIniciada]
    Q --> CC[NotificacionCliente: PedidoListo]
    S --> DD[NotificacionCliente: EntregaIniciada]
    V --> EE[NotificacionCliente: EntregaCompletada]
    
    %% Eventos de Error
    L --> FF[NotificacionError: PagoFallido]
    GG[TimeoutCocina] --> HH[NotificacionRetraso]
    II[RepartidorNoDisponible] --> JJ[ReasignacionRepartidor]
    
    %% Eventos de Stock
    KK[StockBajo] --> LL[AlertaInventario]
    LL --> MM[ProductoDesactivado]
    
    %% Eventos de Administración
    NN[AdminActualizaMenu] --> OO[MenuModificado]
    PP[AdminConfiguraSucursal] --> QQ[SucursalActualizada]
    RR[AdminCreaPromocion] --> SS[PromocionActivada]
    
    %% Eventos Temporales
    TT[InicioJornada] --> UU[SucursalAbierta]
    VV[FinJornada] --> WW[SucursalCerrada]
    XX[InicioPromocion] --> YY[PromocionIniciada]
    ZZ[FinPromocion] --> AAA[PromocionFinalizada]
    
    %% Estilado
    classDef clienteEvent fill:#e1f5fe
    classDef pagoEvent fill:#f3e5f5
    classDef cocinaEvent fill:#fff3e0
    classDef entregaEvent fill:#e8f5e8
    classDef sistemaEvent fill:#fff8e1
    classDef errorEvent fill:#ffebee
    classDef adminEvent fill:#f1f8e9
    
    class A,C,E,G clienteEvent
    class I,J,K,L,FF pagoEvent
    class M,N,O,P,Q cocinaEvent
    class R,S,T,U,V entregaEvent
    class W,X,Y,Z sistemaEvent
    class GG,HH,II,JJ,KK,LL,MM errorEvent
    class NN,OO,PP,QQ,RR,SS adminEvent