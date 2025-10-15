import { Link, useLocation } from "react-router-dom";
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
  History
} from "lucide-react";

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/inventory", icon: Package, label: "Inventory" },
    { path: "/billing", icon: Receipt, label: "Billing" },
    { path: "/billing-history", icon: History, label: "History" },
    { path: "/credit", icon: CreditCard, label: "Credit" },
    { path: "/expenses", icon: TrendingUp, label: "Expenses" },
    { path: "/sellers", icon: Users, label: "Sellers" },
    { path: "/reports", icon: FileText, label: "Reports" },
    { path: "/pricing", icon: DollarSign, label: "Pricing" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg overflow-x-auto">
      <div className="flex justify-start items-center h-16 min-w-max px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center px-3 h-full transition-colors flex-shrink-0 ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "fill-primary" : ""}`} />
              <span className="text-xs mt-1 whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
