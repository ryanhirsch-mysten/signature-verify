import { CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CopyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <Button variant="ghost" size="xs" onClick={() => navigator.clipboard.writeText(value)}>
          <CopyIcon data-icon="inline-start" />
          Copy
        </Button>
      </div>
      <p className="rounded-lg bg-muted p-2.5 font-mono text-sm break-all whitespace-pre-wrap">{value}</p>
    </div>
  );
}
