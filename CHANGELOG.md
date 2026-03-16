# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [1.5.1] - 2026-03-16

### Added
- **Referências Editáveis**: Agora é possível editar manualmente o campo "Referência" tanto no cadastro quanto na edição de Peças e Tecidos. O sistema continua gerando códigos automáticos por padrão.

## [1.5.0] - 2026-03-16
- **Full Responsiveness**: Auditoria e refinamento de todas as páginas do app (Dashboard, Listas, Detalhes e Formulários) para garantir uma UX premium em dispositivos móveis e tablets.
- **Micro-ajustes Estéticos**: Adaptação de paddings, arredondamentos e tipografia baseada no tamanho da tela.

## [1.4.4] - 2026-03-16

## [1.4.3] - 2026-03-16

### Changed
- Melhoria estética nos botões de ação dos cards: hover agora utiliza cores suaves e temáticas em vez de alto contraste.
- Sincronização de estilos de hover entre as páginas de Peças e Tecidos.

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
