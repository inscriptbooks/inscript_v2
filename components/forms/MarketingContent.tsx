export default function MarketingContent() {
  return (
    <div className="flex flex-col gap-4 text-sm leading-6 text-gray-3">
      {" "}
      <h3 className="font-semibold text-primary">
        [개인정보 수집·이용 및 마케팅 정보 수신 동의]
      </h3>{" "}
      <p>
        {" "}
        인스크립트는 관련 법령(「개인정보보호법」 등)에 따라 이벤트, 프로그램
        안내, 뉴스레터, 혜택 제공 등을 위해 아래와 같이 개인정보를
        수집·이용하고자 합니다.{" "}
      </p>
      <h3 className="font-semibold text-primary">1. 수집 항목</h3>
      <p>필수 항목: 이름, 연락처(휴대전화번호 또는 이메일)</p>
      <h3 className="font-semibold text-primary">2. 수집·이용 목적</h3>
      <ul>
        <li>인스크립트에서 진행하는 행사, 이벤트, 프로그램 안내</li>
        <li>신규 서비스 및 상품, 멤버십 혜택, 할인 정보 제공</li>
        <li>뉴스레터 및 홍보성 정보 발송 (문자, 이메일, SNS 등)</li>
      </ul>
      <h3 className="font-semibold text-primary">3. 보유·이용 기간</h3>
      <p>
        동의일로부터 **2년간 보관 후 즉시 파기**
        <br />
        (단, 관계 법령에 따라 보관이 필요한 경우 해당 기간 동안 보관)
      </p>
      <h3 className="font-semibold text-primary">
        4. 동의 거부 권리 및 불이익
      </h3>
      <p>
        귀하는 개인정보 수집·이용 및 마케팅 정보 수신에 대한 동의를 거부할 수
        있습니다.
        <br />
        단, 동의하지 않으실 경우 **이벤트 안내 및 혜택 제공이 제한**될 수
        있습니다.
      </p>
    </div>
  );
}
