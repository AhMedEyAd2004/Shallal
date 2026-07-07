"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";

export function RequestsUI({ requests }: { requests: any[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Form Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <p className="text-muted-foreground text-sm">No new requests.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((r) => (
              <div key={r.id} className="bg-muted/50 p-4 rounded-md space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{r.name}</p>
                    <p className="text-sm text-muted-foreground">{r.email}</p>
                  </div>
                  <Button variant="destructive" size="sm" disabled={isPending}>
                    Delete
                  </Button>
                </div>
                <div className="pt-2 text-sm bg-background p-3 rounded border">
                  {r.message}
                </div>
                <p className="text-xs text-muted-foreground text-right pt-2">
                  {new Date(r.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
