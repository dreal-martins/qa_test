export {};

declare global {
  namespace NodeJS {
    interface Global {
      fetchBankCSV: () => Promise<
        { transactionId: string; amount: number; date: string }[]
      >;
      getCustomerByAcquireId: (
        id: string
      ) => Promise<{ customerId: string; name: string }>;
      allocateFunds: (
        map: Record<string, string>
      ) => Promise<
        {
          transactionId: string;
          acquireId: string;
          customerId: string;
          status: string;
        }[]
      >;
    }
  }

  var fetchBankCSV: NodeJS.Global["fetchBankCSV"];
  var getCustomerByAcquireId: NodeJS.Global["getCustomerByAcquireId"];
  var allocateFunds: NodeJS.Global["allocateFunds"];
}
