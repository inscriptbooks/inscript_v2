import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// 환경 변수 로드
config({ path: '.env.local' });

// Supabase 클라이언트 생성
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkAuthors() {
  try {
    console.log('authors 테이블 조회 중...');
    
    // 테이블이 있는지 확인
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'authors');
    
    if (tablesError) {
      console.error('테이블 조회 오류:', tablesError);
    } else {
      console.log('authors 테이블 존재 여부:', tables.length > 0 ? '있음' : '없음');
    }
    
    // authors 테이블 데이터 조회
    const { data: authors, error: authorsError } = await supabase
      .from('authors')
      .select('*')
      .limit(5);
    
    if (authorsError) {
      console.error('authors 데이터 조회 오류:', authorsError);
      
      // 테이블이 없으면 생성
      if (authorsError.code === 'PGRST116') {
        console.log('authors 테이블 생성 중...');
        const { error: createError } = await supabase.rpc('exec_sql', {
          sql: `
            CREATE TABLE IF NOT EXISTS authors (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              name_korean TEXT NOT NULL,
              name_original TEXT,
              created_at TIMESTAMPTZ DEFAULT NOW(),
              updated_at TIMESTAMPTZ DEFAULT NOW()
            );
            
            ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
            
            CREATE POLICY "Enable read access for all users" ON authors FOR SELECT USING (true);
            CREATE POLICY "Enable insert access for all users" ON authors FOR INSERT WITH CHECK (true);
            CREATE POLICY "Enable update access for all users" ON authors FOR UPDATE USING (true);
            CREATE POLICY "Enable delete access for all users" ON authors FOR DELETE USING (true);
            
            CREATE INDEX IF NOT EXISTS idx_authors_name_korean ON authors(name_korean);
            CREATE INDEX IF NOT EXISTS idx_authors_name_original ON authors(name_original);
          `
        });
        
        if (createError) {
          console.error('테이블 생성 오류:', createError);
        } else {
          console.log('authors 테이블 생성 완료');
        }
      }
    } else {
      console.log('authors 데이터 (처음 5개):');
      console.table(authors);
      
      // 전체 카운트
      const { count } = await supabase
        .from('authors')
        .select('*', { count: 'exact', head: true });
      
      console.log(`전체 authors 수: ${count}`);
    }
    
  } catch (err) {
    console.error('오류 발생:', err);
  }
}

checkAuthors();
