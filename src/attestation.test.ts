import { describe, expect, test } from "bun:test";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { attestationMessage, verifyAttestation } from "./attestation.ts";

const signer = Ed25519Keypair.generate();
const address = signer.toSuiAddress();
const nonce = "support-ticket-4821";

async function signAttestation(keypair: Ed25519Keypair, forAddress: string, forNonce = nonce) {
  const { signature } = await keypair.signPersonalMessage(attestationMessage({ address: forAddress, nonce: forNonce }));
  return signature;
}

describe("attestationMessage", () => {
  test("states its Slush support purpose and embeds the normalized address and the nonce", () => {
    const message = new TextDecoder().decode(
      attestationMessage({ address: address.toUpperCase().replace("0X", "0x"), nonce }),
    );
    expect(message).toBe(
      [
        "Slush support verification",
        "",
        `This is my assertion that I control the private key for the address ${address}.`,
        `Nonce: ${nonce}`,
        "",
        "Only sign this if you contacted Slush support yourself. Never sign it at someone else's request.",
      ].join("\n"),
    );
  });
});

describe("verifyAttestation", () => {
  test("accepts a signature over the attestation for the signer's address and nonce", async () => {
    const signature = await signAttestation(signer, address);
    expect(await verifyAttestation({ address, nonce, signature })).toBe(true);
  });

  test("rejects a signature over a different nonce", async () => {
    const signature = await signAttestation(signer, address, "an-older-nonce");
    expect(await verifyAttestation({ address, nonce, signature })).toBe(false);
  });

  test("rejects a signature produced by a different key", async () => {
    const signature = await signAttestation(Ed25519Keypair.generate(), address);
    expect(await verifyAttestation({ address, nonce, signature })).toBe(false);
  });

  test("rejects a valid signature checked against another address", async () => {
    const other = Ed25519Keypair.generate().toSuiAddress();
    const signature = await signAttestation(signer, address);
    expect(await verifyAttestation({ address: other, nonce, signature })).toBe(false);
  });

  test("rejects a malformed signature", async () => {
    expect(await verifyAttestation({ address, nonce, signature: "not-a-signature" })).toBe(false);
  });

  test("rejects an invalid address", async () => {
    const signature = await signAttestation(signer, address);
    expect(await verifyAttestation({ address: "0xnope", nonce, signature })).toBe(false);
  });
});
