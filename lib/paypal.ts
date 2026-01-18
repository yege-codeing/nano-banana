import {
  ApiError,
  Client,
  Environment,
  LogLevel,
  OrdersController,
} from "@paypal/paypal-server-sdk"

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: PAYPAL_CLIENT_ID || "",
    oAuthClientSecret: PAYPAL_CLIENT_SECRET || "",
  },
  timeout: 0,
  environment: Environment.Sandbox,
  logging: {
    logLevel: LogLevel.Info,
    logRequest: { logBody: true },
    logResponse: { logHeaders: true },
  },
})

export const ordersController = new OrdersController(client)

export async function createOrder(amount: string, currency: string = "USD") {
  const payload = {
    body: {
      intent: "CAPTURE" as const,
      purchaseUnits: [
        {
          amount: {
            currencyCode: currency,
            value: amount,
          },
        },
      ],
    },
    prefer: "return=minimal",
  }

  try {
    const { body, ...httpResponse } = await ordersController.createOrder(payload)
    return {
      jsonResponse: JSON.parse(body as string),
      httpStatusCode: httpResponse.statusCode,
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message)
    }
    throw error
  }
}

export async function captureOrder(orderID: string) {
  const collect = {
    id: orderID,
    prefer: "return=minimal",
  }

  try {
    const { body, ...httpResponse } = await ordersController.captureOrder(collect)
    return {
      jsonResponse: JSON.parse(body as string),
      httpStatusCode: httpResponse.statusCode,
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message)
    }
    throw error
  }
}
