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
import { Button } from "@/components/ui/button";

const SideNav = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navItems = [
    { path: "/", icon: Home, label: "Dashboard", malayalam: "ഹോം" },
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
    <>
      {/* Mobile Menu Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-4 left-4 z-50 lg:hidden bg-background/95 backdrop-blur-sm shadow-lg border"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Overlay for mobile */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full bg-card border-r border-border z-40 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        } w-[280px]`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <h2 className="text-2xl font-bold text-primary">Kada Manager</h2>
            <p className="text-sm text-muted-foreground mt-1">കട മാനേജർ</p>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.label}</p>
                    <p className="text-xs opacity-80 truncate">{item.malayalam}</p>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default SideNav;
