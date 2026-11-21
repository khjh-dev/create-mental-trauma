# Create: Mental Trauma — пак с автообновлением

Собран **из твоего инстанса** `PrismLauncher\instances\Create- Mental Trauma`.
Формат — [packwiz](https://packwiz.infra.link/): игрок один раз импортирует инстанс, дальше при каждом
запуске игры клиент докачивает только изменившиеся файлы. Сервер тянет те же файлы из того же
источника, поэтому «у меня работает, а у него нет» не бывает.

## Что внутри

| | |
|---|---|
| Minecraft / NeoForge | 1.21.1 / 21.1.265 (как у тебя в `mmc-pack.json`) |
| Модов | 313 jar: **288 с автообновлением** (опознаны на Modrinth по sha512) + **25 кастомных** (положены в пак файлами) |
| Конфиги | 1005 файлов `config/`, 148 `kubejs/` |
| Ресурспаки / шейдеры | 193 / 16 файлов |
| Размер пака | ~58 МБ (моды с Modrinth качаются отдельно их CDN) |
| Клиентских модов | 88 помечены `side = "client"` — на сервер не ставятся |
| Серверных | 33 помечены `side = "server"` |

**Проверено на реальном сервере:** `packwiz -s server` ставит 225 модов, сервер стартует
`Done (5.010s)!`, FATAL — 0.

### Что в пак не попало (сознательно)

* `emotes/` — 240 МБ клиентских эмоций Emotecraft;
* `xaero/` — твои путевые точки;
* `saves/`, `screenshots/`, `logs/`, `crash-reports/`, `downloads/`, кеши (`cache`, `.cache`, `vista_*`, `quickskin*`);
* `options.txt`, `servers.dat`, `usercache.json` — личные настройки;
* `_IAS_ACCOUNTS_DO_NOT_SEND_TO_ANYONE` — туда точно не надо;
* `*.jar.disabled` и `*.jar.bak` в `mods/` (cbcatfix, cbcwhistle, cbc_at, medsystem.bak).

Если что-то из этого нужно раздавать — скажи, добавлю в пак.

### Что пришлось поправить по ходу

* `Fog` (клиентский мод) крашил сервер: `Attempted to load class net/minecraft/client/KeyMapping
  for invalid dist DEDICATED_SERVER` → помечен `side = "client"`;
* 6 Fabric-модов (`Fractal Lightning`, `FoggyBorder`, `ImmersiveThunder`, `planetarium`,
  `bc_particle`, `pulse-trims`) на NeoForge-сервере не грузятся → тоже `client`;
* `medsystem_audio_tweaks` / `medsystem_hud_tweaks` — клиентские, в `scripts/file-sides.json`.

## Как выпускать обновление

Ты меняешь сборку у себя в Prism как обычно, потом:

```powershell
# 1. пересобрать пак из инстанса (хеши, новые моды, конфиги)
powershell -ExecutionPolicy Bypass -File scripts\import-instance.ps1 `
  -Instance "C:\Users\smeta\AppData\Roaming\PrismLauncher\instances\Create- Mental Trauma"

# или только обновить версии модов, не трогая инстанс
powershell -ExecutionPolicy Bypass -File scripts\update-mods.ps1

# 2. опубликовать
git add -A
git commit -m "update pack"
git push

# 3. перезапустить сервер — он сам подтянет новую версию при старте
powershell -ExecutionPolicy Bypass -File scripts\start-server.ps1 -ServerJar server.jar
```

Дальше:

* **сервер** обновится при следующем запуске `start-server.ps1`;
* **игроки** — при следующем запуске игры, ничего нажимать не нужно;
* **кто уже в игре** — не получит, packwiz работает на старте. Нужен рестарт/перезаход.

Откат — `git revert` + пуш, игроки вернутся на прошлую версию при следующем запуске.

## Первичная настройка (один раз)

1. **Хостинг.** Пак — это статика. GitHub: залей папку в репозиторий, Settings → Pages →
   Source: **GitHub Actions** (workflow лежит в `.github/workflows/pages.yml`), получишь
   `https://<логин>.github.io/<репо>/pack.toml`. 58 МБ — в лимиты Pages влезает.
   Подойдёт и свой nginx, и Netlify — главное HTTPS и `pack.toml` в корне.
2. Адрес запиши в `pack-url.txt`.
3. **Свой инстанс** переведи на автообновление:
   ```powershell
   powershell -ExecutionPolicy Bypass -File scripts\enable-in-instance.ps1 `
     -Instance "C:\Users\smeta\AppData\Roaming\PrismLauncher\instances\Create- Mental Trauma" `
     -Url "https://<твой-хост>/pack.toml"
   ```
   (`instance.cfg` забэкапится в `instance.cfg.bak`). После этого твой Prism при каждом запуске
   сам синхронизируется с паком — то, что ты меняешь в инстансе, остаётся источником правды.
4. **Игрокам** — zip-инстанс с уже прописанной командой:
   ```powershell
   powershell -ExecutionPolicy Bypass -File scripts\build-client-zip.ps1
   ```
   получится `dist\Create-Mental-Trauma-prism.zip` → Add Instance → Import from zip.

## Структура

```
pack.toml                  версии MC/NeoForge + хеш индекса
index.toml                 все файлы с sha256 (генерируется, руками не править)
mods/*.pw.toml             288 метаданных модов (url, sha512, версия, side)
mods/*.jar                 25 кастомных модов файлами
config/ kubejs/ resourcepacks/ shaderpacks/ fancymenu_data/
scripts/
  import-instance.ps1      собрать пак из инстанса Prism (главный инструмент)
  update-mods.ps1          обновить версии модов до последних совместимых
  packwiz-refresh.ps1      пересобрать index.toml
  start-server.ps1 / .sh   синхронизация серверной части + запуск
  enable-in-instance.ps1   прописать автообновление в инстанс
  build-client-zip.ps1     zip для игроков
  file-sides.json          ручные пометки client/server для отдельных файлов
```

Добавить конфиг или датапак: положить файл в `config/` (или `defaultconfigs/`) и запустить
`packwiz-refresh.ps1`. Файл нужен только одной стороне — прописать ему сторону в
`scripts/file-sides.json`.

## Если что-то сломалось

| Симптом | Причина |
|---|---|
| `403` от `api.github.com` | Лимит GitHub API. Скрипты используют локальный `packwiz-installer.jar` с `--bootstrap-no-update` — не возникает |
| Сервер падает на `KeyMapping ... DEDICATED_SERVER` | Клиентский мод попал на сервер: добавь его имя в `-ForceClient` в `import-instance.ps1` или `side` в `file-sides.json` |
| `Mod list mismatch` у игрока | Старая версия пака: перезапуск игры; проверить, что pre-launch команда включена |
| Сервер не видит новые моды | `start-server.ps1` не запускался либо в `pack-url.txt` старый адрес |

Серверные jar'ы, которые packwiz ставит сам, лежат в `mods/` рядом с сервером: если положить туда
что-то руками, installer это удалит при следующей синхронизации.
