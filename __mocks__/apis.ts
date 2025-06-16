export function mockBankApi() {
  global.fetchBankCSV = jest
    .fn()
    .mockResolvedValue([
      { transactionId: "txn_1", amount: 1000, date: "2025-06-16" },
    ]);
}

export function mockLeddiprimeApi() {
  global.getCustomerByAcquireId = jest.fn(async (id) => ({
    customerId: `cust_${id}`,
    name: "Test User",
  }));

  global.allocateFunds = jest.fn(async (map) =>
    Object.entries(map).map(([txnId, acquireId]) => ({
      transactionId: txnId,
      acquireId,
      customerId: `cust_${acquireId}`,
      status: "success",
    }))
  );
}
