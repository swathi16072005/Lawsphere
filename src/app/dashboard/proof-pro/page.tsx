"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { assessCaseAction } from "./actions";
import type { AssessCaseOutput } from "@/ai/flows/assess-case-and-suggest-proofs";
import { Loader2, Sparkles, CheckSquare, Gauge } from "lucide-react";
import { AgenticSteps } from "@/components/ai/agentic-steps";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  inputType: z.enum(["description", "document"]),
  legalSituationDescription: z.string().optional(),
  file: z.instanceof(File).optional(),
}).refine(data => {
    if (data.inputType === 'description') return !!data.legalSituationDescription && data.legalSituationDescription.length >= 20;
    if (data.inputType === 'document') return !!data.file && data.file.size > 0;
    return false;
}, {
    message: "Please provide either a description (min 20 chars) or a file.",
    path: ["legalSituationDescription"], // show error on one of the fields
});

type FormSchema = z.infer<typeof formSchema>;

const agenticSteps = [
    "Receiving your case details...",
    "Analyzing context and legal standing...",
    "Comparing against known legal scenarios...",
    "Calculating preliminary case strength...",
    "Identifying key evidence points...",
    "Finalizing suggestions and strength score...",
];


export default function ProofProPage() {
  const [assessment, setAssessment] = useState<AssessCaseOutput | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inputType: "description",
    },
  });

  async function onSubmit(values: FormSchema) {
    setIsProcessing(true);
    setAssessment(null);

    let result;
    if (values.inputType === 'description' && values.legalSituationDescription) {
        result = await assessCaseAction({ legalSituationDescription: values.legalSituationDescription });
    } else if (values.inputType === 'document' && values.file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const documentDataUri = e.target?.result as string;
            const actionResult = await assessCaseAction({ documentDataUri });
            handleResult(actionResult);
        };
        reader.readAsDataURL(values.file);
        return; // handleResult will be called by FileReader
    } else {
        toast({ variant: "destructive", title: "Invalid Input", description: "Please provide the required input." });
        setIsProcessing(false);
        return;
    }
    
    handleResult(result);
  }
  
  function handleResult(result: { success: boolean; data: AssessCaseOutput | null; error?: string }) {
      if (result.success && result.data) {
        setAssessment(result.data);
      } else {
        toast({ variant: "destructive", title: "Assessment Failed", description: result.error });
      }
      setIsProcessing(false);
  }

  return (
    <div className="container mx-auto px-0">
      <PageHeader
        title="Proof Pro"
        description="Get an AI-powered assessment of your case strength and a checklist of proofs to gather."
      />

      <Card className="mt-8">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Tabs defaultValue="description" className="w-full" onValueChange={(value) => form.setValue('inputType', value as "description" | "document")}>
                    <CardHeader>
                        <CardTitle>Provide Your Case Details</CardTitle>
                        <CardDescription>Choose one of the methods below to describe your situation.</CardDescription>
                         <TabsList className="grid w-full grid-cols-2 mt-2">
                            <TabsTrigger value="description">Describe Situation</TabsTrigger>
                            <TabsTrigger value="document">Upload Document</TabsTrigger>
                        </TabsList>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <TabsContent value="description">
                             <FormField
                                control={form.control}
                                name="legalSituationDescription"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Legal Problem</FormLabel>
                                    <FormControl>
                                    <Textarea
                                        placeholder="e.g., My online order was cancelled but I was still charged..."
                                        rows={5}
                                        {...field}
                                    />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </TabsContent>
                        <TabsContent value="document">
                            <FormField
                                control={form.control}
                                name="file"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Legal Document</FormLabel>
                                    <FormControl>
                                    <Input
                                        type="file"
                                        accept=".txt,.pdf,.doc,.docx"
                                        onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                                    />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </TabsContent>
                        <Button type="submit" disabled={isProcessing}>
                            {isProcessing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Assessing...
                            </>
                            ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Assess My Case
                            </>
                            )}
                        </Button>
                    </CardContent>
                </Tabs>
            </form>
        </Form>
      </Card>

      {isProcessing && <AgenticSteps steps={agenticSteps} isProcessing={isProcessing} />}

      {assessment && (
        <div className="mt-8 space-y-8 animate-in fade-in duration-500">
            <Card className="glass-card">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Gauge className="w-6 h-6 text-primary" />
                        <CardTitle className="font-headline">Case Strength Assessment</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Progress value={assessment.caseStrengthScore} className="w-full h-4" />
                        <span className="text-xl font-bold font-headline text-primary">{assessment.caseStrengthScore}%</span>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-1">Explanation:</h4>
                        <p className="text-muted-foreground text-sm">{assessment.caseStrengthExplanation}</p>
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <CheckSquare className="w-6 h-6 text-primary" />
                        <CardTitle className="font-headline">Suggested Proofs Checklist</CardTitle>
                    </div>
                     <CardDescription>Gathering these items can help strengthen your legal position.</CardDescription>
                </CardHeader>
                <CardContent>
                   <ul className="space-y-3">
                        {assessment.suggestedProofs.map((proof, index) => (
                            <li key={index} className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                                <CheckSquare className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                                <span>{proof}</span>
                            </li>
                        ))}
                   </ul>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
