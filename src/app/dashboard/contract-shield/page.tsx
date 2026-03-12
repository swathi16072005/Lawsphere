"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { analyzeContractAction } from "./actions";
import type { AnalyzeContractOutput } from "@/ai/flows/analyze-legal-contract";
import { Loader2, FileText, BadgeCheck, BadgeAlert, AlertTriangle, FileWarning, HelpCircle } from "lucide-react";
import { AgenticSteps } from "@/components/ai/agentic-steps";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  file: z.instanceof(File).refine((file) => file.size > 0, "A file is required."),
});

const agenticSteps = [
    "Receiving contract document...",
    "Extracting text content...",
    "Identifying individual clauses...",
    "Assessing clauses against legal standards...",
    "Checking for missing standard clauses...",
    "Compiling analysis report...",
];

export default function ContractShieldPage() {
  const [analysisResult, setAnalysisResult] = useState<AnalyzeContractOutput | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsProcessing(true);
    setAnalysisResult(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const contractContent = e.target?.result as string;
      if (!contractContent) {
        toast({
          variant: "destructive",
          title: "File Error",
          description: "Could not read the content of the file.",
        });
        setIsProcessing(false);
        return;
      }
      
      const result = await analyzeContractAction({ contractContent });

      if (result.success && result.data) {
        setAnalysisResult(result.data);
      } else {
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: result.error,
        });
      }
      setIsProcessing(false);
    };
    reader.onerror = () => {
        toast({
            variant: "destructive",
            title: "File Read Error",
            description: "An error occurred while reading the file.",
        });
        setIsProcessing(false);
    };
    reader.readAsText(values.file);
  }

  return (
    <div className="container mx-auto px-0">
      <PageHeader
        title="Contract Shield"
        description="Upload a contract (.txt file) to have our AI analyze it for potentially unfair clauses and highlight important missing terms."
      />

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Analyze a Contract</CardTitle>
          <CardDescription>Only .txt files are supported at this time.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Document</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".txt"
                        onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
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
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Analyze Contract
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isProcessing && <AgenticSteps steps={agenticSteps} isProcessing={isProcessing} />}

      {analysisResult && (
        <div className="mt-8 space-y-8">
          <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <FileWarning className="w-6 h-6 text-accent" />
                    <CardTitle className="font-headline">Missing Clauses</CardTitle>
                </div>
              <CardDescription>
                Important clauses that are typically found in this type of contract but are missing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analysisResult.missingClauses.length > 0 ? (
                <Accordion type="multiple" className="w-full">
                    {analysisResult.missingClauses.map((clause, index) => (
                        <AccordionItem value={`missing-${index}`} key={index}>
                            <AccordionTrigger className="text-base font-semibold">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                                    <span>{clause.name}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="text-base space-y-2 pt-2">
                                <p>{clause.reason}</p>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
              ) : (
                <p className="text-muted-foreground">No significant missing clauses were identified.</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <HelpCircle className="w-6 h-6 text-primary" />
                    <CardTitle className="font-headline">Clause Analysis</CardTitle>
                </div>
              <CardDescription>
                An assessment of the clauses found in your document.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analysisResult.clauses.length > 0 ? (
                <Accordion type="multiple" className="w-full">
                {analysisResult.clauses.map((clause, index) => (
                  <AccordionItem value={`clause-${index}`} key={index}>
                    <AccordionTrigger className="text-base font-semibold text-left">
                       <div className="flex items-start gap-3 w-full">
                            {clause.assessment === 'Unfair' ? (
                                <BadgeAlert className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                            ) : (
                                <BadgeCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                            )}
                            <div className="flex-grow">{clause.type}</div>
                       </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-base space-y-4 pt-2">
                        <div>
                            <Badge variant={clause.assessment === 'Unfair' ? 'destructive' : 'secondary'} className={clause.assessment === 'Standard' ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" : ""}>
                                {clause.assessment}
                            </Badge>
                            <p className="mt-2 text-sm text-muted-foreground italic border-l-4 pl-4 my-2">"{clause.text}"</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm mb-1">Explanation:</h4>
                            <p className="text-sm">{clause.explanation}</p>
                        </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              ) : (
                <p className="text-muted-foreground">Could not identify any specific clauses for analysis.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
