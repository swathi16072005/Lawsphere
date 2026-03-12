import { Button } from "@/components/ui/button";
import { placeHolderImages } from "@/lib/placeholder-images";
import { ArrowRight, Scale, ShieldCheck, Gavel } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    name: "Justice Navigator",
    description: "Get a clear legal action plan for your problem.",
    icon: Gavel,
  },
  {
    name: "Contract Shield",
    description: "Analyze your contracts for unfair clauses.",
    icon: ShieldCheck,
  },
  {
    name: "Proof Pro",
    description: "Assess your case strength and get an evidence checklist.",
    icon: Scale,
  },
];

export default function Home() {
  const heroImage = placeHolderImages.find((img) => img.id === "hero-legal");

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="relative w-full pt-20 pb-20 md:pt-32 md:pb-32">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover object-center"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-primary/80" />
          <div className="container mx-auto px-4 md:px-6 relative text-center">
            <div className="max-w-3xl mx-auto">
              <h1 className="font-headline text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl md:text-6xl">
                Demystifying Indian Law for Everyone
              </h1>
              <p className="mt-6 text-lg leading-8 text-primary-foreground/90">
                LawSphere is your AI-powered legal assistant, designed to make complex legal information accessible, understandable, and actionable for the common citizen.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button asChild size="lg">
                  <Link href="/dashboard">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="link" size="lg" className="text-primary-foreground">
                  <Link href="#features">Learn More <span aria-hidden="true">→</span></Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-24 sm:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="font-headline text-base font-semibold leading-7 text-accent">Your Personal Legal Toolkit</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Everything you need to navigate your legal journey
              </p>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                From understanding your rights to building a strong case, LawSphere provides the tools to empower you.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-16">
                    <dt className="text-base font-semibold leading-7 text-foreground">
                      <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                        <feature.icon className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
                      </div>
                      {feature.name}
                    </dt>
                    <dd className="mt-2 text-base leading-7 text-muted-foreground">{feature.description}</dd>
                  </div>
                ))}
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-foreground">
                    <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary-foreground"><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></svg>
                    </div>
                    Agentic AI Simulation
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-muted-foreground">See how our AI "thinks" with transparent step-by-step feedback on its analysis process.</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
