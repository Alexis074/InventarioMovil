# 🚀 Guía de Instalación Paso a Paso

## Paso 1: Instalar Dependencias del Backend

Abre una terminal en la carpeta `App Inventario` y ejecuta:

```bash
pip install -r requirements.txt
```

## Paso 2: Crear y Aplicar Migraciones

```bash
python manage.py makemigrations inventario
python manage.py migrate
```

## Paso 3: Crear Datos Iniciales (Seed)

```bash
python manage_seed.py
```

Esto creará:
- Los 6 vehículos (PMH-01, PMH-02, PMH-03, ABI-02, ATI-01, UFI-01)
- Compartimentos para cada vehículo
- Equipos ejemplo en cada compartimento

## Paso 4: Iniciar el Servidor Backend

```bash
python manage.py runserver 0.0.0.0:8000
```

El backend estará disponible en: `http://localhost:8000`
- API: `http://localhost:8000/api/`
- Admin: `http://localhost:8000/admin/` (opcional, crear superusuario primero)

## Paso 5: Instalar Dependencias del Frontend

Abre **otra terminal** y navega a la carpeta frontend:

```bash
cd frontend
npm install
```

## Paso 6: Iniciar el Servidor Frontend

```bash
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

## ✅ Verificar que Funciona

1. Abre `http://localhost:5173` en tu navegador
2. Deberías ver la pantalla de login "Inventario CBVSIM"
3. Ingresa un nombre de responsable
4. Deberías ver el dashboard con los 6 vehículos

## 🔧 Solución de Problemas

### Error: "Module not found" en el backend
```bash
pip install --upgrade -r requirements.txt
```

### Error: "Cannot find module" en el frontend
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Error de CORS
Verifica que en `inventario_bomberos/settings.py` esté:
```python
CORS_ALLOW_ALL_ORIGINS = True  # Solo en desarrollo
```

### La API no responde
Verifica que el backend esté corriendo en el puerto 8000:
```bash
python manage.py runserver 0.0.0.0:8000
```

## 📱 Acceso desde Tablet

1. Asegúrate de que ambos servidores estén corriendo
2. Obtén la IP de tu PC:
   ```bash
   ipconfig  # Windows
   ```
3. En la tablet, abre: `http://IP_DEL_PC:5173`
4. Si hay problemas de CORS, agrega la IP de la tablet en `settings.py`:
   ```python
   CORS_ALLOWED_ORIGINS = [
       "http://IP_TABLET:5173",
   ]
   ```
