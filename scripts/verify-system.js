const fs = require('fs');
const path = require('path');

console.log('========================================');
console.log('  VERIFICAÇÃO DO SISTEMA SAEB 2025');
console.log('========================================\n');

let errors = 0;
let warnings = 0;

// Verificar Node.js
console.log('✓ Verificando Node.js...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion < 18) {
  console.log(`  ✗ ERRO: Node.js ${nodeVersion} detectado. Necessário 18+`);
  errors++;
} else {
  console.log(`  ✓ Node.js ${nodeVersion} OK`);
}

// Verificar package.json
console.log('\n✓ Verificando package.json...');
if (fs.existsSync('package.json')) {
  console.log('  ✓ package.json encontrado');
} else {
  console.log('  ✗ ERRO: package.json não encontrado');
  errors++;
}

// Verificar node_modules
console.log('\n✓ Verificando dependências...');
if (fs.existsSync('node_modules')) {
  console.log('  ✓ node_modules encontrado');
} else {
  console.log('  ⚠ AVISO: node_modules não encontrado. Execute: npm install');
  warnings++;
}

// Verificar .env.local
console.log('\n✓ Verificando configuração...');
if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  console.log('  ✓ .env.local encontrado');
  
  if (envContent.includes('NEXT_PUBLIC_GEMINI_API_KEY=') && 
      envContent.split('NEXT_PUBLIC_GEMINI_API_KEY=')[1].trim().length > 0) {
    console.log('  ✓ Chave API do Gemini configurada');
  } else {
    console.log('  ⚠ AVISO: Chave API do Gemini não configurada');
    console.log('    Configure no arquivo .env.local');
    warnings++;
  }
  
  if (envContent.includes('AUTH_USERNAME=COORDENADOR')) {
    console.log('  ✓ Usuário configurado corretamente');
  } else {
    console.log('  ⚠ AVISO: Usuário não configurado corretamente');
    warnings++;
  }
  
  if (envContent.includes('AUTH_PASSWORD=SAEB2025FGV')) {
    console.log('  ✓ Senha configurada corretamente');
  } else {
    console.log('  ⚠ AVISO: Senha não configurada corretamente');
    warnings++;
  }
} else {
  console.log('  ⚠ AVISO: .env.local não encontrado');
  console.log('    Copie .env.local.example para .env.local');
  warnings++;
}

// Verificar estrutura de pastas
console.log('\n✓ Verificando estrutura de pastas...');
const requiredDirs = [
  'app',
  'app/api',
  'app/login',
  'lib',
  'scripts',
  'data'
];

for (const dir of requiredDirs) {
  if (fs.existsSync(dir)) {
    console.log(`  ✓ ${dir}/ OK`);
  } else {
    console.log(`  ✗ ERRO: ${dir}/ não encontrado`);
    errors++;
  }
}

// Verificar documentos
console.log('\n✓ Verificando documentos...');
const docsDir = path.join('data', 'documents');
if (fs.existsSync(docsDir)) {
  console.log('  ✓ data/documents/ encontrado');
  
  const expectedDocs = [
    'SAEB2025_Apresentação_2_Ano_VF.pptx',
    'SAEB2025_Apresentação_Aplicadores_5_9_3_VF.pptx',
    'SCAN0000.PDF',
    'SCAN0001.PDF'
  ];
  
  const files = fs.readdirSync(docsDir);
  let foundDocs = 0;
  
  for (const doc of expectedDocs) {
    if (files.includes(doc)) {
      console.log(`  ✓ ${doc} encontrado`);
      foundDocs++;
    } else {
      console.log(`  ⚠ AVISO: ${doc} não encontrado`);
      warnings++;
    }
  }
  
  if (foundDocs === 0) {
    console.log('  ⚠ AVISO: Nenhum documento encontrado em data/documents/');
    console.log('    Copie os arquivos para esta pasta');
  }
} else {
  console.log('  ⚠ AVISO: data/documents/ não existe');
  console.log('    Execute: mkdir -p data/documents');
  warnings++;
}

// Verificar documentos processados
console.log('\n✓ Verificando documentos processados...');
const processedFile = path.join('data', 'processed', 'documents.json');
if (fs.existsSync(processedFile)) {
  const data = JSON.parse(fs.readFileSync(processedFile, 'utf-8'));
  console.log(`  ✓ documents.json encontrado (${data.length} documentos)`);
  
  for (const doc of data) {
    console.log(`    - ${doc.filename}: ${doc.pages.length} páginas`);
  }
} else {
  console.log('  ⚠ AVISO: documents.json não encontrado');
  console.log('    Execute: npm run process-docs');
  warnings++;
}

// Verificar arquivos principais
console.log('\n✓ Verificando arquivos principais...');
const requiredFiles = [
  'next.config.js',
  'tsconfig.json',
  'tailwind.config.js',
  'middleware.ts',
  'app/page.tsx',
  'app/login/page.tsx',
  'app/layout.tsx',
  'app/api/auth/login/route.ts',
  'app/api/search/route.ts'
];

for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`  ✓ ${file} OK`);
  } else {
    console.log(`  ✗ ERRO: ${file} não encontrado`);
    errors++;
  }
}

// Resumo
console.log('\n========================================');
console.log('  RESUMO DA VERIFICAÇÃO');
console.log('========================================');

if (errors === 0 && warnings === 0) {
  console.log('\n✓ Tudo OK! Sistema pronto para uso.');
  console.log('\nPróximos passos:');
  console.log('  1. Execute: npm run dev');
  console.log('  2. Acesse: http://localhost:3000');
  console.log('  3. Login: COORDENADOR / SAEB2025FGV');
} else {
  if (errors > 0) {
    console.log(`\n✗ ${errors} erro(s) encontrado(s)`);
    console.log('  Corrija os erros antes de continuar.');
  }
  
  if (warnings > 0) {
    console.log(`\n⚠ ${warnings} aviso(s) encontrado(s)`);
    console.log('  O sistema pode funcionar, mas recomenda-se corrigir.');
  }
  
  console.log('\nAções recomendadas:');
  if (!fs.existsSync('node_modules')) {
    console.log('  • npm install');
  }
  if (!fs.existsSync('.env.local')) {
    console.log('  • Configurar .env.local');
  }
  if (!fs.existsSync(docsDir)) {
    console.log('  • mkdir -p data\\documents');
    console.log('  • Copiar documentos para data\\documents\\');
  }
  if (!fs.existsSync(processedFile)) {
    console.log('  • npm run process-docs');
  }
}

console.log('\n========================================\n');

process.exit(errors > 0 ? 1 : 0);
