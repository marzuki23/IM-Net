import crypto from "crypto";

const DUITKU_MERCHANT_CODE = process.env.DUITKU_MERCHANT_CODE;
const DUITKU_API_KEY = process.env.DUITKU_API_KEY;

// Automatically decide endpoint based on merchant code prefix (DS = Sandbox)
const DUITKU_ENV = process.env.DUITKU_ENV || (DUITKU_MERCHANT_CODE?.startsWith("DS") ? "sandbox" : "production");
const isProd = DUITKU_ENV === "production";
const DUITKU_API_URL = process.env.DUITKU_API_URL || (isProd ? "https://api-prod.duitku.com" : "https://api-sandbox.duitku.com");

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

  const timestamp = Date.now().toString();
  const signature = crypto
    .createHash("sha256")
    .update(DUITKU_MERCHANT_CODE + timestamp + DUITKU_API_KEY)
    .digest("hex");

  // Required by Duitku Item Details summing up to amount
  const itemDetails = [
    {
      name: params.description,
      price: params.amount,
      quantity: 1,
    },
  ];

  // Provide basic dummy customer details if some values are missing, duitku requires some fields
  const customerDetail = {
    firstName: params.email.split("@")[0] || "Customer",
    lastName: "IMNET",
    email: params.email,
    phoneNumber: params.phone || "081111111111",
    billingAddress: {
      firstName: params.email.split("@")[0] || "Customer",
      lastName: "IMNET",
      address: "Alamat Pelanggan",
      city: "Jakarta",
      postalCode: "10000",
      phone: params.phone || "081111111111",
      countryCode: "ID",
    },
    shippingAddress: {
      firstName: params.email.split("@")[0] || "Customer",
      lastName: "IMNET",
      address: "Alamat Pelanggan",
      city: "Jakarta",
      postalCode: "10000",
      phone: params.phone || "081111111111",
      countryCode: "ID",
    },
  };

  const callbackUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/payments/webhook`;

  const payload = {
    paymentAmount: params.amount,
    merchantOrderId: params.invoiceNumber,
    productDetails: params.description,
    additionalParam: "",
    merchantUserInfo: "",
    paymentMethod: "", // Leave blank to allow user to choose on Duitku UI
    customerVaName: params.email.split("@")[0] || "Customer",
    email: params.email,
    phoneNumber: params.phone || "081111111111",
    itemDetails: itemDetails,
    customerDetail: customerDetail,
    callbackUrl: callbackUrl,
    returnUrl: params.returnUrl,
    expiryPeriod: params.expiryPeriod,
  };

  try {
    const response = await fetch(
      `${DUITKU_API_URL}/api/merchant/createinvoice`,
      {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "x-duitku-signature": signature,
          "x-duitku-timestamp": timestamp,
          "x-duitku-merchantcode": DUITKU_MERCHANT_CODE,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create DuitKu payment: ${errorText}`);
    }

    const data = await response.json();
    
    // Duitku Pop API returns success with statusCode '00'
    if (data.statusCode !== "00") {
      throw new Error(`DuitKu API Error: ${data.statusMessage || JSON.stringify(data)}`);
    }

    return data;
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

  // Older API/Webhook uses md5 (merchantcode + orderid + amount + apikey)
  const data = DUITKU_MERCHANT_CODE + merchantOrderId + amount + DUITKU_API_KEY;
  return crypto.createHash("md5").update(data).digest("hex");
}

export async function checkPaymentStatus(invoiceNumber: string): Promise<any> {
  if (!DUITKU_MERCHANT_CODE || !DUITKU_API_KEY) {
    throw new Error("DuitKu credentials not configured");
  }

  // standard signature for inquiry: md5(merchantCode + merchantOrderId + apiKey)
  const data = DUITKU_MERCHANT_CODE + invoiceNumber + DUITKU_API_KEY;
  const signature = crypto.createHash("md5").update(data).digest("hex");

  const coreApiUrl = isProd
    ? "https://passport.duitku.com"
    : "https://sandbox.duitku.com";

  try {
    const response = await fetch(
      `${coreApiUrl}/webapi/api/merchant/transactionStatus`,
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
