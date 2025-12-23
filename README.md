# 🟡 PRACBET — Plataforma Gamificada de Apostas Esportivas

PRACBET é um sistema completo de apostas esportivas com visual moderno, estrutura robusta em Java/Spring Boot no backend e Angular no frontend. O projeto tem como proposta não apenas simular casas de apostas tradicionais, mas também evoluir para uma experiência gamificada com competições PvP e simulação de estratégias.

---

### 🧠 Visão Geral

O objetivo do projeto é desenvolver uma plataforma onde usuários possam apostar com pontos fictícios (sem envolvimento financeiro real) em jogos reais e também disputar entre si de forma divertida e estratégica.

As apostas funcionam com odds realistas, mercados variados e uma base de dados alimentada via API ou inserções simuladas. Em breve, o sistema será expandido com partidas entre jogadores (PvP), rankings e modos de jogo similares a "GeoGuessr" e "modo sobrevivência".

---

### ✅ Funcionalidades já implementadas

- [x] Integração com API de jogos de futebol (RapidAPI - API-Football)
- [x] Cadastro e atualização automática de partidas via agendamentos (`@Scheduled`)
- [x] Backend com Spring Boot e PostgreSQL
- [x] Frontend Angular moderno com layout responsivo
- [x] Tela principal listando partidas com:
  - Nome dos times
  - Escudos
  - Liga/campeonato
  - Odds (valores de aposta)
- [x] Tela de detalhes da partida com:
  - Mercados como: Resultado Final, Ambos Marcam, Dupla Chance
  - Visual estilo casas de aposta reais
- [x] Filtro de jogos por campeonato
- [x] Sistema de persistência com verificação de duplicatas via `fixtureId`

---

### 🧰 Tecnologias e Stack

#### Backend
- Java 17
- Spring Boot (REST API)
- Spring Data JPA + Hibernate
- PostgreSQL
- Agendador com `@Scheduled`
- Integração com API externa (RapidAPI - API-Football)

#### Frontend
- Angular 17
- TypeScript
- SCSS/CSS com design escuro e responsivo
- Consumo de API REST com HttpClient
- Componentização com Angular Standalone Components

---

### 🧪 Prints do Projeto (telas em desenvolvimento)

#### 🏠 Tela Inicial – Listagem de Jogos
![tela inicial (em desenvolvimento)](https://github.com/user-attachments/assets/1e3e2363-2de0-4293-948f-a356a0dda297)


#### 📊 Tela de Detalhes – Mercados de Apostas
![tela partida (em desenvolvimento)](https://github.com/user-attachments/assets/5e1c6b55-f505-4969-b809-e1cdcc2af6d5)


---

### 🚀 Próximos passos (Roadmap)

- [ ] Sistema completo de **gamificação PvP**
  - Modos 1x1 e ranqueados
  - Pontuação por vitória, apostas certas, streaks etc.
- [ ] Simulador de estratégias de apostas com estatísticas históricas
- [ ] Sistema de **ranking global** e **perfil do jogador**
- [ ] Modo “Sobrevivência” com apostas em sequência
- [ ] Notificações em tempo real com WebSocket
- [ ] Backend mais performático com caching para odds estáticas
- [ ] Inclusão de outros esportes (ex: Counter-Strike já listado na lateral)
- [ ] Painel administrativo para gerenciar partidas e odds

---
