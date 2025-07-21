## 🗂 Banco de Dados PostgreSQL

Este projeto utiliza **PostgreSQL** como banco de dados relacional para armazenar informações de catálogo e favoritos.

### 📚 Documentação e Modelos

A estrutura do banco, incluindo modelos entidade-relacionamento (MER) e fluxogramas, está disponível no link abaixo:

👉 [Documentação e fluxogramas do banco de dados](https://github.com/Vidigal-code/sky-challenge/tree/main/example/dbexamplefluxograma)

No diretório, você encontrará:

* Diagramas MER e fluxogramas usando **Mermaid**.
* Explicações detalhadas dos relacionamentos e estrutura do banco.

---

## 🐳 Configuração via Docker

O banco é orquestrado com **Docker Compose**, utilizando a imagem oficial do PostgreSQL (v15).
Arquivos relevantes:

* `docker-compose.yml`: `sky-challenge/postgresqldocker/`
* `.env`: `sky-challenge/.env`

### 📁 Estrutura do `docker-compose.yml`

```yaml
version: '3.8'

services:
  db_media:
    image: postgres:15
    env_file:
      - ../.env
    ports:
      - "0.0.0.0:${POSTGRES_PORT:-5432}:5432"
    volumes:
      - ../scriptsqls/init.sql:/docker-entrypoint-initdb.d/init.sql
      - postgres_data:/var/lib/postgresql/data
    networks:
      - db_media_network
    restart: unless-stopped

volumes:
  postgres_data:

networks:
  db_media_network:
    driver: bridge
```

---

## 🔧 Variáveis de Ambiente (.env)

Exemplo de `.env`:

```env
POSTGRES_USER=vidigal
POSTGRES_PASSWORD=test1234
POSTGRES_DB=media_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```

**Importante**:

* Coloque o arquivo `.env` na raiz do projeto: `sky-challenge/.env`
* Use codificação UTF-8.
* Evite espaços em branco extras.

---

## 🚀 Como Executar o Banco

### 1. Pré-requisitos

* Docker + Docker Compose instalados
* Arquivo `.env` corretamente configurado
* Arquivo `init.sql` presente em `sky-challenge/scriptsqls/`

### 2. Inicialização

Navegue até o diretório do Docker Compose:

```bash
cd C:\GITHUB REPOSITORY\sky-challenge\postgresqldocker
```

Execute o serviço com:

```bash
docker-compose --env-file ../.env up -d
```

### 3. Verificações

```bash
docker-compose ps       # Verifica se está rodando
docker-compose logs     # Mostra os logs
```

### 4. Acesso ao Banco

#### Interno (ex: NestJS via TypeORM):

```json
{
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "vidigal",
  "password": "test1234",
  "database": "media_db",
  "entities": ["src/domain/entities/**/*.entity.ts"],
  "synchronize": false
}
```

#### Externo (ex: Navicat, DBeaver):

* Host: `localhost`
* Porta: `5432`
* Database: `media_db`
* Usuário: `vidigal`
* Senha: `test1234`

### 5. Encerrando

```bash
docker-compose down
```

---

## 🛠 Solução de Problemas

### `POSTGRES_PORT` não reconhecido?

1. **Confirme o caminho do `.env`**
   O caminho `../.env` deve apontar para `sky-challenge/.env`.

2. **Use `--env-file` explicitamente**

   ```bash
   docker-compose --env-file ../.env up -d
   ```

3. **Defina no terminal (temporário)**

    * **Windows CMD**:

      ```cmd
      set POSTGRES_PORT=5432
      docker-compose up -d
      ```
    * **PowerShell**:

      ```powershell
      $env:POSTGRES_PORT = "5432"
      docker-compose up -d
      ```
    * **Linux / Git Bash**:

      ```bash
      export POSTGRES_PORT=5432
      docker-compose up -d
      ```

4. **Valor padrão no YAML**
   Já incluso: `${POSTGRES_PORT:-5432}`

---

## 🧱 Integração com DDD

* **Domínio**: Entidades, agregados e repositórios
* **Infraestrutura**: PostgreSQL + TypeORM
* **Script `init.sql`**: Cria as tabelas conforme o MER

---

## 🧯 Dicas e Boas Práticas

* **Não versionar `.env`**: proteja suas credenciais
* **Firewall**: libere a porta do PostgreSQL

```powershell
New-NetFirewallRule -DisplayName "PostgreSQL" -Direction Inbound -Protocol TCP -LocalPort 5432 -Action Allow
```

## 💡 Melhorias Futuras

* Adicionar sistema de **logs avançado**
* Planejar **replicação e escalabilidade**
* Considerar serviços **gerenciados (ex: AWS RDS)**

---