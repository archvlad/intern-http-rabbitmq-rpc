# Тестовое задание на должность "Разработчик NodeJS" GREEN-API

## Описание

Сервис rpc-client (M1) через HTTP получает запрос на генерацию рандомного изображения лица, запрос помещается в очередь RabbitMQ. После этого rpc-server (M2) берет сообщение из очереди и генерирует изображение, используя https://this-person-does-not-exist.com. После генерации изображение отправляется в очередь RabbitMQ. Сервис rpc-client получает изображение из очереди и отправляет его в HTTP ответе. 
 
## Запуск 
`docker-compose up`

На http://locahost:3000/ располагается веб-панель, где можно проверить работу API.

![image](https://github.com/archvlad/intern-http-rabbitmq-rpc/assets/42550885/7cfe45b0-1b57-473d-a774-8261acde1b26)

## API

### GET /avatar

Параметры:
- gender
- age
- etnic

Доступные значения можно узнать через веб-панель.
