import { useCurrentAccount, useDAppKit } from "@mysten/dapp-kit-react";
import { ConnectButton } from "@mysten/dapp-kit-react/ui";
import { useState } from "react";
import { attestationMessage, attestationText, type Attestation } from "./attestation.ts";
import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CopyField } from "./CopyField.tsx";
import { Section } from "./Section.tsx";
import { TextField } from "./TextField.tsx";

type SignedAttestation = Attestation & { signature: string };

export function SignAttestation() {
  const dAppKit = useDAppKit();
  const account = useCurrentAccount();
  const [nonce, setNonce] = useState("");
  const [signed, setSigned] = useState<SignedAttestation>();
  const [error, setError] = useState<string>();
  const [isSigning, setIsSigning] = useState(false);

  async function sign(attestation: Attestation) {
    setIsSigning(true);
    setError(undefined);
    try {
      const { signature } = await dAppKit.signPersonalMessage({ message: attestationMessage(attestation) });
      setSigned({ ...attestation, signature });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setIsSigning(false);
    }
  }

  const attestation = account && nonce.trim() ? { address: account.address, nonce: nonce.trim() } : undefined;
  const signedForAttestation =
    signed && signed.address === attestation?.address && signed.nonce === attestation.nonce ? signed : undefined;

  return (
    <Section title="Sign">
      <ConnectButton />
      {account && (
        <>
          <TextField label="Nonce from support" value={nonce} onChange={setNonce} disabled={isSigning} />
          {attestation && <CopyField label="Message" value={attestationText(attestation)} />}
          <Button className="self-start" onClick={() => attestation && sign(attestation)} disabled={!attestation || isSigning}>
            {isSigning ? "Waiting for wallet…" : "Sign attestation"}
          </Button>
        </>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {signedForAttestation && (
        <>
          <CopyField label="Address" value={signedForAttestation.address} />
          <CopyField label="Signature" value={signedForAttestation.signature} />
        </>
      )}
    </Section>
  );
}
