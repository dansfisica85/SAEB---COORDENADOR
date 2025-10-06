# Sistema de Pesquisa SAEB 2025

Sistema web para pesquisa e consulta de documentos do SAEB (Sistema de Avaliação da Educação Básica) com integração de IA para respostas inteligentes.

## 🚀 Funcionalidades

- ✅ **Autenticação Segura**: Sistema de login com credenciais protegidas
- 🔍 **Pesquisa Inteligente**: Busca semântica em documentos PDF e PowerPoint
- 🤖 **IA Integrada**: Respostas geradas por Google Gemini
- 📄 **Referências Precisas**: Exibe páginas/slides específicos onde a informação foi encontrada
- 💬 **Interface de Chat**: Conversação natural para fazer perguntas
- 🎯 **Seções Temáticas**: Organização por tópicos para facilitar a navegação
- 📱 **Responsivo**: Interface adaptada para diferentes dispositivos

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no Vercel (para hospedagem)
- Chave API do Google Gemini (gratuita)

## 🔧 Instalação

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.local.example` para `.env.local`:

```bash
copy .env.local.example .env.local
```

Edite o arquivo `.env.local` e adicione sua chave API do Google Gemini:

```env
NEXT_PUBLIC_GEMINI_API_KEY=sua_chave_aqui
AUTH_USERNAME=COORDENADOR
AUTH_PASSWORD=SAEB2025FGV
```

### 3. Preparar documentos

Crie a pasta de documentos e copie os arquivos:

```bash
mkdir -p data\documents
```

Copie os seguintes arquivos para `data\documents\`:
- `SAEB2025_Apresentação_2_Ano_VF.pptx`
- `SAEB2025_Apresentação_Aplicadores_5_9_3_VF.pptx`
- `SCAN0000.PDF`
- `SCAN0001.PDF`

### 4. Processar documentos

Execute o script de processamento para extrair o texto dos documentos:

```bash
npm run process-docs
```

Este processo pode levar alguns minutos dependendo do tamanho dos arquivos.

### 5. Executar em desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:3000`

## 🔑 Credenciais de Acesso

- **Usuário**: COORDENADOR
- **Senha**: SAEB2025FGV

⚠️ **Importante**: O sistema requer login toda vez que a página é fechada ou recarregada.

## 🌐 Deploy no Vercel

### 1. Instalar Vercel CLI (opcional)

```bash
npm i -g vercel
```

### 2. Fazer login no Vercel

```bash
vercel login
```

### 3. Fazer deploy

```bash
vercel --prod
```

### 4. Configurar variáveis de ambiente no Vercel

No dashboard do Vercel:

1. Vá em **Settings** → **Environment Variables**
2. Adicione as seguintes variáveis:
   - `NEXT_PUBLIC_GEMINI_API_KEY`: Sua chave API do Gemini
   - `AUTH_USERNAME`: COORDENADOR
   - `AUTH_PASSWORD`: SAEB2025FGV

### 5. Fazer upload dos documentos processados

Após processar os documentos localmente, você precisa fazer upload do arquivo `data/processed/documents.json` para o Vercel:

**Opção 1: Via Git**
```bash
git add data/processed/documents.json
git commit -m "Add processed documents"
git push
```

**Opção 2: Reprocessar após deploy**
Execute o script de processamento no ambiente de produção.

## 📚 Estrutura do Projeto

```
saeb-search-system/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts      # API de autenticação
│   │   │   └── logout/route.ts     # API de logout
│   │   └── search/route.ts         # API de pesquisa
│   ├── login/
│   │   └── page.tsx                # Página de login
│   ├── layout.tsx                   # Layout principal
│   ├── page.tsx                     # Página inicial (chat)
│   └── globals.css                  # Estilos globais
├── data/
│   ├── documents/                   # Documentos originais
│   └── processed/                   # Documentos processados
├── lib/
│   └── types.ts                     # Tipos TypeScript
├── scripts/
│   └── process-documents.js         # Script de processamento
├── middleware.ts                    # Middleware de autenticação
├── next.config.js
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## 🔍 Como Usar

1. **Login**: Acesse o sistema com as credenciais fornecidas
2. **Navegue pelas seções**: Use a barra lateral para filtrar por temas
3. **Perguntas frequentes**: Clique em perguntas pré-definidas para começar
4. **Faça perguntas**: Digite sua pergunta no campo de chat
5. **Analise resultados**: Veja a resposta da IA e as referências aos documentos
6. **Logout**: Clique em "Sair" quando terminar

## 🤖 APIs de IA Suportadas

### Google Gemini (Recomendado)

- **Gratuito**: 60 requisições por minuto
- **Configuração**: Obtenha uma chave em [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Modelo**: gemini-pro

### Outras opções
O sistema pode ser expandido para suportar:
- OpenAI GPT
- Anthropic Claude
- Llama via Replicate

## 🛠️ Tecnologias Utilizadas

- **Framework**: Next.js 14 + TypeScript
- **Estilização**: Tailwind CSS
- **Autenticação**: Custom middleware com cookies
- **Processamento PDF**: pdf-parse
- **Processamento PPTX**: adm-zip + xml2js
- **OCR**: Tesseract.js (para imagens)
- **IA**: Google Generative AI (Gemini)
- **Ícones**: Lucide React
- **Hospedagem**: Vercel

## ⚙️ Configurações Avançadas
### Melhorar a busca
Edite `app/api/search/route.ts` para ajustar:

- Número de resultados retornados
- Algoritmo de relevância
- Tamanho dos trechos (excerpts)

### Adicionar mais documentos

1. Copie os novos arquivos para `data/documents/`
2. Atualize a lista em `scripts/process-documents.js`
3. Execute `npm run process-docs` novamente

### Personalizar perguntas frequentes
### Personalizar perguntas frequentes
Edite o array `frequentQuestions` em `app/page.tsx`

### Personalizar seções
Edite o array `sections` em `app/page.tsx`

## 🐛 Troubleshooting

### Erro: "Documentos não processados"
- Execute `npm run process-docs`
- Verifique se os arquivos estão em `data/documents/`

### Erro de autenticação
- Verifique as variáveis de ambiente
- Limpe os cookies do navegador

### API Gemini não responde
- Verifique se a chave API está correta
- Confirme que você não excedeu o limite gratuito

### Build falha no Vercel
- Certifique-se de que `documents.json` foi commitado
- Verifique as variáveis de ambiente no dashboard

## 📝 Licença

Sistema desenvolvido para uso interno da coordenação do SAEB 2025.

## 👥 Suporte

Para questões e suporte, entre em contato com a coordenação técnica.

---

**Desenvolvido para o SAEB 2025 - FGV**
