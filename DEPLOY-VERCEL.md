# 🚀 Guia de Deploy no Vercel - SAEB 2025

## 📋 Pré-requisitos

- Conta no GitHub (já configurada ✅)
- Conta no Vercel (gratuita)
- Repositório: `dansfisica85/SAEB---COORDENADOR`

## 🌐 Passos para Deploy

### 1. Criar Conta no Vercel

1. Acesse: https://vercel.com
2. Clique em **"Sign Up"**
3. Escolha **"Continue with GitHub"**
4. Autorize o Vercel a acessar sua conta GitHub

### 2. Importar o Projeto

1. No dashboard do Vercel, clique em **"Add New..."**
2. Selecione **"Project"**
3. Clique em **"Import Git Repository"**
4. Procure por: `SAEB---COORDENADOR`
5. Clique em **"Import"**

### 3. Configurar o Projeto

Na tela de configuração:

#### **Framework Preset**
- Selecione: **"Other"** (não precisa de framework)

#### **Root Directory**
- **IMPORTANTE**: Clique em **"Edit"**
- Digite: `web`
- Isso faz o Vercel usar apenas a pasta `web/` como raiz do site

#### **Build Settings**
- **Build Command**: Deixe vazio (não precisa)
- **Output Directory**: Deixe vazio (não precisa)
- **Install Command**: Deixe vazio (não precisa)

#### **Environment Variables**
- Não precisa adicionar (a API key está no código)

### 4. Deploy

1. Clique em **"Deploy"**
2. Aguarde 30-60 segundos
3. Pronto! Seu site estará no ar 🎉

### 5. Acessar o Site

Após o deploy, você receberá uma URL como:
```
https://saeb-coordenador.vercel.app
```

## 🔐 Login no Sistema

**Usuário**: `COORDENADOR`  
**Senha**: `SAEB2025FGV`

## 📁 Estrutura do Projeto

```
web/
├── index.html      # Página de login
├── chat.html       # Interface de chat
├── styles.css      # Estilos do sistema
├── auth.js         # Autenticação
├── chat.js         # Lógica do chat
├── config.js       # Configuração da API
└── documents.js    # Base de conhecimento
```

## ⚙️ Configurações Avançadas

### Domínio Personalizado

1. No dashboard do Vercel, vá em **"Settings"** > **"Domains"**
2. Clique em **"Add"**
3. Digite seu domínio
4. Siga as instruções para configurar o DNS

### Atualizações Automáticas

✅ **Já configurado!** Cada `git push` para `main` atualiza o site automaticamente

### Rollback (Reverter Versão)

1. No dashboard, vá em **"Deployments"**
2. Encontre a versão desejada
3. Clique nos 3 pontos (...) > **"Promote to Production"**

## 🔧 Resolução de Problemas

### ❌ Erro 404 ao acessar

**Causa**: Root directory não configurado para `web`

**Solução**:
1. Vá em **"Settings"** > **"General"**
2. Em **"Root Directory"**, clique em **"Edit"**
3. Digite: `web`
4. Clique em **"Save"**
5. Vá em **"Deployments"** e faça redeploy

### ❌ Página em branco

**Causa**: Arquivos não carregados

**Solução**:
1. Abra o Console do navegador (F12)
2. Verifique erros
3. Provavelmente é problema de caminho - verifique se Root Directory está como `web`

### ❌ API não funciona

**Causa**: Chave da API inválida ou bloqueada

**Solução**:
1. Verifique se a chave está correta em `config.js`
2. Teste a chave diretamente: https://aistudio.google.com
3. Se necessário, gere nova chave

## 📊 Monitoramento

### Ver Logs

1. Dashboard Vercel > seu projeto
2. Clique em **"Functions"** (se houver erros)
3. Ou veja **"Deployments"** > clique no deploy > **"View Function Logs"**

### Analytics

1. Dashboard Vercel > seu projeto
2. Clique em **"Analytics"**
3. Veja visitas, performance, etc (pode precisar de upgrade)

## 🎯 Checklist Final

- [x] Código no GitHub
- [ ] Conta Vercel criada
- [ ] Projeto importado
- [ ] Root Directory configurado: `web`
- [ ] Deploy realizado com sucesso
- [ ] Site acessível via URL
- [ ] Login funcionando
- [ ] Chat respondendo perguntas

## 📞 Suporte

- **Vercel Docs**: https://vercel.com/docs
- **Status Vercel**: https://www.vercel-status.com
- **Suporte Vercel**: https://vercel.com/support

## 🔄 Próximos Passos

1. **Testar o sistema completo**
2. **Configurar domínio personalizado** (opcional)
3. **Monitorar uso da API Gemini**
4. **Fazer backup do código regularmente**

---

## ✅ Resumo Rápido

```bash
1. Vercel.com → Sign Up com GitHub
2. Add New → Project
3. Import: SAEB---COORDENADOR
4. Root Directory: web
5. Deploy
6. Pronto! 🎉
```

**URL do Repositório**: https://github.com/dansfisica85/SAEB---COORDENADOR

**Credenciais de Teste**:
- Usuário: `COORDENADOR`
- Senha: `SAEB2025FGV`

---

*Sistema desenvolvido em HTML, CSS e JavaScript puro - 100% estático, sem Node.js*
