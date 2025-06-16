export async function parseCSVFromBank() {
  return global.fetchBankCSV();
}

export async function uploadToGoogleSheet(data: any[]) {
  return { status: "success" };
}
