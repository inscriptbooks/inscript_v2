export default function RefundTermsContent() {
  return (
    <div className="flex flex-col gap-4 text-sm leading-6 text-gray-3">
      <h3 className="font-semibold text-primary">[전자책 이용 및 환불 규정]</h3>

      <h3 className="font-semibold text-primary">
        제1조 (디지털 콘텐츠의 정의 및 환불 원칙)
      </h3>
      <p>
        본 상품은 구매와 동시에 다운로드 권한이 부여되는{" "}
        <strong>디지털 콘텐츠(정보통신물)</strong>입니다. 「전자상거래 등에서의
        소비자보호에 관한 법률」에 의거하여, 디지털 콘텐츠의 제공이
        개시된(파일을 다운로드하거나 열람한) 이후에는 가치가 현저히 감소한
        것으로 간주하여 청약 철회 및 환불이 불가능합니다.
      </p>

      <h3 className="font-semibold text-primary">
        제2조 (주문 제작 상품 특약 및 워터마크 안내)
      </h3>
      <p>
        본 상품은 구매자의 계정 정보(ID 등)가 파일 내부에{" "}
        <strong>
          워터마크로 즉시 각인되어 생성되는 ‘주문 제작형(Order-made)’ 재화
        </strong>
        입니다. 이는 타인에게 양도 및 재판매가 불가능한 개별 맞춤형 상품이므로,{" "}
        <strong>[다운로드]</strong> 버튼을 클릭하여 파일 생성이 시작된
        시점부터는 단순 변심에 의한 환불이 절대 불가합니다.
      </p>

      <h3 className="font-semibold text-primary">
        제3조 (다운로드 기한 및 소멸)
      </h3>
      <p>
        콘텐츠의 다운로드 유효 기간은 <strong>구매일로부터 14일(2주)</strong>
        입니다. 구매자는 해당 기간 내에 파일을 다운로드하여 소장해야 하며, 기간
        만료 이후에는 재다운로드 및 환불 요청이 불가능합니다.
      </p>

      <h3 className="font-semibold text-primary">제4조 (예외적 환불 규정)</h3>
      <p>
        파일을{" "}
        <strong>다운로드하지 않은 상태에서 구매일로부터 14일(2주) 이내</strong>
        에는 청약 철회(전액 환불)가 가능합니다. 단, 판매자의 귀책사유(파일 손상,
        서버 오류 등)로 인해 정상적인 이용이 불가능한 경우, 기간에 관계없이 전액
        환불 또는 정상 파일로 재발송 조치합니다.
      </p>
    </div>
  );
}
