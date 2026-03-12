import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowRight, Gavel, ShieldCheck, Scale, Users } from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "Justice Navigator",
    description: "Describe your legal problem and get a clear, AI-generated action plan with relevant laws and past cases.",
    href: "/dashboard/justice-navigator",
    icon: Gavel,
  },
  {
    title: "Contract Shield",
    description: "Upload your contracts to automatically identify and understand unfair clauses and potential risks.",
    href: "/dashboard/contract-shield",
    icon: ShieldCheck,
  },
  {
    title: "Proof Pro",
    description: "Assess the strength of your case and receive a checklist of evidence to collect, all powered by AI.",
    href: "/dashboard/proof-pro",
    icon: Scale,
  },
  {
    title: "Lawyer Connect",
    description: "Find and connect with legal professionals who specialize in your specific area of need.",
    href: "/dashboard/lawyer-connect",
    icon: Users,
  },
];

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-0">
      <PageHeader
        title="Welcome to LawSphere"
        description="Your personal AI legal assistant. Choose a tool below to get started."
      />

      <div className="grid gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-2">
        {features.map((feature) => (
          <Card key={feature.title} className="flex flex-col hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-primary text-primary-foreground p-3 rounded-lg">
                  <feature.icon className="w-6 h-6" />
                </div>
                <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
            <div className="p-6 pt-0">
              <Button asChild variant="outline">
                <Link href={feature.href}>
                  Launch Tool <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
