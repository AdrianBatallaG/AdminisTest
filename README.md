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

## Laravel Cloud (monorepo)

Laravel Cloud detecta frameworks desde la raiz. Como la app Laravel vive en `API/`, este repositorio incluye un `composer.lock` en raiz para habilitar deteccion.

En la app de Laravel Cloud usa un **Build Script** para desplegar desde `API/`:

```bash
mkdir /tmp/monorepo_tmp
repos=("API" "Frontend")

for item in "${repos[@]}"; do
    mv $item /tmp/monorepo_tmp/
done

cp -Rf /tmp/monorepo_tmp/API/{.,}* .
rm -rf /tmp/monorepo_tmp

composer install --no-dev --optimize-autoloader
php artisan package:discover --ansi
php artisan config:cache
php artisan route:cache
```
