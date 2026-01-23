# 🎯 PracBet --- Plataforma Gamificada de Apostas Virtuais por Pontos

**Projeto Full-Stack \| Backend em Java Spring Boot \| Frontend em
React**

> **STATUS: EM DESENVOLVIMENTO**\
> Este projeto é um sistema completo de apostas esportivas com pontos
> virtuais, gamificação avançada, simulação estatística e foco em boas
> práticas arquiteturais.

------------------------------------------------------------------------

# 📌 Visão Geral

O **PracBet** é uma plataforma de apostas **sem dinheiro real**,
construída para aprendizado, entretenimento e experimentação de
estratégias.\
A aplicação é um projeto de longo prazo, servindo como base real para
evolução profissional e demonstração profunda de habilidades Full Stack
--- com forte ênfase no backend Java.

Vídeo de demonstração da plataforma: https://www.youtube.com/watch?v=JYoIaYjB450

------------------------------------------------------------------------

# 🏛️ Arquitetura Geral

## Backend -- Java Spring Boot (Core do Sistema)

-   Java 17\
-   Spring Boot 3\
-   Spring Web\
-   Spring Security (JWT)\
-   Spring Data JPA\
-   PostgreSQL\
-   Maven\
-   Modelo orientado ao domínio e escalabilidade\
-   Camadas claras (Controller → Service → Repository)

O backend é a espinha dorsal do sistema, responsável por: - autenticação
JWT, - gestão completa de apostas, - cálculos de lucro/ROI/unidades, -
ranking global, - busca de partidas reais e odds, - estrutura para modos
PvP e simulações futuras.

------------------------------------------------------------------------

## Frontend -- React + Vite

-   React 18\
-   TypeScript\
-   Tailwind CSS (via Cursor)\
-   Context API (autenticação)\
-   React Router DOM\
-   Arquitetura de componentes\
-   Interface responsiva, moderna e leve

------------------------------------------------------------------------

# 🔥 Principais Diferenciais Técnicos

### Backend pensado para produção

-   DTOs bem definidos\
-   Entidades ricas\
-   Regras de negócio centralizadas em serviços\
-   Segregação clara de camadas\
-   Tokenização JWT profissional\
-   Preparação para real-time (WebSockets)

### Sistema completo de apostas

-   múltiplos mercados suportados:
    -   Match Winner\
    -   Both Teams Score\
    -   Corners Over/Under\
    -   Cards Over/Under\
    -   Shots On Target\
-   cálculo automático de:
    -   unidades,
    -   lucro,
    -   retorno,
    -   ROI.

### Ranking profissional

-   baseado em métricas usadas por tipsters reais.\
-   posição dinâmica por usuário.

### Gamificação real

-   sistema de níveis\
-   evolução por XP\
-   estatísticas completas do usuário

### Estrutura para futuro modo PvP

-   partidas 1v1 estilo "Modo Sobrevivência", usando jogos antigos\
-   simulações e engine própria

------------------------------------------------------------------------

# 🗄️ Banco de Dados

Entidades principais: - **User**\
- **Bet**\
- **Match**\
- **Odds**\
- **User Stats**\
- **Ranking**

------------------------------------------------------------------------

# 🔌 Endpoints da Aplicação (completos e atuais)

## USER `/user`

### POST `/register`

Registrar novo usuário.

### POST `/login`

Autenticação + JWT.

### PUT `/{id}`

Editar username do usuário.

### GET `/`

Listar todos os usuários ativos.

### GET `/{id}`

Buscar usuário por ID.

### DELETE `/{id}`

Desativar usuário.

------------------------------------------------------------------------

## RANKING `/ranking`

### GET `/ranking?userId={id?}`

Retorna ranking geral e posição do usuário (opcional).

------------------------------------------------------------------------

## MATCHES `/matches`

### GET `/matches`

Lista de partidas não iniciadas.

------------------------------------------------------------------------

## ODDS `/odds`

### GET `/odds/{id}`

Retorna odds de uma partida específica.

------------------------------------------------------------------------

## BET `/bet`

### POST `/bet`

Criar uma nova aposta.

### GET `/bet/{userId}?status=&result=`

Listar apostas filtrando por: - status (`Pending`, `Settled`, `Void`,
`Rejected`) - resultado (`Won`, `Lost`, `Void`, `Refunded`)

------------------------------------------------------------------------

# 📁 Estrutura do Projeto

    pracbet/
    ├── backend/
    │   ├── controllers/
    │   ├── services/
    │   ├── repositories/
    │   ├── entities/
    │   ├── enums/
    │   ├── dtos/
    │   ├── security/
    │   └── resources/
    │
    └── frontend/
        ├── components/
        ├── pages/
        ├── context/
        ├── services/
        ├── types/
        └── utils/

------------------------------------------------------------------------

# 🚀 Como Executar

## Backend

    cd backend/pracbet
    mvn clean install
    mvn spring-boot:run

## Frontend

    cd frontend/pracbet
    npm install
    npm run dev

------------------------------------------------------------------------

# 🛣️ Roadmap Realista

### Backend

-   Engine PvP\
-   WebSockets\
-   Simulação de jogos históricos\
-   Sistema completo de XP\
-   Módulo de achievements

### Frontend

-   Tela avançada de estatísticas\
-   Interface de batalhas PvP\
-   Melhor experiência visual de mercados

------------------------------------------------------------------------

⭐ Este projeto está em evolução contínua.
