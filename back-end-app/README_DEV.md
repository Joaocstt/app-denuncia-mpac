# Guia de Desenvolvimento - Backend App Denúncia (Laravel)

Este documento serve como referência técnica para programadores que atuarão na manutenção ou evolução do backend do Sistema de Denúncia.

## 🏗 Arquitetura do Sistema

O projeto utiliza **Laravel 12** com uma separação clara de responsabilidades seguindo o padrão **Service Layer**:

- **Controllers**: Localizados em `app/Http/Controllers`. Responsáveis apenas por receber a requisição, chamar o serviço adequado e retornar a resposta JSON. São propositalmente "magros" para facilitar a leitura.
- **Services**: Localizados em `app/Services`. Contêm toda a lógica de negócio, processamento de arquivos (uploads), geocodificação e regras de persistência.
- **Middlewares**: Localizados em `app/Http/Middleware`. Implementam filtros de segurança e validações globais.
- **Models**: Localizados em `app/Models`. Utilizam Eloquent para interação com o banco de dados PostgreSQL.

## 🔒 Segurança (API Authentication)

Todos os endpoints da API são protegidos pelo `ApiTokenMiddleware`.

### Token de Acesso
O token deve ser enviado em cada requisição através do header:
`X-API-Token: [VALOR_DEFINIDO_NO_ENV]`

Para alterar o token, modifique a variável `API_ACCESS_TOKEN` no arquivo `.env`.

## 📡 Endpoints da API

O prefixo base é `/api/denuncias` (registrado em `routes/api.php`).

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `POST` | `/` | Cria uma nova denúncia (aceita `multipart/form-data`) |
| `GET` | `/minhas` | Lista as denúncias enviadas (ordenadas por data DESC) |
| `GET` | `/mapa` | Lista denúncias com status 'aprovada' e coordenadas |
| `POST` | `/transcribe` | Simula a transcrição de um arquivo de áudio |

## 📦 Configuração do Ambiente (Docker)

O projeto roda em containers Docker para garantir paridade entre ambientes:

1.  **Subir ambiente**: `docker compose up -d`
2.  **Acessar container**: `docker exec -it denuncia-backend bash`
3.  **Executar Migrations**: `php artisan migrate`
4.  **Caminho dos Uploads**: As mídias são salvas em `storage/app/public/uploads` e expostas via link simbólico.

## 📅 Manutenabilidade

Para garantir que o código continue fácil de manter:
1.  **Mantenha os Controllers limpos**. Se houver lógica de decisão, mova para os `Services`.
2.  **Validate os dados** usando `FormRequests` em futuras expansões.
