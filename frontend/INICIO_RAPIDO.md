# 🚀 Inicio Rápido - Frontend

## Si es la primera vez:

1. **Abre una terminal en la carpeta frontend:**
   ```bash
   cd "c:\Users\Alexis\Desktop\App Inventario\frontend"
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abre tu navegador en:**
   ```
   http://localhost:5173
   ```

## Si ya instalaste las dependencias:

Solo ejecuta:
```bash
npm run dev
```

## ⚠️ Errores Comunes

### Error: "Cannot find module"
```bash
# Elimina node_modules y reinstala
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port 5173 already in use"
```bash
# Cierra el proceso que está usando el puerto o usa otro puerto
npm run dev -- --port 5174
```

### La página está en blanco
1. Abre la consola del navegador (F12)
2. Revisa los errores en la pestaña "Console"
3. Verifica que el backend esté corriendo en `http://localhost:8000`

## 🔍 Verificar que Funciona

1. Deberías ver la pantalla de login "Inventario CBVSIM"
2. Ingresa un nombre (ej: "Grupo A")
3. Deberías ver el dashboard con los vehículos

## 📱 Acceso desde Tablet

1. Asegúrate de que ambos servidores estén corriendo:
   - Backend: `python manage.py runserver 0.0.0.0:8000`
   - Frontend: `npm run dev`

2. Obtén la IP de tu PC:
   ```bash
   ipconfig
   ```

3. En la tablet, abre: `http://IP_DEL_PC:5173`
