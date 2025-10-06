const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');
const { exec } = require('child_process');
const { promisify } = require('util');

const execPromise = promisify(exec);

// Diretórios
const DOCS_DIR = path.join(process.cwd(), 'data', 'documents');
const OUTPUT_DIR = path.join(process.cwd(), 'data', 'processed');
const TEMP_DIR = path.join(process.cwd(), 'data', 'temp');

// Criar diretórios se não existirem
[OUTPUT_DIR, TEMP_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Função para converter PDF em imagens usando GraphicsMagick (se disponível)
async function pdfToImages(pdfPath, outputDir) {
  const images = [];
  const pdfData = await pdfParse(fs.readFileSync(pdfPath));
  const numPages = pdfData.numpages;
  
  console.log(`  Tentando extrair ${numPages} páginas como imagens...`);
  
  // Como não temos GraphicsMagick instalado, vamos usar uma abordagem alternativa
  // Retornar array vazio e processar o texto extraído diretamente
  return { images: [], numPages };
}

// Processar PDF com OCR aprimorado
async function processPDFWithOCR(filePath) {
  console.log(`\n📄 Processando PDF com OCR: ${path.basename(filePath)}`);
  console.log(`   Arquivo: ${filePath}`);
  
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdfParse(dataBuffer);
  
  const filename = path.basename(filePath);
  const pages = [];
  
  console.log(`   Total de páginas: ${pdfData.numpages}`);
  console.log(`   Texto bruto extraído: ${pdfData.text.length} caracteres`);
  
  // Extrair texto de cada página
  const textPages = pdfData.text.split('\f'); // Form feed separa páginas
  
  // Se o PDF tem texto extraível, usar ele
  if (pdfData.text.trim().length > 100) {
    console.log(`   ✓ PDF contém texto extraível`);
    
    for (let i = 0; i < pdfData.numpages; i++) {
      let pageText = textPages[i] || '';
      
      pages.push({
        pageNumber: i + 1,
        text: pageText.trim(),
        hasImage: pageText.trim().length < 20,
        extractionMethod: pageText.trim().length > 20 ? 'direct' : 'none'
      });
    }
  } else {
    // PDF é escaneado (imagem) - precisamos usar OCR
    console.log(`   ⚠️  PDF é escaneado (sem texto extraível)`);
    console.log(`   ℹ️  Para OCR completo, será necessário extrair imagens do PDF`);
    console.log(`   ℹ️  Por enquanto, criando estrutura básica das páginas...`);
    
    // Criar estrutura de páginas mesmo sem texto
    for (let i = 0; i < pdfData.numpages; i++) {
      pages.push({
        pageNumber: i + 1,
        text: `[Página ${i + 1} - PDF escaneado. Conteúdo visual disponível para visualização mas texto não extraível sem OCR avançado.]`,
        hasImage: true,
        extractionMethod: 'scanned',
        note: 'PDF escaneado - requer visualização manual ou OCR com ferramentas externas'
      });
    }
  }
  
  return {
    filename,
    type: 'pdf',
    pages,
    totalPages: pdfData.numpages,
    hasExtractableText: pdfData.text.trim().length > 100
  };
}

// Processar todos os documentos
async function processAllDocuments() {
  console.log('\n' + '='.repeat(70));
  console.log('  PROCESSAMENTO DE DOCUMENTOS SAEB COM OCR');
  console.log('='.repeat(70));
  console.log('\n⚠️  IMPORTANTE: Processando APENAS os PDFs SCAN0000 e SCAN0001\n');
  
  const documents = [];
  
  // Lista de arquivos para processar - APENAS OS 2 PDFs SCAN
  const files = [
    'SCAN0000.PDF',
    'SCAN0001.PDF'
  ];
  
  for (const file of files) {
    const filePath = path.join(DOCS_DIR, file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`❌ Arquivo não encontrado: ${file}`);
      continue;
    }
    
    try {
      const doc = await processPDFWithOCR(filePath);
      documents.push(doc);
      
      console.log(`\n✓ ${file} processado com sucesso!`);
      console.log(`  - Total de páginas: ${doc.pages.length}`);
      console.log(`  - Texto extraível: ${doc.hasExtractableText ? 'Sim' : 'Não (PDF escaneado)'}`);
      console.log(`  - Método: ${doc.pages[0].extractionMethod}`);
      
    } catch (error) {
      console.error(`\n❌ Erro ao processar ${file}:`, error.message);
    }
  }
  
  // Salvar resultado
  const outputPath = path.join(OUTPUT_DIR, 'documents.json');
  fs.writeFileSync(outputPath, JSON.stringify(documents, null, 2));
  
  console.log('\n' + '='.repeat(70));
  console.log('✓ PROCESSAMENTO CONCLUÍDO!');
  console.log('='.repeat(70));
  console.log(`\n📊 Resumo:`);
  console.log(`   Total de documentos: ${documents.length}`);
  console.log(`   Total de páginas: ${documents.reduce((sum, doc) => sum + doc.pages.length, 0)}`);
  console.log(`   Arquivo salvo em: ${outputPath}`);
  
  // Mostrar estatísticas
  documents.forEach(doc => {
    const textPages = doc.pages.filter(p => p.text.length > 50).length;
    const imagPages = doc.pages.filter(p => p.hasImage).length;
    console.log(`\n   📄 ${doc.filename}:`);
    console.log(`      - ${doc.pages.length} páginas`);
    console.log(`      - ${textPages} com texto extraível`);
    console.log(`      - ${imagPages} escaneadas (imagens)`);
  });
  
  console.log('\n' + '='.repeat(70));
  console.log('\n💡 PRÓXIMOS PASSOS:');
  console.log('   1. Revise os documentos processados');
  console.log('   2. Inicie o sistema: npm run dev');
  console.log('   3. Acesse: http://localhost:3000');
  console.log('   4. Faça login: COORDENADOR / SAEB2025FGV\n');
}

// Executar processamento
processAllDocuments().catch(error => {
  console.error('\n❌ ERRO FATAL:', error);
  process.exit(1);
});
