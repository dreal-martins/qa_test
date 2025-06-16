export async function identifyAcquireIds(
  data: any[]
): Promise<Record<string, string>> {
  return Object.fromEntries(
    data.map((txn) => [txn.transactionId, `acquire_${txn.transactionId}`])
  );
}

export async function getCustomerByAcquireId(id: string) {
  return global.getCustomerByAcquireId(id);
}

export async function allocateFunds(map: Record<string, string>) {
  return global.allocateFunds(map);
}
