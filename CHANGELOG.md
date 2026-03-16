# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [1.7.5] - 2026-03-16

### Changed
- **Configuração de QR Code**: Preparação técnica para produção. O link do QR Code agora é dinâmico e utiliza a variável de ambiente `NEXT_PUBLIC_APP_URL`.
- **Branding Global**: Concluída a substituição de "JC Studio" por "JC PLUS SIZE" em todas as telas do sistema (Dashboard, Navbar, Sidebar e Formulários).

## [1.7.4] - 2026-03-16

### Changed
- **Branding**: Nome da empresa atualizado para **JC PLUS SIZE** em todo o sistema e nas etiquetas de impressão.

## [1.7.3] - 2026-03-16

### Changed
- **Header de Impressão**: Remoção dos rótulos auxiliares "Registro" e "Estoque" para um cabeçalho mais limpo e direto.

## [1.7.2] - 2026-03-16

### Changed
- **Layout de Observações**: Remoção da moldura (retângulo) em volta das observações e redução da fonte para `12px` (aprox. -2pt) para um visual mais limpo e melhor aproveitamento de espaço.

## [1.7.1] - 2026-03-16

### Fixed
- **Contraste de Impressão**: Remoção total de tons de cinza do layout de impressão. Todos os textos e bordas agora utilizam preto puro (`#000000`) para garantir 100% de visibilidade em qualquer impressora térmica.

## [1.7.0] - 2026-03-16

### Changed
- **Header de Impressão**: Redesign total do cabeçalho das etiquetas. Nome "JC Studio" e tipo do registro agora possuem destaque máximo com fontes `2xl` e bordas reforçadas para identificação instantânea.

## [1.6.2] - 2026-03-16

### Changed
- **Impressão**: Suavização total das bordas e remoção de divisores verticais nas etiquetas para um visual mais limpo e organizado, mantendo o contraste nos textos.

## [1.6.1] - 2026-03-16

### Fixed
- **Estabilidade**: Corrigido erro de "Hydration Mismatch" causado por extensões de navegador que injetam atributos no HTML.

## [1.6.0] - 2026-03-16

### Added
- **Otimização de Impressão Térmica**: Refilação completa do layout das etiquetas de 100mm x 150mm. Fontes aumentadas, linhas divisórias reforçadas e remoção de tons de cinza para máxima nitidez em impressoras térmicas.

## [1.5.4] - 2026-03-16

### Fixed
- **Impressão**: Ajuste fino das margens e escala para etiquetas 100mm x 150mm, eliminando a quebra para a segunda folha.

## [1.5.3] - 2026-03-16

### Changed
- **Impressão**: Atualizado o nome exibido nas etiquetas de "Cadastro Piloto JC" para "JC Studio" visando consistência visual.

## [1.5.2] - 2026-03-16

### Fixed
- **Impressão**: Ocultado o header mobile e a sidebar durante a impressão de etiquetas para garantir um layout limpo.

## [1.5.1] - 2026-03-16

### Fixed
- Erro de deploy no Easypanel: restaurado diretório `public/` ausente que causava falha na build do Docker.
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
