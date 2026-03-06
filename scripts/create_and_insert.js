import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import fs from "fs";
import path from "path";

// 환경 변수 로드
config({ path: ".env.local" });

// Supabase 클라이언트 생성
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

async function createAndInsert() {
  try {
    console.log("Supabase 연결 확인...");

    // 1. 먼저 authors 테이블이 있는지 확인하고 없으면 생성
    console.log("authors 테이블 생성/확인...");

    // 간단한 쿼리로 테이블 상태 확인
    const { error: testError } = await supabase
      .from("authors")
      .select("count")
      .limit(1);

    if (testError && testError.code === "PGRST116") {
      console.log("테이블이 없습니다. 생성합니다...");

      // SQL을 직접 실행할 수 없으니, 데이터 삽입을 시도하여 테이블 구조 유추
      console.log("데이터 삽입을 통해 테이블 구조 생성...");
    }

    // 2. JSON 파일 읽기
    const authorsPath = path.join(process.cwd(), "작가_db.json");
    const fileContent = fs.readFileSync(authorsPath, "utf8");
    const authorsData = JSON.parse(fileContent);

    console.log(`${authorsData.length}명의 작가 데이터를 가져왔습니다.`);

    // 3. 데이터 정제 (다양한 필드 이름으로 시도)
    const cleanAuthors = [];
    const seen = new Set();

    authorsData.forEach((author) => {
      const koreanName =
        author["작가(한글)"] || author["name_korean"] || author["korean_name"];
      const originalName =
        author["작가(영어/원어)"] ||
        author["name_original"] ||
        author["original_name"];

      if (koreanName && !seen.has(koreanName) && koreanName.trim() !== "") {
        seen.add(koreanName);

        // 여러 가능한 필드 이름으로 데이터 구성
        const authorData = {
          "작가(한글)": koreanName.trim(),
          "작가(영어/원어)": originalName ? originalName.trim() : null,
          name_korean: koreanName.trim(),
          name_original: originalName ? originalName.trim() : null,
          korean_name: koreanName.trim(),
          original_name: originalName ? originalName.trim() : null,
          name: koreanName.trim(),
          english_name: originalName ? originalName.trim() : null,
        };

        cleanAuthors.push(authorData);
      }
    });

    console.log(`정제된 ${cleanAuthors.length}명의 작가를 삽입합니다.`);

    // 4. 작은 배치로 삽입 시도 (10개씩)
    const batchSize = 10;
    let inserted = 0;

    for (let i = 0; i < cleanAuthors.length && i < 30; i += batchSize) {
      // 처음 30개만 테스트
      const batch = cleanAuthors.slice(i, i + batchSize);

      try {
        const { data, error } = await supabase
          .from("authors")
          .insert(batch)
          .select();

        if (error) {
          console.error(`배치 ${i}-${i + batchSize} 오류:`, error);

          // 다른 필드 이름으로 시도
          if (error.message.includes("column")) {
            console.log("다른 필드 이름으로 시도...");
            const simplifiedBatch = batch.map((author) => ({
              name: author.name_korean,
              english_name: author.name_original,
            }));

            const { data: data2, error: error2 } = await supabase
              .from("authors")
              .insert(simplifiedBatch)
              .select();

            if (error2) {
              console.error(`간단화된 배치도 실패:`, error2);
            } else {
              console.log(`간단화된 배치 ${i}-${i + batch.length} 성공!`);
              inserted += data2.length;
            }
          }
        } else {
          console.log(`배치 ${i}-${i + batch.length} 성공!`);
          inserted += data.length;
        }
      } catch (err) {
        console.error(`배치 ${i}-${i + batchSize} 예외:`, err);
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // 5. 결과 확인
    const { data: finalData, error: finalError } = await supabase
      .from("authors")
      .select("*")
      .limit(5);

    if (!finalError && finalData.length > 0) {
      console.log("\n삽입된 데이터 샘플:");
      console.table(finalData);
      console.log(`컬럼: ${Object.keys(finalData[0]).join(", ")}`);
    }

    console.log(`\n총 ${inserted}개의 데이터 삽입 완료`);
  } catch (err) {
    console.error("오류 발생:", err);
  }
}

createAndInsert();
