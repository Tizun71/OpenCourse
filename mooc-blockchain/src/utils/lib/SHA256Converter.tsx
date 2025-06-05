export async function hashJsonSha256(data: any) {
  const orderedData: { [key: string]: any } = {};

  Object.keys(data)
    .sort()
    .forEach((key) => {
      orderedData[key] = data[key];
    });

  const json = JSON.stringify(orderedData);
  const encoder = new TextEncoder();
  const encoded = encoder.encode(json);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}
