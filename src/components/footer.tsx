import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-8 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="flex items-center">
              <Logo className="h-8 w-auto text-primary" />
              <span className="self-center ml-3 text-2xl font-semibold whitespace-nowrap font-headline">
                LawSphere
              </span>
            </Link>
            <p className="mt-2 text-sm max-w-xs">AI-powered legal assistant for the common citizen in India.</p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
             {/* Can add footer links here in the future */}
          </div>
        </div>
        <hr className="my-6 border-border sm:mx-auto lg:my-8" />
        <div className="text-center text-sm text-muted-foreground">
          <p className="font-semibold">Legal Disclaimer</p>
          <p className="mt-1">
            LawSphere is an AI-powered tool and is not a substitute for professional legal advice. The information provided is for educational purposes only. Always consult with a qualified legal professional for any legal issues.
          </p>
          <p className="mt-4">&copy; {new Date().getFullYear()} LawSphere. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
