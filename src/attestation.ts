import type { ClientWithCoreApi } from "@mysten/sui/client";
import { isValidSuiAddress, normalizeSuiAddress } from "@mysten/sui/utils";
import { isValidPersonalMessageSignature } from "@mysten/sui/verify";

export type Attestation = { address: string; nonce: string };

export function attestationText({ address, nonce }: Attestation) {
  return [
    "Slush support verification",
    "",
    `This is my assertion that I control the private key for the address ${normalizeSuiAddress(address)}.`,
    `Nonce: ${nonce}`,
    "",
    "Only sign this if you contacted Slush support yourself. Never sign it at someone else's request.",
  ].join("\n");
}

export function attestationMessage(attestation: Attestation) {
  return new TextEncoder().encode(attestationText(attestation));
}

export async function verifyAttestation({
  address,
  nonce,
  signature,
  client,
}: Attestation & {
  signature: string;
  client?: ClientWithCoreApi;
}) {
  const normalizedAddress = normalizeSuiAddress(address);
  if (!isValidSuiAddress(normalizedAddress)) return false;

  return isValidPersonalMessageSignature(attestationMessage({ address: normalizedAddress, nonce }), signature, {
    address: normalizedAddress,
    ...(client && { client }),
  });
}
