import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Store, User, Globe, Moon, Database, LogOut } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const Settings = () => {
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
                defaultValue="My Kerala Store"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerName">Owner Name</Label>
              <Input
                id="ownerName"
                defaultValue="Raju Kumar"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shopPhone">Phone Number</Label>
              <Input
                id="shopPhone"
                defaultValue="+91 9876543210"
                className="rounded-xl"
              />
            </div>
          </CardContent>
        </Card>

        {/* App Preferences */}
        <Card className="bg-card shadow-md border-0">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-lg">Preferences</h2>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language / ഭാഷ</Label>
              <Select defaultValue="en">
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ml">മലയാളം (Malayalam)</SelectItem>
                </SelectContent>
              </Select>
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
              <Switch id="darkMode" />
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
              Last backup: Never
            </p>
            <Button variant="outline" className="w-full rounded-xl">
              Backup to Google Drive
            </Button>
            <Button variant="outline" className="w-full rounded-xl">
              Export to Device
            </Button>
          </CardContent>
        </Card>

        {/* Account */}
        <Card className="bg-card shadow-md border-0">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-lg">Account</h2>
            </div>
            <Button variant="destructive" className="w-full rounded-xl gap-2">
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
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
