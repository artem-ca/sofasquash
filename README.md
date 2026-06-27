# Squash Portal

Интерактивный русскоязычный портал о сквоше: правила, тактика, энциклопедия ракеток, глоссарий и блог.

**Production:** [sofasquash.ru](https://sofasquash.ru)

---

## Что это

Squash Portal — статический веб-сайт для игроков и тренеров. Контент и интерактивные инструменты собраны в одном месте: от официальных правил до каталога из 250+ ракеток с фильтрами и сравнением.

Сайт работает как PWA и сохраняет базовую функциональность офлайн — удобно в клубах с нестабильным интернетом.

---

## Разделы

| Маршрут | Описание |
|---------|----------|
| `/` | 3D-схема корта и тактический планшет |
| `/rules` | 14 глав правил, квиз, виджет переподачи (Rule 2.7) |
| `/racquets` | Каталог ракеток с фильтрами и сравнением до 5 моделей |
| `/tactics` | Разбор 6 типов ударов с SVG-анимацией |
| `/glossary` | 26 терминов с алфавитным рубрикатором |
| `/blog` | Статьи в Markdown с front matter |

---

## Стек

| | |
|---|---|
| Framework | Next.js 16 (App Router, static export) |
| UI | React 19, Tailwind CSS 4 |
| Compiler | React Compiler |
| Content | gray-matter, marked, isomorphic-dompurify |
| Analytics | Яндекс.Метрика |
| Hosting | GitHub Pages |

Сборка — полностью статическая (`output: 'export'`). Серверного runtime нет.

---

## Структура репозитория

```
app/                  # Роуты Next.js App Router
  */page.js           # Серверные страницы (metadata, SEO)
  */*Client.js        # Клиентская интерактивная логика
  sitemap.js          # Генерация sitemap.xml при сборке
components/           # UI-компоненты
data/                 # Статические данные (ракетки, тактика, глоссарий, корт)
posts/                # Markdown-статьи блога
public/               # PWA, robots.txt, изображения
utils/                # Утилиты
.github/workflows/    # CI/CD → GitHub Pages
```

### Паттерн Server / Client split

Страницы с интерактивностью разделены на два файла:

- `page.js` — экспорт `metadata`, серверный рендер там, где это возможно
- `*Client.js` — `'use client'`, состояние, фильтры, анимации

Так сохраняется SEO на статическом экспорте без отказа от клиентской логики.

---

## Данные

| Файл | Содержимое |
|------|------------|
| `data/racquets.js` | 254 модели, 13 брендов |
| `data/glossary.js` | 26 терминов |
| `data/tactics.js` | 6 типов ударов |
| `data/court.js` | Зоны и размеры 3D-корта |

Бренды ракеток: Black Knight, Dunlop, Eye, Harrow, Head, Karakal, Oliver, Prince, Salming, Tecnifibre, Unsquashable, Wilson, Xamsa.

---

## Быстрый старт

**Требования:** Node.js 20+, npm

```bash
git clone <repo-url>
cd squash
npm ci
npm run dev
```

Приложение откроется на [http://localhost:3000](http://localhost:3000).

### Скрипты

| Команда | Действие |
|---------|----------|
| `npm run dev` | Dev-сервер |
| `npm run build` | Статическая сборка → `out/` |
| `npm run start` | Просмотр production-сборки |
| `npm run lint` | ESLint |

---

## Деплой

Деплой автоматический: push в `main` → GitHub Actions → GitHub Pages.

```yaml
# .github/workflows/deploy.yml
npm ci → npm run build → upload out/ → deploy-pages
```

Кастомный домен задаётся через `public/CNAME` (`sofasquash.ru`).

---

## Добавление контента

### Статья в блог

1. Создайте `posts/my-article-slug.md`
2. Добавьте front matter:

```yaml
---
title: 'Заголовок'
date: '2026-06-27'
author: 'Имя автора'
summary: 'Краткое описание для карточки'
---
```

3. Страница появится на `/blog/my-article-slug`, URL автоматически попадёт в sitemap.

### Ракетка в каталог

Добавьте объект в `data/racquets.js` по образцу существующих записей. Изображение — в `public/images/racquets/<brand>/`.

Фильтры по брендам генерируются динамически из массива — отдельно их обновлять не нужно.

---

## Конвенции кода

- Одинарные кавычки для строк
- `localStorage` — только внутри `try/catch`
- Навигация — через `<Link>` из `next/link`
- Тёмная тема — без FOUC (инициализация в inline-скрипте в `layout.js`)
- Markdown в блоге — рендер через `marked` + санитизация `DOMPurify`

---

## SEO и PWA

- **Sitemap:** `app/sitemap.js` → `/sitemap.xml` при сборке
- **Robots:** `public/robots.txt`
- **Open Graph / Twitter Cards:** `app/layout.js`
- **Schema.org:** JSON-LD на странице `/racquets`
- **PWA:** `public/manifest.json`, `public/sw.js`, регистрация в `ServiceWorkerRegister`

---

## Переменные окружения

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `NEXT_PUBLIC_YANDEX_METRICA_ID` | ID счётчика Яндекс.Метрики | `109839456` |

Файл `.env.local` не коммитится.

---

## Лицензия

Приватный проект. Все права защищены.
