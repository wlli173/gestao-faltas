# GestFaltas — Gestão de Faltas

Protótipo de alta fidelidade de um painel web para a **coordenação de curso** acompanhar faltas de alunos, identificar matérias críticas e gerar relatórios exportáveis.

**Demonstração:** [https://wlli173.github.io/gestao-faltas](https://wlli173.github.io/gestao-faltas)

## Funcionalidades

- **Dashboard** — métricas do período, gráficos por matéria e dia da semana, listagem de registros recentes
- **Relatórios** — filtros avançados, tabela detalhada, exportação em JSON/CSV e impressão
- **Navegação** — sidebar recolhível, busca e áreas reservadas para gestão de alunos e configurações

> Os dados exibidos são **mockados** (`src/data/faltas.json`), adequados para demonstração e validação de interface.

## Tecnologias

| Tecnologia | Uso |
|------------|-----|
| [React](https://react.dev/) 19 | Interface e componentes |
| [Recharts](https://recharts.org/) | Gráficos do dashboard |
| [Lucide React](https://lucide.dev/) | Ícones |
| [date-fns](https://date-fns.org/) | Formatação de datas |
| Create React App | Build e desenvolvimento |
| GitHub Pages | Deploy estático |

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- npm (incluído com o Node)

## Instalação e execução

```bash
# Clonar o repositório
git clone https://github.com/wlli173/gestao-faltas.git
cd gestao-faltas

# Instalar dependências
npm install

# Servidor de desenvolvimento (http://localhost:3000)
npm start

# Build de produção
npm run build
```

## Deploy (GitHub Pages)

O projeto já está configurado com `homepage` no `package.json`:

```bash
npm run deploy
```

Isso executa o build e publica o conteúdo da pasta `build` na branch `gh-pages`.

## Estrutura do projeto

```
src/
├── App.jsx                 # Layout principal e roteamento por views
├── components/
│   ├── Charts/             # Gráficos e cards de visão geral
│   ├── Dashboard/          # Página inicial
│   ├── Layout/             # Sidebar e header
│   ├── Relatorios/         # Relatórios e exportação
│   └── common/             # Componentes reutilizáveis (Card, tabela)
├── data/
│   └── faltas.json         # Dados de demonstração
└── utils/
    ├── analytics.js        # Cálculo de métricas
    └── formatters.js       # Formatação de datas e percentuais
```

## Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm start` | Ambiente de desenvolvimento com hot reload |
| `npm run build` | Gera pasta `build` para produção |
| `npm test` | Executa testes (Jest + Testing Library) |
| `npm run deploy` | Build + publicação no GitHub Pages |

## Roadmap

- [ ] Integração com API/backend real
- [ ] Gestão de alunos (CRUD)
- [ ] Autenticação e perfis de acesso
- [ ] Notificações automáticas para alunos em risco

## Licença

Projeto acadêmico/demonstrativo. Consulte o repositório para informações de uso.
