import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// 환경 변수 로드
config({ path: '.env.local' });

// Supabase 클라이언트 생성
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkSchema() {
  try {
    // authors 테이블 구조 확인
    const { data, error } = await supabase
      .from('authors')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('스키마 확인 오류:', error);
      
      // 테이블이 없으면 기본 스키마로 생성 시도
      if (error.code === 'PGRST116') {
        console.log('테이블이 없습니다. 기본 스키마로 생성을 시도합니다...');
        
        // 먼저 간단한 데이터로 테이블 생성 시도
        const { error: insertError } = await supabase
          .from('authors')
          .insert({
            name_korean: '테스트',
            name_original: 'Test'
          });
        
        if (insertError) {
          console.log('삽입 오류를 통해 스키마 확인:', insertError);
        }
      }
    } else {
      console.log('authors 테이블 스키마:');
      console.log('컬럼:', Object.keys(data[0] || {}));
      if (data.length > 0) {
        console.log('샘플 데이터:', data[0]);
      }
    }
    
    // 다른 방법: Postgres meta API 사용 (가능한 경우)
    try {
      const { data: schemaData, error: schemaError } = await supabase
        .rpc('get_table_schema', { table_name: 'authors' });
      
      if (!schemaError && schemaData) {
        console.log('\n테이블 스키마 정보:', schemaData);
      }
    } catch (e) {
      console.log('RPC 호출은 지원되지 않습니다.');
    }
    
  } catch (err) {
    console.error('오류 발생:', err);
  }
}

checkSchema();
