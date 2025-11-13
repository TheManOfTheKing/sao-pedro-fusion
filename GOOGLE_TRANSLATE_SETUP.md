# Configuração do Google Translate

Este documento explica como configurar a integração automática do Google Translate para traduzir automaticamente os itens do menu.

## 📋 Pré-requisitos

1. Conta no Google Cloud Platform (GCP)
2. Projeto criado no GCP
3. API de Tradução habilitada

## 🔧 Passo a Passo

### 1. Criar Projeto no Google Cloud

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Anote o ID do projeto

### 2. Habilitar a API de Tradução

1. No menu lateral, vá em **APIs & Services** > **Library**
2. Procure por "Cloud Translation API"
3. Clique em **Enable** para habilitar a API

### 3. Criar Chave de API

1. Vá em **APIs & Services** > **Credentials**
2. Clique em **Create Credentials** > **API Key**
3. Copie a chave gerada
4. (Opcional) Restrinja a chave para maior segurança:
   - Clique na chave criada
   - Em **API restrictions**, selecione "Restrict key"
   - Escolha "Cloud Translation API"
   - Salve as alterações

### 4. Configurar Variável de Ambiente

Adicione a chave de API ao arquivo `.env` na raiz do projeto:

```env
GOOGLE_TRANSLATE_API_KEY=sua-chave-de-api-aqui
```

### 5. Reiniciar o Servidor

Após adicionar a variável de ambiente, reinicie o servidor:

```bash
npm run dev
```

## 💰 Custos

O Google Cloud Translation API oferece:
- **500.000 caracteres gratuitos por mês**
- Após o limite, cobra $20 por milhão de caracteres

Para um menu típico:
- Cada item do menu: ~50-100 caracteres (nome + descrição)
- 5 idiomas × 100 caracteres = 500 caracteres por item
- Com o plano gratuito: ~1.000 itens traduzidos por mês

## 🎯 Como Funciona

### Criação de Item

Quando você cria um novo item do menu:
1. Preenche apenas o nome e descrição em **Português**
2. O sistema automaticamente traduz para:
   - Inglês (en)
   - Espanhol (es)
   - Francês (fr)
   - Alemão (de)
   - Italiano (it)
3. As traduções são salvas no banco de dados

### Edição de Item

Quando você edita um item:
- Se alterar o nome ou descrição em português **E** não fornecer traduções manuais
- O sistema detecta a mudança e re-traduz automaticamente

### Traduções Manuais

Você ainda pode:
- Editar traduções manualmente na aba "Traduções" do formulário
- As traduções manuais têm prioridade sobre as automáticas

## 🔍 Verificação

Para verificar se está funcionando:

1. Crie um novo item do menu com apenas português preenchido
2. Verifique no banco de dados ou na interface que as traduções foram criadas
3. Verifique os logs do servidor para erros

## ⚠️ Troubleshooting

### Erro: "Google Translate API key not configured"
- Verifique se a variável `GOOGLE_TRANSLATE_API_KEY` está no `.env`
- Reinicie o servidor após adicionar a variável

### Erro: "API key not valid"
- Verifique se a chave está correta
- Verifique se a API está habilitada no projeto GCP
- Verifique se há restrições na chave que estão bloqueando

### Traduções não aparecem
- Verifique os logs do servidor para erros
- Verifique se há créditos/quota disponível no GCP
- Verifique a conexão com a internet

## 📚 Referências

- [Google Cloud Translation API Documentation](https://cloud.google.com/translate/docs)
- [Pricing](https://cloud.google.com/translate/pricing)
- [API Reference](https://cloud.google.com/translate/docs/reference/rest)

