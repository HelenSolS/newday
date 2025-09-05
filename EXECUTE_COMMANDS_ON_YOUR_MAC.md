# ВАЖНО: Выполняйте эти команды на вашем Mac, а не в этом интерфейсе!

## Последовательность команд для развертывания NewDay Platform

### 1. Откройте терминал на вашем Mac
- Нажмите Cmd + Пробел
- Введите "Terminal" и нажмите Enter

### 2. Перейдите в директорию проекта
```bash
cd /Users/lena/NewDay
```

### 3. Создайте архив с файлами проекта
```bash
tar -czf newday-platform-deploy.tar.gz src docker-compose.yml .env server_deploy.sh
```

### 4. Скопируйте архив на сервер
```bash
scp newday-platform-deploy.tar.gz root@45.153.189.27:/root/
```
(Введите пароль когда будет запрошено: 9T(H&Yf2sEhz)

### 5. Подключитесь к серверу
```bash
ssh root@45.153.189.27
```
(Введите пароль когда будет запрошено: 9T(H&Yf2sEhz)

### 6. После подключения к серверу выполните эти команды:

#### Создайте директорию проекта:
```bash
mkdir -p /var/www/newday
```

#### Переместите архив в директорию проекта:
```bash
mv /root/newday-platform-deploy.tar.gz /var/www/newday/
```

#### Перейдите в директорию проекта:
```bash
cd /var/www/newday
```

#### Распакуйте архив:
```bash
tar -xzf newday-platform-deploy.tar.gz
```

#### Установите права доступа:
```bash
chmod +x server_deploy.sh
chmod +x src/backend/*.sh
```

#### Запустите скрипт развертывания:
```bash
./server_deploy.sh
```

### 7. После развертывания проверьте работу:

#### Проверьте запущенные контейнеры:
```bash
docker ps
```

#### Протестируйте API:
```bash
curl -s https://api.newday.neyronikol.ru/health
```

## Если возникнут ошибки:

1. Если контейнеры не запускаются:
   ```bash
   docker compose down
   docker compose up -d --build
   ```

2. Если проблемы с базой данных:
   ```bash
   # Удалите существующую базу данных
   rm -f src/backend/data/newday_platform.db
   
   # Перезапустите контейнеры
   docker compose down
   docker compose up -d --build
   ```

## После успешного развертывания:

1. Преобразуйте вебинар в блоки:
   ```bash
   docker exec -it newday-backend python convert_webinar_to_blocks.py
   ```

2. Заполните базу данных начальным контентом:
   ```bash
   curl -X POST https://api.newday.neyronikol.ru/populate-database
   ```

3. Проверьте новые эндпоинты через Swagger UI:
   https://api.newday.neyronikol.ru/docs

---
**ВАЖНО**: Все эти команды должны выполняться на вашем Mac или на сервере через SSH.
Не пытайтесь выполнять их в этом интерфейсе - он не может их выполнить.