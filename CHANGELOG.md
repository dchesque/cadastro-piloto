# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [1.4.1] - 2026-03-16

### Fixed
- Erro de build: corrigida tipagem de campos opcionais nas etiquetas de impressão.
- Resiliência: funções de formatação agora lidam com valores `null` ou `undefined`.

## [1.4.0] - 2026-03-16

### Added
- Cadastro Flexível: Todos os campos de Peças e Tecidos agora são opcionais.
- Suporte a registros parciais no banco de dados e formulários.

### Fixed
- Correção do arquivo de impressão da etiqueta (estava saindo em branco).
- Ajuste no posicionamento da etiqueta para o formato 100mm x 150mm.
- Remoção de avisos de validação residual nos formulários.

## [1.3.0] - 2026-03-16

### Changed
- Reformulação visual Premium completa (JC Piloto Design System).
- **Sidebar Escura**: Fundo escuro para maior foco e contraste.
- **Botões Premium**: Novos estilos de botões com sombras e micro-interações.
- **Contraste de Cores**: Melhoria geral na legibilidade do sistema.
- **Responsividade Full**: Ajustes em todas as telas para visualização mobile e tablet.

## [1.2.0] - 2026-03-16

### Changed
- Configuração do ambiente concluída e conexão com banco de dados Docker estabelecida.
- Integração do Prisma com o esquema de dados atualizado.

## [1.1.0] - 2026-03-16

### Added
- Suporte para banco de dados local usando Docker Compose.
- Arquivo `docker-compose.yml` para subir um PostgreSQL rapidamente.

### Changed
- `.env.example` atualizado com configurações do Docker local.
