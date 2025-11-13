# TODO - São Pedro Fusion Menu Digital

## Fase 1: Planejamento e Estrutura
- [x] Definir schema do banco de dados (categorias, itens do menu, traduções)
- [ ] Planejar sistema de tradução automática
- [x] Documentar paleta de cores e tipografia

## Fase 2: Backend e Banco de Dados
- [x] Criar tabelas no banco de dados (categories, menu_items, translations)
- [x] Implementar procedures tRPC para CRUD de categorias
- [x] Implementar procedures tRPC para CRUD de itens do menu
- [x] Implementar procedures tRPC para buscar menu por idioma
- [ ] Integrar API de tradução (DeepL ou Google Translate)
- [ ] Criar sistema de cache de traduções

## Fase 3: Frontend
- [x] Configurar paleta de cores no index.css (verde escuro, dourado, azul turquesa)
- [x] Implementar página inicial com seletor de idiomas
- [x] Criar componente de visualização do menu por categoria
- [x] Implementar componente de item do menu (nome, descrição, preço, foto)
- [x] Adicionar navegação por categorias
- [x] Implementar troca de idioma instantânea
- [x] Criar painel administrativo para gerenciar cardápio
  - [x] Criar página de listagem de categorias
  - [x] Criar página de listagem de itens do menu
  - [ ] Implementar formulário de adicionar/editar categoria
  - [x] Implementar formulário de adicionar/editar item
    - [x] Criar componente de formulário
    - [x] Adicionar campo de URL de imagem
    - [x] Implementar edição de traduções
  - [x] Adicionar botão de toggle para marcar item como esgotado
  - [ ] Criar interface de gerenciamento de traduções
- [x] Garantir responsividade mobile-first

## Fase 4: Dados e Testes
- [x] Popular banco com categorias de exemplo
- [x] Popular banco com itens do menu de exemplo
- [x] Gerar traduções automáticas para todos os idiomas
- [x] Testar seleção de idiomas
- [x] Testar navegação entre categorias
- [x] Testar responsividade em diferentes dispositivos
- [x] Testar painel administrativo

## Fase 5: Deploy e QR Code
- [x] Configurar variáveis de ambiente de produção
- [x] Criar checkpoint para deploy
- [x] Gerar QR Code para acesso ao menu
- [x] Documentar processo de deploy
- [x] Criar guia de uso para o cliente
- [x] Criar guia de personalização para vender a outros restaurantes

## Fase 6: Entrega
- [x] Preparar documentação final
- [x] Criar guia de personalização para outros restaurantes
- [x] Criar checkpoint final
- [x] Entregar aplicação ao usuário
