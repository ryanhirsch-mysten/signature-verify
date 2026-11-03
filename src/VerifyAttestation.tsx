import { createId } from "@paralleldrive/cuid2";
import { CircleCheckIcon, CircleXIcon, RefreshCwIcon, TriangleAlertIcon } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { attestationText, verifyAttestation } from "./attestation.ts";
import { CopyField } from "./CopyField.tsx";
import { Section } from "./Section.tsx";
import { suiClient } from "./sui.ts";
import { TextField } from "./TextField.tsx";

type Verdict =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "valid" }
  | { status: "invalid" }
  | { status: "error"; message: string };

export function VerifyAttestation() {
  const [address, setAddress] = useState("");
  const [nonce, setNonce] = useState("");
  const [signature, setSignature] = useState("");
  const [verdict, setVerdict] = useState<Verdict>({ status: "idle" });
  const isChecking = verdict.status === "checking";
  const attestation = address.trim() && nonce.trim() ? { address: address.trim(), nonce: nonce.trim() } : undefined;

  async function verify(event: FormEvent) {
    event.preventDefault();
    if (!attestation) return;
    setVerdict({ status: "checking" });
    try {
      const isValid = await verifyAttestation({ ...attestation, signature: signature.trim(), client: suiClient });
      setVerdict({ status: isValid ? "valid" : "invalid" });
    } catch (cause) {
      setVerdict({ status: "error", message: cause instanceof Error ? cause.message : String(cause) });
    }
  }

  function generateNonce() {
    setNonce(createId());
    setVerdict({ status: "idle" });
  }

  return (
    <Section title="Verify">
      <form onSubmit={verify} onChange={() => setVerdict({ status: "idle" })} className="flex flex-col gap-4">
        <TextField label="Address" value={address} onChange={setAddress} disabled={isChecking} />
        <TextField label="Expected nonce" value={nonce} onChange={setNonce} disabled={isChecking} />
        <Button variant="outline" size="sm" className="self-start" onClick={generateNonce} disabled={isChecking}>
          <RefreshCwIcon data-icon="inline-start" />
          Generate nonce
        </Button>
        <TextField label="Signature" value={signature} onChange={setSignature} disabled={isChecking} rows={4} />
        {attestation && <CopyField label="Expected message" value={attestationText(attestation)} />}
        <Button type="submit" className="self-start" disabled={!attestation || !signature.trim() || isChecking}>
          {isChecking ? "Verifying…" : "Verify"}
        </Button>
      </form>
      <VerdictMessage verdict={verdict} />
    </Section>
  );
}

function VerdictMessage({ verdict }: { verdict: Verdict }) {
  switch (verdict.status) {
    case "valid":
      return (
        <Alert className="text-green-700">
          <CircleCheckIcon />
          <AlertTitle>Valid</AlertTitle>
          <AlertDescription>This address signed the attestation with this nonce.</AlertDescription>
        </Alert>
      );
    case "invalid":
      return (
        <Alert variant="destructive">
          <CircleXIcon />
          <AlertTitle>Invalid</AlertTitle>
          <AlertDescription>The signature does not match this address and nonce.</AlertDescription>
        </Alert>
      );
    case "error":
      return (
        <Alert>
          <TriangleAlertIcon />
          <AlertTitle>Could not verify</AlertTitle>
          <AlertDescription>{verdict.message}</AlertDescription>
        </Alert>
      );
    default:
      return null;
  }
}
