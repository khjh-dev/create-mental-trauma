# Create: Mental Trauma — пак с автообновлением

Собран **из твоего инстанса** `PrismLauncher\instances\Create- Mental Trauma`.
Формат — [packwiz](https://packwiz.infra.link/): игрок один раз импортирует инстанс, дальше при каждом
запуске игры клиент докачивает только изменившиеся файлы. Сервер тянет те же файлы из того же
источника, поэтому «у меня работает, а у него нет» не бывает.

## Две раздачи

Пак разделён на два отдельных репозитория (этот каталог — мастер-исходник, из него они собираются):

| Репозиторий | Для кого | Адрес пака | Модов |
|---|---|---|---|
| [create-mental-trauma-client](https://github.com/khjh-dev/create-mental-trauma-client) | игроки (Prism) | `https://khjh-dev.github.io/create-mental-trauma-client/pack.toml` | 280 |
| [create-mental-trauma-server](https://github.com/khjh-dev/create-mental-trauma-server) | сервер | `https://khjh-dev.github.io/create-mental-trauma-server/pack.toml` | 223 |

Разделение по `side`: в клиентский пак идут `client` + `both`, в серверный — `server` + `both`.
Конфиги (`config/`, `kubejs/`, `defaultconfigs/`) есть **в обоих**; ресурспаки и шейдеры — только в клиентском.

Пересобрать раздачи после правок мастера:

```powershell
powershell -File scripts\split-packs.ps1 `
  -Source "E:\dsh\create-mental-trauma-pack" `
  -ClientOut "E:\dsh\create-mental-trauma-client" `
  -ServerOut "E:\dsh\create-mental-trauma-server"
# затем в каждой папке: git add -A; git commit -m update; git push
```

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

1. **Аккаунт GitHub.** Если его нет — https://github.com/signup (нужна только почта).
   Логин, который выберешь, станет частью адреса: `https://<логин>.github.io/...`.
2. **Пустой репозиторий.** https://github.com/new → имя `create-mental-trauma`, **Public**,
   без README/gitignore/license. Скопируй адрес вида `https://github.com/<логин>/create-mental-trauma.git`.
3. **Залить пак и всё настроить одной командой** (git уже установлен, 2.56.1):
   ```powershell
   powershell -ExecutionPolicy Bypass -File scripts\setup-pages.ps1 `
     -Remote "https://github.com/<логин>/create-mental-trauma.git" `
     -Instance "C:\Users\smeta\AppData\Roaming\PrismLauncher\instances\Create- Mental Trauma"
   ```
   Скрипт: прописывает remote, вычисляет адрес Pages, вшивает его в пак, в `instance.cfg`
   твоего Prism (с бэкапом) и собирает zip для игроков. Дальше он же печатает команду `git push`.
4. **Включить Pages.** После первого `git push`: репозиторий → Settings → Pages → Source:
   **GitHub Actions** (workflow уже лежит в `.github/workflows/pages.yml`). Через минуту пак
   доступен по адресу из `pack-url.txt`.

5. **Игрокам** — zip-инстанс, который уже собрал шаг 3:
   `dist\Create-Mental-Trauma-prism.zip` → Add Instance → Import from zip.
   Пересобрать после смены адреса: `powershell -File scripts\build-client-zip.ps1`.

Подключить автообновление к другому инстансу (тестовому):
`powershell -File scripts\enable-in-instance.ps1 -Instance "<путь>" -Url "<адрес pack.toml>"`

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
