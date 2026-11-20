# Backend Startup Guide

This project is a Laravel 12 application with Inertia + React on the frontend.
The backend is started with Laravel's built-in server, and during development the
project also expects Vite and the queue worker to be running.

## Prerequisites

- PHP 8.2 or newer
- Composer
- Node.js and npm
- MySQL running locally
- A database named `social`

## Project Notes

- Backend routes are defined in `routes/web.php`.
- There is no `routes/api.php` file in this project.
- The app uses database-backed sessions, cache, and queues.
- The existing `.env` is configured for MySQL:
  - `DB_CONNECTION=mysql`
  - `DB_DATABASE=social`
  - `DB_USERNAME=root`
  - `DB_PASSWORD=`

## First-Time Setup

If you are starting from a fresh clone, run:

```bash
composer install
npm install
```

If `.env` does not exist yet, create it from the example file:

```bash
copy .env.example .env
```

Then make sure the app key exists:

```bash
php artisan key:generate
```

## Database Setup

Because the project uses the database for sessions, cache, and queues, run the
migrations before starting the app:

```bash
php artisan migrate
```

## Start the Backend

To start only the Laravel backend server:

```bash
php artisan serve
```

By default, the app is configured to run at:

```text
http://localhost:8000
```

## Recommended Development Start

For normal development, the project already defines a combined command in
`composer.json` that starts:

- Laravel server
- Queue listener
- Vite dev server

Run:

```bash
composer run dev
```

This is the easiest way to run the full backend/frontend development stack.

## Manual Start Option

If you prefer separate terminals, run these commands individually:

```bash
php artisan serve
php artisan queue:listen --tries=1
npm run dev
```

## Useful Checks

If something does not start, check these common issues:

- MySQL is running
- the `social` database exists
- `.env` values match your local database credentials
- migrations completed successfully
- port `8000` is not already in use

## Summary

The usual backend startup flow for this repo is:

1. `composer install`
2. `npm install`
3. configure `.env`
4. `php artisan migrate`
5. `composer run dev`

