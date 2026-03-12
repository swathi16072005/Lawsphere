"use client";

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockLawyers, allSpecialties, type Lawyer } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, MapPin, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function LawyerConnectPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('all');

    const filteredLawyers = useMemo(() => {
        return mockLawyers.filter(lawyer => {
            const matchesSearch = lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  lawyer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  lawyer.location.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesSpecialty = selectedSpecialty === 'all' || lawyer.specialties.includes(selectedSpecialty);

            return matchesSearch && matchesSpecialty;
        });
    }, [searchTerm, selectedSpecialty]);

    return (
        <div className="container mx-auto px-0">
            <PageHeader
                title="Lawyer Connect"
                description="Find legal professionals based on their specialty and location."
            />

            <Card className="mt-8">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, location, or keyword..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                            <SelectTrigger className="w-full md:w-[240px]">
                                <SelectValue placeholder="Filter by specialty" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Specialties</SelectItem>
                                {allSpecialties.map(spec => (
                                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredLawyers.map((lawyer: Lawyer) => (
                    <Card key={lawyer.id} className="flex flex-col">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Avatar className="h-20 w-20 border-2 border-primary/50">
                                <AvatarImage src={lawyer.avatar} alt={lawyer.name} />
                                <AvatarFallback>{lawyer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <CardTitle className="font-headline text-lg">{lawyer.name}</CardTitle>
                                <CardDescription className="flex items-center gap-1.5 mt-1">
                                    <MapPin className="h-4 w-4" /> {lawyer.location}
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {lawyer.specialties.map(spec => (
                                    <Badge key={spec} variant="secondary">{spec}</Badge>
                                ))}
                            </div>
                            <p className="text-sm text-muted-foreground">{lawyer.description}</p>
                        </CardContent>
                        <div className="p-6 pt-0">
                            <Button className="w-full">
                                <Mail className="mr-2 h-4 w-4" /> Contact
                            </Button>
                        </div>
                    </Card>
                ))}
                 {filteredLawyers.length === 0 && (
                    <div className="md:col-span-2 lg:col-span-3 text-center py-16">
                        <p className="text-muted-foreground">No lawyers found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
