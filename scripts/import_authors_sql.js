import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

// 환경 변수 로드
config({ path: '.env.local' });

// 데이터 변환 및 SQL 생성
async function generateSQL() {
  // JSON 파일 읽기
  const authorsPath = path.join(process.cwd(), '작가_db.json');
  const fileContent = fs.readFileSync(authorsPath, 'utf8');
  const authorsData = JSON.parse(fileContent);
  
  console.log(`${authorsData.length}명의 작가 데이터를 가져왔습니다.`);
  
  // 중복 제거 및 데이터 정제
  const uniqueAuthors = [];
  const seen = new Set();
  
  authorsData.forEach(author => {
    const key = author['작가(한글)'];
    if (!seen.has(key) && key && key.trim() !== '') {
      seen.add(key);
      uniqueAuthors.push({
        name_korean: key.trim(),
        name_original: author['작가(영어/원어)'] ? author['작가(영어/원어)'].trim() : null
      });
    }
  });
  
  console.log(`중복을 제거한 ${uniqueAuthors.length}명의 작가를 SQL로 변환합니다.`);
  
  // SQL 파일 생성
  const sqlStatements = [];
  sqlStatements.push('INSERT INTO authors (name_korean, name_original) VALUES');
  
  uniqueAuthors.forEach((author, index) => {
    const nameOriginal = author.name_original ? `'${author.name_original.replace(/'/g, "''")}'` : 'NULL';
    sqlStatements.push(`  ('${author.name_korean.replace(/'/g, "''")}', ${nameOriginal})${index < uniqueAuthors.length - 1 ? ',' : ';'}`);
  });
  
  // SQL 파일에 쓰기
  const sqlContent = sqlStatements.join('\n');
  fs.writeFileSync(path.join(process.cwd(), 'insert_authors.sql'), sqlContent, 'utf8');
  
  console.log('SQL 파일이 생성되었습니다: insert_authors.sql');
  console.log('이 파일을 Supabase SQL 편집기에서 실행하거나 MCP를 통해 실행하세요.');
}

generateSQL().catch(console.error);
