import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Search } from "lucide-react";
import SideNav from "@/components/SideNav";
import { inventoryAPI } from "@/lib/api";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Pricing = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: items = [] } = useQuery({
    queryKey: ["inventory"],
    queryFn: inventoryAPI.getAll,
  });

  const uniqueItems = useMemo(() => {
    const itemMap = new Map();
    
    items.forEach((item) => {
      if (!itemMap.has(item.name) || new Date(item.createdAt) > new Date(itemMap.get(item.name).createdAt)) {
        itemMap.set(item.name, item);
      }
    });
    
    return Array.from(itemMap.values()).sort((a, b) => 
      a.name.localeCompare(b.name)
    );
  }, [items]);

  const filteredItems = useMemo(() => {
    return uniqueItems.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [uniqueItems, searchQuery]);

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.text("Pricing List", 14, 22);
      
      doc.setFontSize(11);
      doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 14, 30);

      const tableData = filteredItems.map((item) => [
        item.name,
        `Rs. ${item.sellingPrice}`,
      ]);

      autoTable(doc, {
        head: [["Item Name", "Selling Price"]],
        body: tableData,
        startY: 35,
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 247, 250],
        },
      });

      doc.save(`pricing-list-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      toast.error("Failed to generate PDF");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-background lg:ml-[280px]">
      <SideNav />
      {/* Header */}
      <div className="bg-primary text-primary-foreground pl-6 pr-16 lg:px-6 py-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold">Pricing List</h1>
        <p className="text-primary-foreground/90 text-sm">വില പട്ടിക</p>
      </div>

      {/* Search and Actions */}
      <div className="px-4 py-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-2xl border-border bg-card"
          />
        </div>

        <Button 
          onClick={downloadPDF} 
          className="w-full rounded-xl gap-2"
          disabled={filteredItems.length === 0}
        >
          <Download className="h-5 w-5" />
          Download PDF
        </Button>
      </div>

      {/* Items Count */}
      <div className="px-4 mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredItems.length} unique {filteredItems.length === 1 ? "item" : "items"}
        </p>
      </div>

      {/* Pricing Table */}
      <div className="px-4">
        <Card className="bg-card shadow-md border-0 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Item Name</TableHead>
                  <TableHead className="font-semibold text-right">Selling Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right font-semibold text-success">
                        Rs. {item.sellingPrice.toLocaleString('en-IN')}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">
                      {searchQuery ? "No items found matching your search" : "No items available"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Pricing;
