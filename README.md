# NewAdminis (Monoproyecto)

Este repositorio contiene:

- `API/`: backend Laravel 12 + Sanctum + roles + verificacion por Resend.
- `Frontend/`: app React/Vite conectada a la API.

## Levantar todo en local

1. Backend

```bash
cd API
copy .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

2. Frontend

```bash
cd Frontend
copy .env.example .env
npm install
npm run dev
```

## URLs locales

- API: `http://localhost:8000`
- Frontend: `http://localhost:5173`