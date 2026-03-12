"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getLegalActionPlan } from "./actions";
import type { LegalActionPlanOutput } from "@/ai/flows/generate-legal-action-plan";
import { Loader2, BookOpen, Landmark, Sparkles, Scale } from "lucide-react";
import { AgenticSteps } from "@/components/ai/agentic-steps";

const formSchema = z.object({
  problemDescription: z.string().min(20, {
    message: "Please describe your problem in at least 20 characters.",
  }),
});

const agenticSteps = [
    "Analyzing your situation...",
    "Identifying relevant keywords...",
    "Searching knowledge base for Indian Law sections...",
    "Analyzing precedent judgments for similar cases...",
    "Simplifying legal jargon...",
    "Generating your Legal Action Plan...",
];


export default function JusticeNavigatorPage() {
  const [plan, setPlan] = useState<LegalActionPlanOutput | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      problemDescription: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsProcessing(true);
    setPlan(null);
    const result = await getLegalActionPlan(values);
    if (result.success && result.data) {
      setPlan(result.data);
    } else {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: result.error,
      });
    }
    setIsProcessing(false);
  }

  return (
    <div className="container mx-auto px-0">
      <PageHeader
        title="Justice Navigator"
        description="Describe your legal problem in plain language to receive an AI-generated Legal Action Plan."
      />

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Describe Your Situation</CardTitle>
          <CardDescription>
            Be as detailed as possible. For example, "My landlord is not returning my security deposit of Rs. 20,000 even after I moved out a month ago."
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="problemDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Legal Problem</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., I bought a new phone online and it was defective, but the company is refusing to replace it."
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Legal Action Plan
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isProcessing && <AgenticSteps steps={agenticSteps} isProcessing={isProcessing} />}

      {plan && (
        <div className="mt-8 animate-in fade-in duration-500">
            <Card className="glass-card">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <BookOpen className="w-6 h-6 text-primary" />
                        <CardTitle className="font-headline">Your Legal Action Plan</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <section>
                        <h3 className="flex items-center gap-2 font-headline text-lg font-semibold mb-3">
                            <Scale className="w-5 h-5 text-accent"/>
                            Relevant Law Sections
                        </h3>
                        <div className="space-y-4">
                            {plan.relevantLawSections.map((law, index) => (
                                <div key={index} className="p-4 border rounded-lg bg-background/70">
                                    <p className="font-semibold text-primary">{law.section}</p>
                                    <p className="text-muted-foreground mt-1 text-sm">{law.explanation}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section>
                        <h3 className="flex items-center gap-2 font-headline text-lg font-semibold mb-3">
                            <Landmark className="w-5 h-5 text-accent"/>
                            Precedent Judgments
                        </h3>
                         <div className="space-y-4">
                            {plan.precedentJudgments.map((judgment, index) => (
                                <div key={index} className="p-4 border rounded-lg bg-background/70">
                                    <p className="font-semibold text-primary">{judgment.caseName}</p>
                                    <p className="text-muted-foreground mt-1 text-sm">{judgment.summary}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section className="bg-primary/5 p-6 rounded-lg border border-primary/20">
                        <h3 className="font-headline text-lg font-semibold text-primary mb-2">Why This Matters to You</h3>
                        <p className="text-foreground/90">{plan.whyThisMatters}</p>
                    </section>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
