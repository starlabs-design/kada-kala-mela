import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Phone, Plus, Search, MessageCircle, User } from "lucide-react";
import BottomNav from "@/components/BottomNav";

interface Seller {
  id: string;
  name: string;
  phone: string;
  productType: string;
  address?: string;
  notes?: string;
}

const Sellers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sellers] = useState<Seller[]>([
    {
      id: "1",
      name: "Ramesh Traders",
      phone: "+91 9876543210",
      productType: "Tea & Snacks",
      address: "Kochi",
      notes: "Wholesale tea supplier",
    },
    {
      id: "2",
      name: "Krishna Foods",
      phone: "+91 9876543211",
      productType: "Groceries",
      address: "Thrissur",
      notes: "Rice and grains",
    },
    {
      id: "3",
      name: "Mohan Beverages",
      phone: "+91 9876543212",
      productType: "Beverages",
      address: "Ernakulam",
      notes: "Soft drinks and water",
    },
  ]);

  const filteredSellers = sellers.filter((seller) =>
    seller.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${cleanPhone}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-6 py-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold">Sellers</h1>
        <p className="text-primary-foreground/90 text-sm">കച്ചവടക്കാർ</p>
      </div>

      {/* Search */}
      <div className="px-4 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search sellers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-2xl border-border bg-card"
          />
        </div>
      </div>

      {/* Sellers List */}
      <div className="px-4 space-y-3">
        {filteredSellers.map((seller) => (
          <Card key={seller.id} className="bg-card shadow-md border-0">
            <CardContent className="pt-4">
              <div className="flex gap-3">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{seller.name}</h3>
                  <p className="text-sm text-muted-foreground">{seller.phone}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="rounded-full">
                      {seller.productType}
                    </Badge>
                    {seller.address && (
                      <Badge variant="secondary" className="rounded-full">
                        {seller.address}
                      </Badge>
                    )}
                  </div>
                  {seller.notes && (
                    <p className="text-sm text-muted-foreground mt-2">{seller.notes}</p>
                  )}
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      onClick={() => handleCall(seller.phone)}
                      className="rounded-full gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      Call
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleWhatsApp(seller.phone)}
                      className="rounded-full gap-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Seller Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-lg"
            size="icon"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-3xl max-w-[90%]">
          <DialogHeader>
            <DialogTitle>Add New Seller</DialogTitle>
            <DialogDescription>Add a wholesale seller contact</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sellerName">Seller Name</Label>
              <Input id="sellerName" placeholder="Enter name" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 9876543210"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productType">Product Type</Label>
              <Input
                id="productType"
                placeholder="Tea & Snacks, Groceries, etc."
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address (Optional)</Label>
              <Input id="address" placeholder="City or area" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sellerNotes">Notes (Optional)</Label>
              <Input id="sellerNotes" placeholder="Additional notes" className="rounded-xl" />
            </div>
            <Button className="w-full rounded-xl">Add Seller</Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default Sellers;
