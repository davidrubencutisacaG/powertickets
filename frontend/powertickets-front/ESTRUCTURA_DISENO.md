# Guía de Estructura del Diseño - PowerTickets

## 📁 Estructura de Carpetas

```
src/
├── components/
│   ├── Header.tsx          # Header principal con logo, menú y búsqueda
│   ├── Header.css
│   ├── Carousel.tsx         # Carrusel principal de eventos
│   ├── Carousel.css
│   ├── EventCard.tsx        # Tarjeta individual de evento
│   ├── EventCard.css
│   └── SidebarDestacados.tsx # Sidebar con eventos destacados
│   └── SidebarDestacados.css
├── HomePage.tsx             # Página principal con layout
├── HomePage.css
└── App.tsx                  # Componente raíz (ya actualizado)
```

## 🖼️ Ubicación de Imágenes

### Imágenes del Carrusel
**Carpeta:** `/public/events/`  
**Tamaño recomendado:** 1920×700px (optimizadas a ~200-300KB)  
**Formato:** JPG o WebP  
**Nomenclatura:** `{eventId}.jpg` (ej: `event-1.jpg`, `event-2.jpg`)

### Imágenes de Tarjetas de Eventos
**Carpeta:** `/public/events/` (misma carpeta)  
**Tamaño recomendado:** 600×400px (ratio 3:2, optimizadas a ~100-150KB)  
**Formato:** JPG o WebP  
**Nomenclatura:** `{eventId}.jpg` (mismo nombre que el carrusel, pero diferentes tamaños)

### Imagen Placeholder
**Carpeta:** `/public/`  
**Archivo:** `placeholder-event.jpg`  
**Tamaño:** 600×400px  
**Uso:** Se muestra cuando una imagen no se puede cargar

## 🎨 Paleta de Colores

- **Púrpura Principal:** `#6B2C91`, `#8B2FA8`
- **Rojo/Acento:** `#E63946`, `#FF6B6B`
- **Negro:** `#000000`, `#1A1A1A`
- **Blanco:** `#FFFFFF`
- **Grises:** `#F5F5F5`, `#CCCCCC`, `#666666`

## 🔌 Conexión a la API

### Estructura de Datos Esperada

El componente `HomePage` espera recibir eventos con esta estructura:

```typescript
type Event = {
  id: string;
  name: string;
  date: string;        // ISO string: "2024-12-25T20:00:00Z"
  location: string;
  category: string;
  flyerUrl?: string;   // URL completa de la imagen (opcional)
  price?: number;      // Precio en soles (opcional)
};
```

### Función de Conexión

En `App.tsx`, ya tienes la función `getEvents()` que se llama en `useEffect`:

```typescript
useEffect(() => {
  const loadEvents = async () => {
    try {
      const eventsList = await getEvents();
      // El código ya maneja diferentes formatos de respuesta
      const eventsArray = Array.isArray(eventsList) 
        ? eventsList 
        : Array.isArray(eventsList?.data) 
          ? eventsList.data 
          : [];
      setEvents(eventsArray);
    } catch (error: any) {
      setMessage(`Error al cargar eventos: ${error.message}`);
      setEvents([]);
    }
  };
  loadEvents();
}, []);
```

### Formato de Respuesta de la API

La API puede devolver eventos en cualquiera de estos formatos:

**Opción 1: Array directo**
```json
[
  {
    "id": "1",
    "name": "Concierto de Rock",
    "date": "2024-12-25T20:00:00Z",
    "location": "Lima",
    "category": "Música",
    "price": 50.00
  }
]
```

**Opción 2: Objeto con propiedad data**
```json
{
  "data": [
    {
      "id": "1",
      "name": "Concierto de Rock",
      ...
    }
  ]
}
```

### Mapeo de Imágenes

El código automáticamente intenta cargar imágenes en este orden:

1. Si `event.flyerUrl` existe → usa esa URL
2. Si no → intenta `/events/${event.id}.jpg`
3. Si falla → muestra placeholder

## 📐 Tamaños de Imágenes Recomendados

### Para Optimización Web:

1. **Carrusel (Hero):**
   - Tamaño original: 1920×700px
   - Optimizado: 1920×700px @ 80% calidad JPG
   - Peso: ~200-300KB
   - Usar WebP si es posible: ~150-200KB

2. **Tarjetas de Eventos:**
   - Tamaño original: 600×400px
   - Optimizado: 600×400px @ 85% calidad JPG
   - Peso: ~100-150KB
   - WebP: ~70-100KB

3. **Sidebar Destacados:**
   - Tamaño: 150×100px (se genera automáticamente desde la imagen de tarjeta)
   - Usar la misma imagen de tarjeta, el CSS la redimensiona

## 🚀 Funcionalidades Implementadas

### Header
- ✅ Logo clickeable
- ✅ Menú de navegación
- ✅ Barra de búsqueda integrada
- ✅ Botón de login/cuenta con dropdown
- ✅ Responsive (oculta menú y búsqueda en móvil)

### Carrusel
- ✅ Auto-slide cada 5 segundos
- ✅ Navegación manual con botones
- ✅ Overlay con gradiente
- ✅ Texto alineado a la izquierda
- ✅ Borde a borde (full width)
- ✅ Responsive

### Tarjetas de Eventos
- ✅ Grid responsive
- ✅ Hover effects
- ✅ Badge de categoría
- ✅ Información completa (fecha, ubicación, precio)
- ✅ Imagen con fallback

### Sidebar Destacados
- ✅ Lista vertical de eventos
- ✅ Sticky positioning
- ✅ Imágenes pequeñas optimizadas
- ✅ Click para navegar

## 📱 Responsive Design

- **Desktop (>1024px):** Layout de 2 columnas (70% eventos, 30% sidebar)
- **Tablet (768-1024px):** Layout de 1 columna, sidebar arriba
- **Mobile (<768px):** Grid de 1 columna, sidebar arriba, header simplificado

## 🎯 Próximos Pasos

1. **Agregar imágenes:** Coloca las imágenes en `/public/events/` con el formato `{eventId}.jpg`
2. **Conectar API:** Asegúrate de que `getEvents()` devuelva el formato correcto
3. **Navegación:** Implementa la función `onEventClick` para navegar al detalle del evento
4. **Optimización:** Comprime las imágenes antes de subirlas
5. **Testing:** Prueba con diferentes tamaños de pantalla

## 🔧 Personalización

### Cambiar colores principales:
Edita las variables en los archivos CSS:
- `Header.css`: `#6b2c91` (púrpura), `#e63946` (rojo)
- `EventCard.css`: `#6b2c91` (badge), `#e63946` (precio)
- `SidebarDestacados.css`: `#6b2c91` (título)

### Ajustar tamaños:
- Carrusel: `Carousel.css` línea 5 (`height: 550px`)
- Tarjetas: `EventCard.css` línea 12 (`height: 240px`)
- Grid: `HomePage.css` línea 45 (`minmax(280px, 1fr)`)

