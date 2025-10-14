import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Phone, Plus, Search, MessageCircle, User, Pencil, Trash2 } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { sellersAPI } from "@/lib/api";
import { toast } from "sonner";
import type { Seller } from "@shared/schema";

const Sellers = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addFormData, setAddFormData] = useState({
    name: "",
    phone: "",
    productType: "",
    address: "",
    notes: "",
  });

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingSeller, setEditingSeller] = useState<Seller | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    phone: "",
    productType: "",
    address: "",
    notes: "",
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingSeller, setDeletingSeller] = useState<Seller | null>(null);

  const { data: sellers = [], isLoading } = useQuery({
    queryKey: ["sellers"],
    queryFn: sellersAPI.getAll,
  });

  const createMutation = useMutation({
    mutationFn: sellersAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellers"] });
      toast.success("Seller added successfully");
      setAddDialogOpen(false);
      setAddFormData({ name: "", phone: "", productType: "", address: "", notes: "" });
    },
    onError: () => {
      toast.error("Failed to add seller");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Seller> }) =>
      sellersAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellers"] });
      toast.success("Seller updated successfully");
      setEditDialogOpen(false);
      setEditingSeller(null);
    },
    onError: () => {
      toast.error("Failed to update seller");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: sellersAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellers"] });
      toast.success("Seller deleted successfully");
      setDeleteDialogOpen(false);
      setDeletingSeller(null);
    },
    onError: () => {
      toast.error("Failed to delete seller");
    },
  });

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

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addFormData.name || !addFormData.phone || !addFormData.productType) {
      toast.error("Please fill in all required fields");
      return;
    }
    createMutation.mutate(addFormData);
  };

  const handleEditClick = (seller: Seller) => {
    setEditingSeller(seller);
    setEditFormData({
      name: seller.name,
      phone: seller.phone,
      productType: seller.productType,
      address: seller.address || "",
      notes: seller.notes || "",
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSeller) return;
    if (!editFormData.name || !editFormData.phone || !editFormData.productType) {
      toast.error("Please fill in all required fields");
      return;
    }
    updateMutation.mutate({
      id: editingSeller.id,
      data: editFormData,
    });
  };

  const handleDeleteClick = (seller: Seller) => {
    setDeletingSeller(seller);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deletingSeller) return;
    deleteMutation.mutate(deletingSeller.id);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-primary text-primary-foreground px-6 py-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold">Sellers</h1>
        <p className="text-primary-foreground/90 text-sm">കച്ചവടക്കാർ</p>
      </div>

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

      <div className="px-4 space-y-3">
        {isLoading ? (
          <p className="text-center text-muted-foreground py-8">Loading sellers...</p>
        ) : filteredSellers.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            {searchQuery ? "No sellers found" : "No sellers yet. Add your first seller!"}
          </p>
        ) : (
          filteredSellers.map((seller) => (
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
                  <div className="flex flex-col gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEditClick(seller)}
                      className="h-9 w-9"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteClick(seller)}
                      className="h-9 w-9 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
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
          <form onSubmit={handleAddSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sellerName">Seller Name</Label>
              <Input
                id="sellerName"
                placeholder="Enter name"
                className="rounded-xl"
                value={addFormData.name}
                onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 9876543210"
                className="rounded-xl"
                value={addFormData.phone}
                onChange={(e) => setAddFormData({ ...addFormData, phone: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productType">Product Type</Label>
              <Input
                id="productType"
                placeholder="Tea & Snacks, Groceries, etc."
                className="rounded-xl"
                value={addFormData.productType}
                onChange={(e) => setAddFormData({ ...addFormData, productType: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address (Optional)</Label>
              <Input
                id="address"
                placeholder="City or area"
                className="rounded-xl"
                value={addFormData.address}
                onChange={(e) => setAddFormData({ ...addFormData, address: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sellerNotes">Notes (Optional)</Label>
              <Input
                id="sellerNotes"
                placeholder="Additional notes"
                className="rounded-xl"
                value={addFormData.notes}
                onChange={(e) => setAddFormData({ ...addFormData, notes: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full rounded-xl" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Adding..." : "Add Seller"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="rounded-3xl max-w-[90%]">
          <DialogHeader>
            <DialogTitle>Edit Seller</DialogTitle>
            <DialogDescription>Update seller information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editSellerName">Seller Name</Label>
              <Input
                id="editSellerName"
                placeholder="Enter name"
                className="rounded-xl"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editPhone">Phone Number</Label>
              <Input
                id="editPhone"
                type="tel"
                placeholder="+91 9876543210"
                className="rounded-xl"
                value={editFormData.phone}
                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editProductType">Product Type</Label>
              <Input
                id="editProductType"
                placeholder="Tea & Snacks, Groceries, etc."
                className="rounded-xl"
                value={editFormData.productType}
                onChange={(e) => setEditFormData({ ...editFormData, productType: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editAddress">Address (Optional)</Label>
              <Input
                id="editAddress"
                placeholder="City or area"
                className="rounded-xl"
                value={editFormData.address}
                onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editSellerNotes">Notes (Optional)</Label>
              <Input
                id="editSellerNotes"
                placeholder="Additional notes"
                className="rounded-xl"
                value={editFormData.notes}
                onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full rounded-xl" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Updating..." : "Update Seller"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Seller</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deletingSeller?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNav />
    </div>
  );
};

export default Sellers;
