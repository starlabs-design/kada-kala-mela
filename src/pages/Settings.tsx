import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Store, Moon, Database, Download } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsAPI, inventoryAPI, transactionsAPI, sellersAPI } from "@/lib/api";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import BottomNav from "@/components/BottomNav";

const Settings = () => {
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();
  const [shopName, setShopName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [shopPhone, setShopPhone] = useState("");

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

        {/* Data Backup */}
        <Card className="bg-card shadow-md border-0">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Database className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-lg">Data Backup</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Backup your shop data to keep it safe
            </p>
            <Button 
              variant="outline" 
              className="w-full rounded-xl gap-2"
              onClick={handleBackupData}
            >
              <Download className="h-4 w-4" />
              Download Backup
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Download a complete backup of all your shop data as JSON
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
