import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

// 환경 변수 로드
config({ path: '.env.local' });

// Supabase 클라이언트 생성
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// 데이터 삽입 함수
async function insertAuthorsBatch() {
  try {
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
    
    console.log(`중복을 제거한 ${uniqueAuthors.length}명의 작가를 삽입합니다.`);
    
    // 배치로 삽입 (50개씩)
    const batchSize = 50;
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < uniqueAuthors.length; i += batchSize) {
      const batch = uniqueAuthors.slice(i, i + batchSize);
      
      try {
        const { data, error } = await supabase
          .from('authors')
          .upsert(batch, { onConflict: 'name_korean' })
          .select();
        
        if (error) {
          console.error(`배치 ${i}-${i + batchSize} 삽입 중 오류:`, error);
          errorCount++;
        } else {
          console.log(`배치 ${i}-${i + batch.length} 삽입 완료 (${data.length}개)`);
          successCount++;
        }
      } catch (err) {
        console.error(`배치 ${i}-${i + batchSize} 처리 중 예외:`, err);
        errorCount++;
      }
      
      // API 요청 사이에 약간의 지연
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // 전체 카운트 확인
    const { count } = await supabase
      .from('authors')
      .select('*', { count: 'exact', head: true });
    
    console.log(`\n작업 완료!`);
    console.log(`성공: ${successCount} 배치`);
    console.log(`실패: ${errorCount} 배치`);
    console.log(`전체 authors 수: ${count}`);
    
  } catch (err) {
    console.error('오류 발생:', err);
  }
}

insertAuthorsBatch();
