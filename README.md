# Sistema de Denúncia - MPAC 🛡️

Este é um sistema de denúncias anônimas desenvolvido para o Ministério Público do Acre (MPAC), permitindo que cidadãos relatem ocorrências de infraestrutura, iluminação e outros problemas urbanos de forma simples e segura.

## 🚀 Arquitetura do Projeto

O projeto é dividido em duas partes principais:
1.  **Back-end:** API Laravel 11 rodando em Docker (PostgreSQL).
2.  **Front-end:** Aplicativo Mobile desenvolvido com React Native (Expo) e TypeScript.

---

## 🛠️ Pré-requisitos

Antes de começar, você precisará ter instalado:
*   [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
*   [Node.js](https://nodejs.org/) (recomendado v18+)
*   [Expo Go](https://expo.dev/expo-go) no seu celular (para testar o app)

---

## 📡 Configuração do Back-end (Laravel)

1.  Entre na pasta do servidor:
    ```bash
    cd back-end-app
    ```

2.  Crie o arquivo de ambiente:
    ```bash
    cp .env.example .env
    ```

3.  Suba os containers do Docker:
    ```bash
    docker-compose up -d
    ```

4.  Instale as dependências e configure o banco:
    ```bash
    docker exec denuncia-backend composer install
    docker exec denuncia-backend php artisan key:generate
    docker exec denuncia-backend php artisan migrate
    docker exec denuncia-backend php artisan storage:link
    ```

> [!IMPORTANT]
> No arquivo `.env` do back-end, certifique-se de que o `APP_URL` aponta para o seu IP local (ex: `http://192.168.1.14:8000`) para que o celular consiga acessar as imagens e a API.

---

## 📱 Configuração do Front-end (App Mobile)

1.  Entre na pasta do aplicativo:
    ```bash
    cd app-denuncia
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Configure o arquivo `.env` com o IP da sua máquina:
    ```bash
    # Exemplo de .env
    EXPO_PUBLIC_API_URL=http://192.168.1.14:8000/api
    EXPO_PUBLIC_API_TOKEN=mpac
    ```

4.  Inicie o Expo:
    ```bash
    npm start
    ```

5.  Escaneie o QR Code com o aplicativo **Expo Go** no seu celular ou pressione `a` para rodar no Android Emulator.

---

## ✨ Funcionalidades Principais

*   **Denúncia Anônima:** Identificação única por dispositivo (UUID), sem necessidade de login.
*   **Gestão de Evidências:** Anexo de fotos e áudio (com transcrição automática).
*   **Mapa de Ocorrências:** Visualização global de denúncias aprovadas com filtros por categoria.
*   **Minhas Denúncias:** Acompanhamento do status das denúncias criadas no dispositivo.
*   **Modo Offline:** Sincronização automática de denúncias quando houver conexão com a internet.

---

## 🛠️ Comandos Úteis (Back-end)

*   **Limpar Cache:** `docker exec denuncia-backend php artisan optimize:clear`
*   **Ver Logs:** `docker exec denuncia-backend tail -f storage/logs/laravel.log`
*   **Acessar Banco:** `docker exec -it denuncia-db psql -U root -d denuncia_db`

---

Desenvolvido pelo NAT.
