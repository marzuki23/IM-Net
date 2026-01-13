const DUITKU_MERCHANT_CODE = process.env.DUITKU_MERCHANT_CODE;
const DUITKU_API_KEY = process.env.DUITKU_API_KEY;
const DUITKU_API_URL =
  process.env.DUITKU_API_URL || "https://sandbox.duitku.com";

interface DuitkuPaymentRequest {
  amount: number;
  phone: string;
  email: string;
  invoiceNumber: string;
  description: string;
  returnUrl: string;
  expiryPeriod: number;
}

interface DuitkuPaymentResponse {
  statusCode: string;
  statusMessage: string;
  reference: string;
  paymentUrl: string;
}

export async function createDuitkuPayment(
  params: DuitkuPaymentRequest
): Promise<DuitkuPaymentResponse> {
  if (!DUITKU_MERCHANT_CODE || !DUITKU_API_KEY) {
    throw new Error("DuitKu credentials not configured");
  }

  const signature = createSignature(params.invoiceNumber, params.amount);

  const payload = {
    merchantCode: DUITKU_MERCHANT_CODE,
    paymentAmount: params.amount,
    paymentMethod: "ALL",
    paymentDescription: params.description,
    merchantOrderId: params.invoiceNumber,
    merchantUserInfo: params.phone,
    customerVaName: params.email,
    email: params.email,
    phoneNumber: params.phone,
    returnUrl: params.returnUrl,
    expiryPeriod: params.expiryPeriod,
    signature: signature,
  };

  try {
    const response = await fetch(
      `${DUITKU_API_URL}/api/merchant/createinvoice`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create DuitKu payment");
    }

    return await response.json();
  } catch (error) {
    console.error("DuitKu payment error:", error);
    throw error;
  }
}

export function createSignature(
  merchantOrderId: string,
  amount: number
): string {
  if (!DUITKU_API_KEY) {
    throw new Error("DuitKu API key not configured");
  }

  const data = DUITKU_MERCHANT_CODE + merchantOrderId + amount + DUITKU_API_KEY;
  const crypto = require("crypto");
  return crypto.createHash("md5").update(data).digest("hex");
}

export async function checkPaymentStatus(invoiceNumber: string): Promise<any> {
  if (!DUITKU_MERCHANT_CODE || !DUITKU_API_KEY) {
    throw new Error("DuitKu credentials not configured");
  }

  const signature = createSignature(invoiceNumber, 0); // Amount is not needed for checking status

  try {
    const response = await fetch(
      `${DUITKU_API_URL}/api/merchant/inquiryinvoice`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          merchantCode: DUITKU_MERCHANT_CODE,
          merchantOrderId: invoiceNumber,
          signature: signature,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to check payment status");
    }

    return await response.json();
  } catch (error) {
    console.error("DuitKu status check error:", error);
    throw error;
  }
}
