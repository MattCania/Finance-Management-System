// Account Schema (Properties)
const AccountProperties = {
  email: { type: "string" },
  password: { type: "string" },
  firstname: { type: "string" },
  middlename: { type: "string" },
  lastname: { type: "string" },
  birthday: { type: "string"},
  address: { type: "string" },
  country: { type: "string" },
  timezone: { type: "string" },
  currency: { type: "string" },
  initial_deposit: { type: "number" },
  income_period: { type: "string" },
  income_amount: { type: "number" },
};

// Error Response
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ErrorResponse = () => ({
  type: "object",
  required: ["error", "type", "code", "ok"],
  properties: {
    error: { type: "string" },
    type: { type: "string" },
    code: { type: "number" },
    ok: { type: "boolean" },
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FailureResponse = (error: Record<string, any>) => ({
  type: "object",
  properties: {
    server_failure: {
		type: "object",
		properties: error
	},
    ok: { type: "boolean" },
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SuccessResponse = (data?: object) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response: any = {
    type: "object",
    required: ["success", "ok"],
    properties: {
      success: { type: "string" },
      ok: { type: "boolean" },
    },
  };

  if (data) {
    response.required.push("data");
    response.properties.data = {
      type: "object",
      properties: data,
    };
  }

  return response;
};


export { FailureResponse, SuccessResponse, ErrorResponse, AccountProperties };
