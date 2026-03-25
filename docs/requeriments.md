# Visión general del proyecto

El sistema es una aplicación web diseñada para pequeñas y medianas empresas (PyMEs) orientada a resolver tres pilares fundamentales: la gestión de inventarios, el cálculo de costos y la administración de la producción. Mediante esta plataforma, los usuarios podrán llevar un control detallado de su stock, automatizar los costos productivos y fijar precios de venta exactos según sus márgenes de ganancia. Además, la implementación de un sistema de alertas de stock mínimo permitirá anticipar el reabastecimiento y tomar decisiones estratégicas para evitar interrupciones en el flujo de ventas. 

# Requerimientos Funcionales:

# Modulo 1: Catalogo e inventario Dual
- RF-01: El sistema debe permitir categorizar los artículos en al menos dos grandes grupos: "Insumos" y "Productos Terminados".
- RF-02: El sistema debe permitir el ABM (Alta, Baja, Modificación) de artículos, incluyendo unidad de medida (kg, litros, unidades), SKU, descripción y estado.
- RF-03: El sistema debe registrar y mostrar el stock actual de cada artículo de forma independiente.

# Módulo 2: Administración de Producción (Fórmulas/Recetas)
- RF-04 (La Receta): El sistema debe permitir crear una "Fórmula de Producción" para cada Producto Terminado, definiendo qué cantidad exacta de cada Materia Prima se necesita para fabricar una unidad (ej: para 1 mesa, necesito 4 patas y 1 tabla).
- RF-05 (Orden de Producción): El sistema debe permitir registrar una "Orden de Producción" indicando la cantidad a fabricar de un producto terminado. Como resultado la orden tendra la info de cuantos insumos se necesitan.
- RF-06 (Descuento Automático): Al confirmar una producción, el sistema debe descontar automáticamente el stock de las materias primas utilizadas y sumar el stock del producto terminado generado.

# Módulo 3: Motor de Costos y Precios
- RF-07 (Costo de Producción): El sistema debe calcular automáticamente el costo base de un Producto Terminado sumando los costos individuales de la materia prima que lleva su fórmula.
- RF-08 (Márgenes e Impuestos): El sistema debe permitir aplicar un porcentaje de margen de ganancia y/o impuestos al costo base para sugerir un Precio de Venta.
- RF-09 (Actualización Masiva): El sistema debe permitir aplicar aumentos masivos de costos o precios por porcentaje (ej: "Aumentar un 15% todos los insumos de la categoría X"), una función vital para adaptar el sistema a cambios rápidos en la economía.

# |Modulo 4: Movimientos y alertas
- RF-10: El sistema debe registrar un historial de todos los movimientos (compras a proveedores, consumo por producción, ventas, ajustes manuales) con fecha y usuario.
- RF-11: El sistema debe emitir alertas visuales cuando el stock de un insumo clave o producto terminado perfore el límite de "Stock Mínimo" predefinido, facilitando el reabastecimiento a tiempo.

🟢 A Futuro:

# Requerimientos Funcionales: Módulo de Integración con WhatsApp Bot

# Módulo A: Notificaciones Proactivas (Salientes)
El sistema debe enviar mensajes automáticos a través de WhatsApp ante eventos específicos:

- RF-12 (Alertas de Stock): Cuando un artículo perfore su stock mínimo, el sistema debe enviar automáticamente una alerta al Administrador detallando: Nombre del Producto, SKU, Stock Actual y Stock Mínimo.
- RF-13 (Resumen de Producción): Al finalizar una "Orden de Producción" en la web, el sistema debe enviar un resumen por WhatsApp confirmando: Producto Fabricado, Cantidad y Costo de Producción Total.
- RF-14 (Reporte de Movimientos Críticos): El sistema puede configurarse para enviar un mensaje ante movimientos manuales inusuales (ej: un ajuste de pérdida grande).

# Módulo B: Asistente de Carga de Compras (Entrante - Bidireccional con IA)
El bot debe ser capaz de procesar imágenes de facturas de compra para automatizar el ingreso de stock y actualizar costos bases:

- RF-15 (Captura de Imagen): El bot debe permitir al usuario enviar una foto de una factura de compra de proveedores.
- RF-16 (Procesamiento OCR & IA): El backend (Laravel) debe capturar la imagen, enviarla a un servicio de OCR con IA (ej: Google Vision, AWS Textract, u OpenAI Vision) para extraer datos estructurados: Fecha, CUIT Proveedor, Ítems (Nombre, Cantidad, Precio Unitario), Total.
- RF-17 (Mapeo Inteligente): El sistema debe intentar machear los ítems de la factura con los artículos existentes en la base de datos (por nombre o SKU si lo tiene).
- RF-17a (Carga Automática): Si todos los ítems machean y se extrajeron todos los datos, el bot debe responder: "Factura procesada con éxito. ¿Confirma la carga de [X] ítems y la actualización de costos?".
- RF-17b (Interacción por Faltantes): Si la IA tiene dudas (ej: no encuentra un producto), el bot debe preguntar al usuario: "No reconozco el ítem 'Tornillo 3x16'. ¿Es un producto nuevo o corresponde a uno existente? Responda con el Nombre o SKU".
- RF-18 (Confirmación y Actualización): Una vez que el usuario confirma la carga por WhatsApp, el sistema debe:
    * Crear el "Registro de Compra".
    * Sumar el Stock de los insumos.
    * Actualizar el Costo Base de esos insumos en el catálogo para el cálculo de costos de producción.