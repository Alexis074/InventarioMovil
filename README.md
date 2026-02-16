# Inventario CBVSIM - Sistema de Control de Inventario de Vehículos

Aplicación web profesional para el control de inventario de vehículos de bomberos, desarrollada con **Django REST Framework** (Backend API) y **React + Tailwind CSS** (Frontend SPA).

## 🏗️ Arquitectura

### Backend (Django REST Framework)
- **Framework**: Django 5.2.4 + Django REST Framework
- **Base de datos**: SQLite (configurable para PostgreSQL/MySQL)
- **API REST**: Endpoints estructurados con ViewSets
- **CORS**: Habilitado para comunicación con frontend

### Frontend (React + Tailwind)
- **Framework**: React 18 + Vite
- **Estilos**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios

## 📁 Estructura del Proyecto

```
App Inventario/
├── inventario_bomberos/          # Configuración Django
│   ├── settings.py              # Settings con DRF y CORS
│   └── urls.py                  # URLs principales
├── inventario/                   # App Django
│   ├── models.py                # Vehiculo, Compartimento, Equipo, Revision, DetalleRevision
│   ├── serializers.py          # Serializers DRF
│   ├── views.py                # ViewSets API
│   ├── urls.py                 # URLs API
│   └── admin.py                # Admin Django
├── frontend/                    # Aplicación React
│   ├── src/
│   │   ├── components/         # Componentes React
│   │   │   ├── Dashboard.jsx
│   │   │   ├── VehicleCard.jsx
│   │   │   ├── RevisionView.jsx
│   │   │   ├── Header.jsx
│   │   │   └── LoginForm.jsx
│   │   ├── api/               # Servicios API
│   │   │   ├── axios.js
│   │   │   ├── vehiculos.js
│   │   │   └── revisiones.js
│   │   ├── App.jsx            # Componente principal
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── manage.py
├── requirements.txt
└── README.md
```

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Python 3.10+
- Node.js 18+ y npm

### 1. Backend (Django)

#### Instalar dependencias
```bash
pip install -r requirements.txt
```

#### Aplicar migraciones
```bash
python manage.py makemigrations
python manage.py migrate
```

#### Crear superusuario (opcional, para admin)
```bash
python manage.py createsuperuser
```

#### Poblar base de datos con datos iniciales
```bash
python manage_seed.py
```

#### Ejecutar servidor de desarrollo
```bash
python manage.py runserver 0.0.0.0:8000
```

El backend estará disponible en: `http://localhost:8000`
- API: `http://localhost:8000/api/`
- Admin: `http://localhost:8000/admin/`

### 2. Frontend (React)

#### Navegar a la carpeta frontend
```bash
cd frontend
```

#### Instalar dependencias
```bash
npm install
```

#### Configurar variables de entorno (opcional)
Crear archivo `.env` basado en `.env.example`:
```bash
VITE_API_BASE_URL=http://localhost:8000
```

#### Ejecutar servidor de desarrollo
```bash
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

### 3. Acceso desde Tablet/Red Local

Para acceder desde una tablet en la misma red:

1. **Backend**: Asegúrate de ejecutar con `0.0.0.0`:
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

2. **Frontend**: Vite ya está configurado para escuchar en todas las interfaces.

3. **Obtener IP del PC**:
   ```bash
   # Windows
   ipconfig
   
   # Linux/Mac
   ifconfig
   ```

4. **Acceder desde tablet**: `http://IP_DEL_PC:5173`

5. **Actualizar CORS** (si es necesario): Editar `settings.py` y agregar la IP de la tablet en `CORS_ALLOWED_ORIGINS`.

## 📡 Endpoints API

### Vehículos
- `GET /api/vehiculos/` - Lista todos los vehículos
- `GET /api/vehiculos/{id}/` - Detalle de un vehículo
- `GET /api/vehiculos/{id}/estado/` - Estado de un vehículo
- `GET /api/vehiculos/estados/` - Estados de todos los vehículos

### Revisiones
- `GET /api/revisiones/` - Lista todas las revisiones
- `GET /api/revisiones/{id}/` - Detalle de una revisión
- `POST /api/revisiones/` - Crear una nueva revisión

### Compartimentos y Equipos
- `GET /api/compartimentos/` - Lista compartimentos
- `GET /api/equipos/` - Lista equipos

## 🎨 Funcionalidades

### Dashboard Principal
- Grid de tarjetas de vehículos
- Colores dinámicos según estado:
  - **Gris**: Pendiente (sin revisar)
  - **Verde**: Completo (todos los equipos marcados como SI)
  - **Rojo**: Crítico (algún equipo marcado como NO)
- Información de última revisión

### Pantalla de Revisión
- Lista completa de equipos por compartimento
- Radio buttons grandes y touch-friendly:
  - **SI**: Equipo presente y en buen estado
  - **NO**: Equipo faltante o dañado
  - **Pendiente**: Sin revisar
- Campo de observaciones por equipo
- Indicador visual si hay equipos marcados como NO
- Botón "Guardar Revisión" prominente

## 🔧 Modelos de Datos

### Vehiculo
- `codigo`: Código único (PMH-01, ABI-02, etc.)
- `nombre`: Nombre descriptivo
- `imagen`: Foto del vehículo
- `activo`: Si está activo en el inventario

### Compartimento
- `vehiculo`: Vehículo al que pertenece
- `nombre`: Nombre del compartimento
- `orden`: Orden de visualización

### Equipo
- `compartimento`: Compartimento al que pertenece
- `nombre`: Nombre del equipo
- `cantidad_esperada`: Cantidad esperada

### Revision
- `vehiculo`: Vehículo revisado
- `usuario`: Usuario que realizó la revisión (opcional)
- `responsable`: Nombre o grupo responsable
- `fecha`: Fecha y hora de la revisión
- `observaciones_generales`: Observaciones generales

### DetalleRevision
- `revision`: Revisión a la que pertenece
- `equipo`: Equipo revisado
- `estado`: 'si', 'no', o 'pendiente'
- `observaciones`: Observaciones específicas

## 📝 Scripts de Seed

El archivo `manage_seed.py` crea automáticamente:
- 6 vehículos (PMH-01, PMH-02, PMH-03, ABI-02, ATI-01, UFI-01)
- Compartimentos por vehículo
- Equipos ejemplo en cada compartimento

Ejecutar: `python manage_seed.py`

## 🛠️ Desarrollo

### Backend
- Los modelos están en `inventario/models.py`
- Los serializers en `inventario/serializers.py`
- Los ViewSets en `inventario/views.py`
- Las URLs API en `inventario/urls.py`

### Frontend
- Componentes principales en `frontend/src/components/`
- Servicios API en `frontend/src/api/`
- Estilos con Tailwind CSS (clases utilitarias)

## 📦 Producción

### Build del Frontend
```bash
cd frontend
npm run build
```

Los archivos estáticos se generan en `frontend/dist/`

### Desplegar Backend
- Configurar `DEBUG = False` en `settings.py`
- Configurar `ALLOWED_HOSTS` con el dominio
- Configurar base de datos PostgreSQL/MySQL
- Configurar servidor web (Nginx + Gunicorn)

## 📄 Licencia

Proyecto desarrollado para uso institucional.
