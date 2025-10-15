import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { 
  Home, 
  Package, 
  Receipt, 
  TrendingUp, 
  Users, 
  Settings,
  FileText,
  DollarSign,
  CreditCard,
  History,
  Menu,
  X
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const SideNav = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navItems = [
    { path: "/", icon: Home, label: "Home", malayalam: "ഹോം" },
    { path: "/inventory", icon: Package, label: "Inventory", malayalam: "സാധനങ്ങൾ" },
    { path: "/billing", icon: Receipt, label: "Billing", malayalam: "ബില്ലിംഗ്" },
    { path: "/billing-history", icon: History, label: "Billing History", malayalam: "ബില്ലിംഗ് ചരിത്രം" },
    { path: "/credit", icon: CreditCard, label: "Credit Tracking", malayalam: "ക്രെഡിറ്റ് ട്രാക്കിംഗ്" },
    { path: "/expenses", icon: TrendingUp, label: "Income & Expenses", malayalam: "വരവ് & ചെലവ്" },
    { path: "/sellers", icon: Users, label: "Sellers", malayalam: "കച്ചവടക്കാർ" },
    { path: "/reports", icon: FileText, label: "Reports", malayalam: "റിപ്പോർട്ടുകൾ" },
    { path: "/pricing", icon: DollarSign, label: "Pricing List", malayalam: "വില പട്ടിക" },
    { path: "/settings", icon: Settings, label: "Settings", malayalam: "ക്രമീകരണങ്ങൾ" },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="fixed top-4 left-4 z-50 md:hidden bg-background/80 backdrop-blur-sm shadow-md"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[300px]">
        <SheetHeader>
          <SheetTitle className="text-left">Kada Manager</SheetTitle>
          <p className="text-sm text-muted-foreground text-left">കട മാനേജർ</p>
        </SheetHeader>
        <nav className="mt-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                <div className="flex-1">
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs opacity-80">{item.malayalam}</p>
                </div>
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default SideNav;
