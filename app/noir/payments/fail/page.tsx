export default function PaymentFailPage() {
  return (
    <main className="max-w-[480px] mx-auto min-h-screen flex flex-col items-center justify-center bg-[#F5EFE4] px-6 text-center">
      <div className="text-[48px] mb-4">😢</div>
      <h1 className="font-bold text-[22px] text-[#1C1A17] mb-2">결제가 취소되었어요</h1>
      <p className="text-[#4A443B] text-[15px] leading-[1.6]">
        뒤로 가서 다시 시도해주세요.
      </p>
    </main>
  );
}
