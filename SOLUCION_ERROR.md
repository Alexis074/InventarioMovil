# ⚠️ Solución: Error en http://localhost:5173

## Problema Detectado

El error ocurre porque **Node.js no está instalado** o no está en el PATH del sistema.

## ✅ Solución Paso a Paso

### 1. Instalar Node.js

1. **Descarga Node.js** desde: https://nodejs.org/
   - Recomendado: Versión LTS (Long Term Support)
   - Ejemplo: Node.js 20.x LTS

2. **Instala Node.js:**
   - Ejecuta el instalador descargado
   - Acepta todas las opciones por defecto
   - **IMPORTANTE**: Asegúrate de marcar la opción "Add to PATH" durante la instalación

3. **Verifica la instalación:**
   - Abre una **nueva terminal** (cierra y abre PowerShell/CMD de nuevo)
   - Ejecuta:
     ```bash
     node --version
     npm --version
     ```
   - Deberías ver números de versión (ej: v20.11.0 y 10.2.4)

### 2. Instalar Dependencias del Frontend

Una vez instalado Node.js:

```bash
cd "c:\Users\Alexis\Desktop\App Inventario\frontend"
npm install
```

Esto instalará todas las dependencias necesarias (React, Vite, Tailwind, etc.)

### 3. Iniciar el Servidor Frontend

```bash
npm run dev
```

Deberías ver algo como:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 4. Abrir en el Navegador

Abre: `http://localhost:5173`

## 🔍 Verificar que Todo Funciona

### Backend debe estar corriendo:
```bash
# En otra terminal
cd "c:\Users\Alexis\Desktop\App Inventario"
python manage.py runserver 0.0.0.0:8000
```

### Frontend debe estar corriendo:
```bash
# En otra terminal
cd "c:\Users\Alexis\Desktop\App Inventario\frontend"
npm run dev
```

## 📋 Checklist

- [ ] Node.js instalado
- [ ] `node --version` funciona
- [ ] `npm --version` funciona
- [ ] `npm install` ejecutado en la carpeta frontend
- [ ] Backend corriendo en puerto 8000
- [ ] Frontend corriendo en puerto 5173
- [ ] Navegador abierto en http://localhost:5173

## 🆘 Si Sigue Sin Funcionar

1. **Abre la consola del navegador** (F12)
2. Ve a la pestaña **"Console"**
3. Copia los errores que aparezcan
4. Verifica:
   - ¿El backend está corriendo?
   - ¿Hay errores de CORS?
   - ¿Hay errores de módulos faltantes?

## 📞 Comandos Útiles

```bash
# Verificar Node.js
node --version
npm --version

# Instalar dependencias
cd frontend
npm install

# Iniciar desarrollo
npm run dev

# Verificar que el puerto esté libre
netstat -ano | findstr :5173
```
