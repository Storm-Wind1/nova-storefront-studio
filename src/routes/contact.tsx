import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { pageMeta } from "@/components/page-meta";

export const Route = createFileRoute("/contact")({
  head: () => pageMeta("Contact", "Get in touch with the NOVA studio via a simulated, validated contact form.", "/contact"),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  message: z.string().trim().min(10, "Message should be at least 10 characters").max(1000, "Keep it under 1000 characters"),
});
type F = z.infer<typeof schema>;

function Contact() {
  const [form, setForm] = useState<F>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof F, string>>>({});
  const [sent, setSent] = useState(false);
  const field = (k: keyof F, label: string, el: "input" | "textarea" = "input", type = "text") => (
    <div>
      <Label htmlFor={`c-${k}`}>{label}</Label>
      {el === "input"
        ? <Input id={`c-${k}`} type={type} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `c-${k}-err` : undefined} className="mt-1.5 h-11 bg-card" />
        : <Textarea id={`c-${k}`} rows={6} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `c-${k}-err` : undefined} className="mt-1.5 bg-card" />}
      {errors[k] && <p id={`c-${k}-err`} className="mt-1 text-sm text-destructive">{errors[k]}</p>}
    </div>
  );
  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 md:grid-cols-2">
      <div>
        <h1 className="text-4xl md:text-5xl">Say hello</h1>
        <p className="mt-4 text-muted-foreground">This form is simulated: it validates your input but sends and stores nothing.</p>
        <dl className="mt-8 space-y-3 text-sm">
          <div><dt className="font-semibold">Studio hours (fictional)</dt><dd className="text-muted-foreground">Mon–Fri, 9:00–17:00</dd></div>
          <div><dt className="font-semibold">Response time (fictional)</dt><dd className="text-muted-foreground">Within two working days</dd></div>
        </dl>
      </div>
      {sent ? (
        <div role="status" className="h-fit rounded-xl bg-accent p-8 text-accent-foreground">
          <p className="font-display text-2xl">Message received (demo)</p>
          <p className="mt-2">In a real store we'd reply soon. Nothing was actually sent.</p>
          <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>Send another</Button>
        </div>
      ) : (
        <form noValidate className="space-y-5" onSubmit={(e) => {
          e.preventDefault();
          const r = schema.safeParse(form);
          if (!r.success) {
            const errs: typeof errors = {};
            for (const i of r.error.issues) errs[i.path[0] as keyof F] ??= i.message;
            setErrors(errs); return;
          }
          setErrors({}); setForm({ name: "", email: "", message: "" }); setSent(true); toast.success("Message sent (demo)");
        }}>
          {field("name", "Name")}
          {field("email", "Email", "input", "email")}
          {field("message", "Message", "textarea")}
          <Button type="submit" size="lg">Send message</Button>
        </form>
      )}
    </div>
  );
}
