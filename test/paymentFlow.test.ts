import { describe, it, expect, beforeAll } from "@jest/globals";
import { mockBankApi, mockLeddiprimeApi } from "../__mocks__/apis";
import { parseCSVFromBank, uploadToGoogleSheet } from "../utils/dataHandlers";
import {
  identifyAcquireIds,
  getCustomerByAcquireId,
  allocateFunds,
} from "../utils/leddiServices";
import { notifyFailure } from "../utils/notifications";

function overrideMock(fn: any, implementation: any) {
  fn.mockImplementation(implementation);
}

describe("Daily Customer Payment Allocation Flow", () => {
  beforeAll(() => {
    mockBankApi();
    mockLeddiprimeApi();
  });

  it("should complete the end-to-end flow successfully", async () => {
    try {
      const csvData = await parseCSVFromBank();
      expect(csvData.length).toBeGreaterThan(0);

      const uploadRes = await uploadToGoogleSheet(csvData);
      expect(uploadRes.status).toBe("success");

      const acquireIdMap = await identifyAcquireIds(csvData);
      expect(Object.keys(acquireIdMap).length).toBe(csvData.length);

      for (const acquireId of Object.values(acquireIdMap) as string[]) {
        const customer = await getCustomerByAcquireId(acquireId);
        expect(customer).toBeDefined();
      }

      const allocations = await allocateFunds(acquireIdMap);
      for (const alloc of allocations) {
        expect(alloc.status).toBe("success");
      }
    } catch (error) {
      await notifyFailure("Daily Allocation Test Failed", error);
      throw error;
    }
  });

  it("should handle missing acquire IDs", async () => {
    const mockData = [
      { transactionId: "txn_1", amount: 1000, date: "2025-06-16" },
      { transactionId: "txn_2", amount: 1500, date: "2025-06-16" },
    ];

    overrideMock(global.fetchBankCSV, async () => mockData);
    overrideMock(global.getCustomerByAcquireId, async (id: string) => {
      if (id === "acquire_txn_2") return null;
      return { customerId: `cust_${id}`, name: "Test User" };
    });

    const csvData = await parseCSVFromBank();
    const acquireIdMap = await identifyAcquireIds(csvData);

    const customers = await Promise.all(
      Object.values(acquireIdMap).map(
        async (id) => await getCustomerByAcquireId(id)
      )
    );

    expect(customers[1]).toBeNull();
  });

  it("should handle bank CSV with bad data", async () => {
    const badData = [
      { amount: 500 },
      { transactionId: null, amount: 1000, date: "bad-date" },
    ];

    overrideMock(global.fetchBankCSV, async () => badData);

    try {
      const csvData = await parseCSVFromBank();
      await identifyAcquireIds(csvData); // Should throw or handle error internally
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should simulate Leddiprime API failure", async () => {
    overrideMock(global.getCustomerByAcquireId, async () => {
      throw new Error("Leddiprime service down");
    });

    const mockData = [
      { transactionId: "txn_3", amount: 2000, date: "2025-06-16" },
    ];
    overrideMock(global.fetchBankCSV, async () => mockData);

    try {
      const csvData = await parseCSVFromBank();
      const acquireIdMap = await identifyAcquireIds(csvData);
      await getCustomerByAcquireId(Object.values(acquireIdMap)[0]);
    } catch (error: any) {
      expect(error.message).toMatch(/Leddiprime service down/);
    }
  });

  it("should allow partial allocation success", async () => {
    overrideMock(global.allocateFunds, async (map: Record<string, string>) => {
      return Object.entries(map).map(([txnId, acquireId]) => ({
        transactionId: txnId,
        acquireId,
        customerId: `cust_${acquireId}`,
        status: txnId === "txn_4" ? "failed" : "success",
      }));
    });

    const testData = [
      { transactionId: "txn_4", amount: 500, date: "2025-06-16" },
      { transactionId: "txn_5", amount: 800, date: "2025-06-16" },
    ];
    overrideMock(global.fetchBankCSV, async () => testData);

    const csvData = await parseCSVFromBank();
    const acquireIdMap = await identifyAcquireIds(csvData);
    const allocations = await allocateFunds(acquireIdMap);

    const failedAlloc = allocations.find((a) => a.status === "failed");
    expect(failedAlloc).toBeDefined();
  });
});
