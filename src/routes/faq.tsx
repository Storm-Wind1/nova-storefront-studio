import { createFileRoute, Link } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { pageMeta } from "@/components/page-meta";

export const Route = createFileRoute("/faq")({
  head: () => pageMeta("FAQ", "Answers about shipping, returns, the demo checkout and how this concept store works.", "/faq"),
  component: Faq,
});

const faqs = [
  ["Is NOVA a real store?", "No. NOVA is a fictional brand and this site is a frontend portfolio demonstration. Nothing can actually be bought."],
  ["Will I be charged at checkout?", "Never. The demo checkout asks for no card details, connects to no payment provider and takes no money."],
  ["What happens to the details I type at checkout?", "They stay in your browser's memory only for the review step and are not saved. The confirmation keeps only the products, quantities and totals."],
  ["How is shipping calculated?", "Standard shipping is $8.00, free on orders of $150 or more. Express is $18.00. These are illustrative demo rates."],
  ["Why does my cart remember items?", "Your cart and wishlist are saved in this browser's local storage so they survive a refresh. Clearing site data resets them."],
  ["What is your returns policy?", "In this concept, NOVA offers 30-day returns and a 2-year warranty — shown to illustrate typical store content."],
];

function Faq() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-4xl md:text-5xl">Frequently asked questions</h1>
      <Accordion type="single" collapsible className="mt-10">
        {faqs.map(([q, a], i) => (
          <AccordionItem key={i} value={`q${i}`}>
            <AccordionTrigger className="text-left text-base">{q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <p className="mt-10 text-muted-foreground">Still curious? <Link to="/contact" className="text-foreground underline">Send us a (simulated) message</Link>.</p>
    </div>
  );
}
