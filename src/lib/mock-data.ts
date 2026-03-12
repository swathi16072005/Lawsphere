export type Lawyer = {
    id: string;
    name: string;
    avatar: string;
    specialties: string[];
    location: string;
    description: string;
};

export const mockLawyers: Lawyer[] = [
    {
        id: "1",
        name: "Adv. Priya Sharma",
        avatar: "https://picsum.photos/seed/lawyer1/200/200",
        specialties: ["Consumer Protection", "Property Law"],
        location: "Delhi, DL",
        description: "Specializes in consumer disputes and real estate matters with over 10 years of experience.",
    },
    {
        id: "2",
        name: "Adv. Rohan Gupta",
        avatar: "https://picsum.photos/seed/lawyer2/200/200",
        specialties: ["Cyber Law", "Intellectual Property"],
        location: "Bangalore, KA",
        description: "Expert in IT Act, data privacy, and trademark law. Helps startups and tech companies.",
    },
    {
        id: "3",
        name: "Adv. Anjali Menon",
        avatar: "https://picsum.photos/seed/lawyer3/200/200",
        specialties: ["Family Law", "Divorce"],
        location: "Mumbai, MH",
        description: "Compassionate and experienced lawyer handling matrimonial and child custody cases.",
    },
    {
        id: "4",
        name: "Adv. Vikram Singh",
        avatar: "https://picsum.photos/seed/lawyer4/200/200",
        specialties: ["Criminal Law"],
        location: "Chandigarh, PB",
        description: "Dedicated criminal defense attorney with a strong track record in trial advocacy.",
    },
    {
        id: "5",
        name: "Adv. Sunita Reddy",
        avatar: "https://picsum.photos/seed/lawyer5/200/200",
        specialties: ["Corporate Law", "Employment Law"],
        location: "Hyderabad, TS",
        description: "Advises businesses on corporate governance and handles employment contract disputes.",
    },
    {
        id: "6",
        name: "Adv. Manish Desai",
        avatar: "https://picsum.photos/seed/lawyer6/200/200",
        specialties: ["Tax Law", "Property Law"],
        location: "Ahmedabad, GJ",
        description: "Focuses on tax litigation and property registration matters for individuals and businesses.",
    },
];

export const allSpecialties = [...new Set(mockLawyers.flatMap(l => l.specialties))].sort();
