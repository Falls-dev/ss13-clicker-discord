# Space Station Idle

Игра в стиле Melvor Idle во вселенной Space Station 13. Этот форк запускается как **Discord Activity** на `https://spacestation13clicker.ss13.site`.

## Что нужно

- Node.js 22+
- nginx с сертификатом Let's Encrypt на `spacestation13clicker.ss13.site`
- приложение Discord (Client ID и Client Secret уже в `.env`)

## Запуск

```
npm install
npm run build
npm start
```

Сервер слушает `localhost:4443`. Снаружи его должен закрывать nginx.

Для разработки с автоперезагрузкой:

```
npm run serve
```

Локальный браузер: `LOCAL_PLAYER=1` в `.env`. Если `LOCAL_PLAYER=0`, игра открывается только как Discord Activity, а `DEBUG` включить нельзя.
Режим отладки: `LOCAL_PLAYER=1` и `DEBUG=1` в `.env` (или `?debug=1` при включённом `LOCAL_PLAYER`).

## nginx

Конфиг лежит в `deploy/nginx-spacestation13clicker.conf`.

Пример установки на сервере:

```
sudo ln -s /path/to/ss13-clicker-discord/deploy/nginx-spacestation13clicker.conf /etc/nginx/sites-enabled/spacestation13clicker.ss13.site.conf
sudo certbot --nginx -d spacestation13clicker.ss13.site
sudo nginx -t && sudo systemctl reload nginx
```

Схема:

`браузер / Discord` → `https://spacestation13clicker.ss13.site` (443) → nginx → `http://127.0.0.1:4443`

## Discord Activity

В [Discord Developer Portal](https://discord.com/developers/applications):

1. Включить Activities
2. OAuth2 Redirect: `https://127.0.0.1`
3. URL Mapping: `/` → `spacestation13clicker.ss13.site` (без порта)

После входа Discord прогресс пишется в локальную SQLite (`data/saves.sqlite`) по ID пользователя. Телефон и компьютер с одним Discord-аккаунтом видят одно сохранение.

## Язык

В боковой панели и в настройках есть переключатель **EN / RU**.

## Полезные команды

| Команда | Что делает |
| --- | --- |
| `npm run serve` | Локальная разработка |
| `npm run build` | Сборка в `dist/` |
| `npm start` | Сервер на порту 4443 |
| `npm run discord` | Сборка + сервер |

Подробности по добавлению работ и таблиц дропа — в английском `README.md`.
