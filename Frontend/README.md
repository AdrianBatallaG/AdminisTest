# Sistema Parroquial - Frontend

Frontend en React + Vite para consumir la API Laravel.

## Requisitos

- Node.js 18+
- API Laravel disponible en `http://localhost:8000`

## Variables de entorno

Crea `.env` basado en `.env.example`:

```env
VITE_API_URL=http://localhost:8000/api
VITE_USE_MOCK_AUTH=false
```

## Desarrollo local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Flujos implementados

- Registro de usuario.
- Login con token Sanctum.
- Verificacion de correo via enlace firmado.
- Reenvio de verificacion desde login.
- Dashboard por rol (`usuario`, `editor`, `admin`).
- Panel admin para cambiar rol de usuarios.

## Endpoints esperados

- `POST /api/register`
- `POST /api/login`
- `POST /api/logout`
- `GET /api/me`
- `POST /api/email/verification-notification`
- `GET /api/email/verify/{id}/{hash}`
- `GET /api/admin/roles`
- `GET /api/admin/users`
- `PATCH /api/admin/users/{id}/role`