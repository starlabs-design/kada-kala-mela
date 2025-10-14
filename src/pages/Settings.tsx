import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Store, Moon, Database, Download, Upload, AlertTriangle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsAPI, inventoryAPI, transactionsAPI, sellersAPI } from "@/lib/api";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import BottomNav from "@/components/BottomNav";

const Settings = () => {
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [shopName, setShopName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [shopPhone, setShopPhone] = useState("");
  const [lowStockLimitKg, setLowStockLimitKg] = useState(10);
  const [lowStockLimitLiters, setLowStockLimitLiters] = useState(10);
  const [lowStockLimitPack, setLowStockLimitPack] = useState(10);
  const [lowStockLimitPieces, setLowStockLimitPieces] = useState(10);
  const [lowStockLimitDefault, setLowStockLimitDefault] = useState(10);
  const [isImporting, setIsImporting] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: settingsAPI.get,
  });

  const updateMutation = useMutation({
    mutationFn: settingsAPI.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Settings saved successfully!");
    },
    onError: () => {
      toast.error("Failed to save settings");
    },
  });

  useEffect(() => {
    if (settings) {
      setShopName(settings.shopName || "");
      setOwnerName(settings.ownerName || "");
      setShopPhone(settings.shopPhone || "");
      setLowStockLimitKg(settings.lowStockLimitKg || 10);
      setLowStockLimitLiters(settings.lowStockLimitLiters || 10);
      setLowStockLimitPack(settings.lowStockLimitPack || 10);
      setLowStockLimitPieces(settings.lowStockLimitPieces || 10);
      setLowStockLimitDefault(settings.lowStockLimitDefault || 10);
      
      if (settings.darkMode !== undefined) {
        setTheme(settings.darkMode ? "dark" : "light");
      }
    }
  }, [settings, setTheme]);

  const handleSave = () => {
    updateMutation.mutate({
      shopName: shopName || undefined,
      ownerName: ownerName || undefined,
      shopPhone: shopPhone || undefined,
      lowStockLimitKg: lowStockLimitKg,
      lowStockLimitLiters: lowStockLimitLiters,
      lowStockLimitPack: lowStockLimitPack,
      lowStockLimitPieces: lowStockLimitPieces,
      lowStockLimitDefault: lowStockLimitDefault,
    } as any);
  };

  const handleDarkModeToggle = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
    updateMutation.mutate({ darkMode: checked } as any);
  };

  const handleBackupData = async () => {
    try {
      toast.info("Preparing backup...");
      
      const [inventory, transactions, sellers, currentSettings] = await Promise.all([
        inventoryAPI.getAll(),
        transactionsAPI.getAll(),
        sellersAPI.getAll(),
        settingsAPI.get(),
      ]);

      const backupData = {
        version: "1.0.0",
        exportDate: new Date().toISOString(),
        data: {
          inventory,
          transactions,
          sellers,
          settings: currentSettings,
        },
      };

      const dataStr = JSON.stringify(backupData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `kada-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Backup downloaded successfully!");
    } catch (error) {
      toast.error("Failed to create backup");
    }
  };

  const handleImportBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      toast.info("Reading backup file...");
      
      const fileContent = await file.text();
      const backupData = JSON.parse(fileContent);

      if (!backupData.version || !backupData.data) {
        throw new Error("Invalid backup file format");
      }

      toast.info("Importing data...");

      const { inventory, transactions, sellers, settings: importSettings } = backupData.data;

      let successCount = 0;
      let errorCount = 0;

      const sellerIdMap = new Map<number, number>();
      const inventoryIdMap = new Map<number, number>();

      if (sellers && Array.isArray(sellers)) {
        for (const seller of sellers) {
          try {
            const oldId = seller.id;
            const { id, createdAt, updatedAt, ...sellerData } = seller;
            const newSeller = await sellersAPI.create(sellerData);
            if (newSeller && newSeller.id && oldId) {
              sellerIdMap.set(oldId, newSeller.id);
            }
            successCount++;
          } catch (error) {
            console.error("Failed to import seller:", error);
            errorCount++;
          }
        }
      }

      if (inventory && Array.isArray(inventory)) {
        for (const item of inventory) {
          try {
            const oldId = item.id;
            const { id, createdAt, updatedAt, ...itemData } = item;
            const newItem = await inventoryAPI.create(itemData);
            if (newItem && newItem.id && oldId) {
              inventoryIdMap.set(oldId, newItem.id);
            }
            successCount++;
          } catch (error) {
            console.error("Failed to import inventory item:", error);
            errorCount++;
          }
        }
      }

      if (transactions && Array.isArray(transactions)) {
        for (const transaction of transactions) {
          try {
            const { id, createdAt, updatedAt, sellerId, items, ...transactionData } = transaction;
            
            const newSellerId = sellerId ? sellerIdMap.get(sellerId) : undefined;
            
            const cleanedItems = items && Array.isArray(items) 
              ? items.map((item: any) => {
                  const { id, transactionId, inventoryItemId, createdAt, updatedAt, ...itemData } = item;
                  return {
                    ...itemData,
                    inventoryItemId: inventoryItemId ? inventoryIdMap.get(inventoryItemId) : undefined,
                  };
                }).filter((item: any) => item.inventoryItemId !== undefined)
              : [];

            if (newSellerId || !sellerId) {
              await transactionsAPI.create({
                ...transactionData,
                sellerId: newSellerId,
                items: cleanedItems,
              });
              successCount++;
            } else {
              console.warn("Skipped transaction: seller not found");
              errorCount++;
            }
          } catch (error) {
            console.error("Failed to import transaction:", error);
            errorCount++;
          }
        }
      }

      if (importSettings) {
        try {
          const { id, createdAt, updatedAt, ...cleanSettings } = importSettings;
          await settingsAPI.update(cleanSettings as any);
        } catch (error) {
          console.error("Failed to import settings:", error);
        }
      }

      queryClient.invalidateQueries();
      
      if (errorCount > 0) {
        toast.warning(`Imported ${successCount} items with ${errorCount} skipped. Check console for details.`);
      } else if (successCount > 0) {
        toast.success(`Successfully imported ${successCount} items!`);
      } else {
        toast.error("No data was imported. Please check the backup file.");
      }
      
      if (successCount > 0) {
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Failed to import backup. Please check the file format.");
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="bg-primary text-primary-foreground px-6 py-6 rounded-b-3xl shadow-lg">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-primary-foreground/90 text-sm">ക്രമീകരണങ്ങൾ</p>
        </div>
        <div className="px-4 py-6 flex items-center justify-center">
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-6 py-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-primary-foreground/90 text-sm">ക്രമീകരണങ്ങൾ</p>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Shop Details */}
        <Card className="bg-card shadow-md border-0">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Store className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-lg">Shop Details</h2>
            </div>
            <div className="space-y-2">
              <Label htmlFor="shopName">Shop Name</Label>
              <Input
                id="shopName"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="rounded-xl"
                placeholder="Enter shop name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerName">Owner Name</Label>
              <Input
                id="ownerName"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="rounded-xl"
                placeholder="Enter owner name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shopPhone">Phone Number</Label>
              <Input
                id="shopPhone"
                value={shopPhone}
                onChange={(e) => setShopPhone(e.target.value)}
                className="rounded-xl"
                placeholder="+91 XXXXXXXXXX"
              />
            </div>
            <Button 
              onClick={handleSave} 
              className="w-full rounded-xl"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>

        {/* App Preferences */}
        <Card className="bg-card shadow-md border-0">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Moon className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-lg">Preferences</h2>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="darkMode">Dark Mode</Label>
                  <p className="text-xs text-muted-foreground">
                    Switch to dark theme
                  </p>
                </div>
              </div>
              <Switch 
                id="darkMode" 
                checked={theme === "dark"}
                onCheckedChange={handleDarkModeToggle}
              />
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert Settings */}
        <Card className="bg-card shadow-md border-0">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-lg">Low Stock Alert Settings</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Set minimum quantity thresholds for different unit types
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="lowStockKg">Kg Limit</Label>
                <Input
                  id="lowStockKg"
                  type="number"
                  value={lowStockLimitKg}
                  onChange={(e) => setLowStockLimitKg(Number(e.target.value))}
                  className="rounded-xl"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lowStockLiters">Liters Limit</Label>
                <Input
                  id="lowStockLiters"
                  type="number"
                  value={lowStockLimitLiters}
                  onChange={(e) => setLowStockLimitLiters(Number(e.target.value))}
                  className="rounded-xl"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lowStockPack">Pack Limit</Label>
                <Input
                  id="lowStockPack"
                  type="number"
                  value={lowStockLimitPack}
                  onChange={(e) => setLowStockLimitPack(Number(e.target.value))}
                  className="rounded-xl"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lowStockPieces">Pieces Limit</Label>
                <Input
                  id="lowStockPieces"
                  type="number"
                  value={lowStockLimitPieces}
                  onChange={(e) => setLowStockLimitPieces(Number(e.target.value))}
                  className="rounded-xl"
                  min="0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lowStockDefault">Default Limit (Other Units)</Label>
              <Input
                id="lowStockDefault"
                type="number"
                value={lowStockLimitDefault}
                onChange={(e) => setLowStockLimitDefault(Number(e.target.value))}
                className="rounded-xl"
                min="0"
              />
              <p className="text-xs text-muted-foreground">
                Used for units not listed above
              </p>
            </div>
            <Button 
              onClick={handleSave} 
              className="w-full rounded-xl"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Saving..." : "Save Alert Settings"}
            </Button>
          </CardContent>
        </Card>

        {/* Data Backup */}
        <Card className="bg-card shadow-md border-0">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Database className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-lg">Data Backup</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Backup and restore your shop data
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="rounded-xl gap-2"
                onClick={handleBackupData}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button 
                variant="outline" 
                className="rounded-xl gap-2"
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
              >
                <Upload className="h-4 w-4" />
                {isImporting ? "Importing..." : "Upload"}
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground text-center">
              Download backup as JSON or upload a backup file to restore
            </p>
          </CardContent>
        </Card>

        {/* App Info */}
        <div className="text-center pt-4 pb-8">
          <p className="text-sm text-muted-foreground">Kada Manager v1.0.0</p>
          <p className="text-xs text-muted-foreground mt-1">
            Made with ❤️ for Kerala shopkeepers
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Settings;
