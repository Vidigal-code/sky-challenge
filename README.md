# Cinemais - API de Catálogo e Favoritos

🎬 **API RESTful para plataforma de streaming** desenvolvida seguindo os princípios de **Clean Architecture**, **SOLID** e **Domain-Driven Design (DDD)**.

## 📋 Sobre o Projeto

Sistema backend para gerenciamento de catálogo de mídias (filmes e séries) e listas de favoritos de usuários, implementado com as melhores práticas de desenvolvimento e arquitetura de software.

## 🚀 Tecnologias e Arquitetura

- **Node.js** + **TypeScript** - Base sólida e type-safe
- **NestJS** - Framework robusto com injeção de dependências nativa
- **Docker** + **Docker Compose** - Containerização completa
- **Jest** - Testes unitários e de integração
- **PostgreSQL** - Banco de dados relacional

## 🏗️ Princípios Aplicados

### **Clean Architecture**
- Separação clara entre camadas (Domain, Application, Infrastructure)
- Inversão de dependências
- Independência de frameworks e ferramentas externas

### **SOLID Principles**
- **S**ingle Responsibility - Cada classe possui uma única responsabilidade
- **O**pen/Closed - Aberto para extensão, fechado para modificação
- **L**iskov Substitution - Substituição de objetos por suas subclasses
- **I**nterface Segregation - Interfaces específicas e coesas
- **D**ependency Inversion - Dependência de abstrações, não implementações

### **Domain-Driven Design (DDD)**
- Modelagem rica do domínio
- Agregados e entidades bem definidas
- Repositórios para abstração de persistência
- Services de domínio e aplicação

## 🎯 Funcionalidades

### **Catálogo de Mídias** (`/media`)
- ✅ **POST** - Adicionar filme/série ao catálogo
- ✅ **GET** - Listar todo o catálogo
- ✅ **GET** `/:id` - Buscar mídia específica

### **Favoritos do Usuário** (`/users/:userId/favorites`)
- ✅ **POST** - Adicionar mídia aos favoritos
- ✅ **GET** - Listar favoritos do usuário
- ✅ **DELETE** `/:mediaId` - Remover dos favoritos

## 🔧 Recursos Técnicos

- 📦 **Containerização** completa com Docker
- 🧪 **Testes unitários** e de integração com Jest
- 🛡️ **Validação** robusta de dados (DTOs + class-validator)
- 🚨 **Tratamento de erros** centralizado
- 📚 **Documentação** automática com Swagger/OpenAPI
- 🔍 **Logs** estruturados
- ⚡ **Performance** otimizada

## 🏃‍♂️ Quick Start

```bash
# Subir toda a aplicação
docker-compose up -d

# Rodar testes
npm run test

# Acessar documentação
http://localhost:3000/api
```

## 📐 Estrutura do Projeto

```
src/
├── domain/           # Entidades, VOs, Agregados
├── application/      # Use Cases, DTOs, Ports
├── infrastructure/   # Repositories, Controllers
└── shared/          # Utilitários e tipos compartilhados
```

---

*Desenvolvido seguindo as melhores práticas de **Clean Code**, **SOLID** e **DDD** para garantir código maintível, testável e escalável.*