declare global {
  interface Window {
    TossPayments?: any;
  }
}

export async function loadTossPayments(): Promise<any> {
  if (typeof window === "undefined") {
    return null;
  }
  if (window.TossPayments) {
    return window.TossPayments;
  }
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://js.tosspayments.com/v2/standard";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("toss sdk load failed"));
    document.head.appendChild(script);
  });
  return window.TossPayments;
}

export async function getTossClient(clientKey: string): Promise<any> {
  const TossPayments = await loadTossPayments();
  if (!TossPayments) {
    return null;
  }
  return TossPayments(clientKey);
}
