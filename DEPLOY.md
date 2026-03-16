# Instruções de Deploy no EasyPanel

Este guia fornece instruções passo a passo para fazer o deploy da aplicação JC Plus Size no EasyPanel.

## Pré-requisitos

- Uma conta no EasyPanel
- Acesso ao painel do EasyPanel

## Passo 1: Criar Serviço PostgreSQL

1. No EasyPanel, clique em **"Add Service"**
2. Selecione **"PostgreSQL"**
3. Configure o banco de dados:
   - Escolha um nome (ex: `jcpiloto-db`)
   - Configure usuário e senha
   - Note a `DATABASE_URL` gerada (será usada no próximo passo)

## Passo 2: Criar Serviço de Aplicação

1. No EasyPanel, clique em **"Add Service"**
2. Selecione **"App"**
3. Configure a aplicação:
   - **Nome**: `jc-plus-size` (ou o nome preferido)
   - **Repositório**: Conecte ao seu repositório Git ou faça upload do código
   - **Dockerfile**: O Dockerfile já está configurado na raiz do projeto

## Passo 3: Configurar Variáveis de Ambiente

Na seção de variáveis de ambiente do serviço, adicione:

```env
DATABASE_URL=postgresql://usuario:senha@hostname:5432/nome_db
NEXT_PUBLIC_APP_URL=https://seu-dominio.com
```

**Nota**: Substitua os valores pelos dados reais do PostgreSQL criado no passo 1.

## Passo 4: Deploy

1. Clique em **"Deploy"** ou **"Start"**
2. O EasyPanel irá:
   - Detectar automaticamente o Dockerfile
   - Instalar as dependências
   - Gerar o Prisma Client
   - Executar as migrations do banco de dados
   - Iniciar a aplicação

## Passo 5: Acessar a Aplicação

Após o deploy concluído, acesse a aplicação através da URL fornecida pelo EasyPanel.

## Solução de Problemas

### As migrations não rodam automaticamente?

Verifique se o comando no Dockerfile está correto:
```dockerfile
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
```

### Erro de conexão com o banco de dados?

Verifique:
1. Se a `DATABASE_URL` está correta
2. Se o serviço PostgreSQL está rodando
3. Se as credenciais estão corretas

### Erro de permissões no Prisma?

O Dockerfile já está configurado com o usuário `nextjs` e permissões adequadas.

## Atualizações

Para atualizar a aplicação:
1. Faça push das mudanças para o repositório Git
2. No EasyPanel, clique em **"Redeploy"**

Ou se estiver usando upload:
1. Faça upload do novo código
2. Clique em **"Redeploy"**

## Backup

O EasyPanel oferece backups automáticos para o PostgreSQL. Configure os backups nas configurações do serviço PostgreSQL.
