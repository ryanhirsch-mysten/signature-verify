import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignAttestation } from "./SignAttestation.tsx";
import { VerifyAttestation } from "./VerifyAttestation.tsx";

export function App() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold">Slush Support Verification</h1>
      <Tabs defaultValue="sign">
        <TabsList>
          <TabsTrigger value="sign">Sign</TabsTrigger>
          <TabsTrigger value="verify">Verify</TabsTrigger>
        </TabsList>
        <TabsContent value="sign" keepMounted>
          <SignAttestation />
        </TabsContent>
        <TabsContent value="verify" keepMounted>
          <VerifyAttestation />
        </TabsContent>
      </Tabs>
    </main>
  );
}
