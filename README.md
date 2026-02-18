# EISEN App v2

## Setup (5 minutos)

### 1. Instalar dependencias
```bash
npm install
```

### 2. Variables de entorno
```bash
cp .env.local.example .env.local
# Llena las variables con tus keys de Firebase
```

### 3. Correr local
```bash
npm run dev
# Abre http://localhost:3000
```

### 4. Push a GitHub
```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

### 5. Deploy en Netlify
- Conecta el repo en netlify.com
- Build command: `npm run build`
- Publish directory: `.next`
- Agrega las variables de entorno de Firebase

## Páginas disponibles
- `/` → Dashboard
- `/tickets` → Lista de tickets
