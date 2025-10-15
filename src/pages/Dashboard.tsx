import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FileText,
  ShoppingCart,
  Coffee,
  AlertCircle,
  DollarSign,
  Settings as SettingsIcon,
  Receipt,
  CreditCard
} from "lucide-react";
import { inventoryAPI, transactionsAPI, settingsAPI } from "@/lib/api";
import { isLowStock } from "@/lib/utils";
import SideNav from "@/components/SideNav";

const Dashboard = () => {
  const { data: inventory = [] } = useQuery({
    queryKey: ["inventory"],
    queryFn: inventoryAPI.getAll,
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ["transactions"],
    queryFn: transactionsAPI.getAll,
  });

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: settingsAPI.get,
  });

  const today = new Date().toISOString().split('T')[0];
  const todayTransactions = transactions.filter(t => t.date === today);
  
  const todaySales = todayTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const todayExpenses = todayTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const profit = todaySales - todayExpenses;

  const lowStockItems = inventory.filter(item => isLowStock(item.quantity, item.unit, settings));
  const lowStockCount = lowStockItems.length;

  // Calculate category-based income data
  const todayIncomeTransactions = todayTransactions.filter(t => t.type === "income");
  const categoryData = todayIncomeTransactions.reduce((acc, t) => {
    if (!acc[t.category]) {
      acc[t.category] = 0;
    }
    acc[t.category] += t.amount;
    return acc;
  }, {} as Record<string, number>);

  const categoryPerformance = Object.entries(categoryData).map(([category, amount]) => ({
    category,
    amount,
    percentage: todaySales > 0 ? (amount / todaySales) * 100 : 0
  }));

  // Define colors for different categories
  const getColorClass = (index: number) => {
    const colors = ['bg-primary', 'bg-secondary', 'bg-success'];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-background lg:ml-[280px]">
      <SideNav />
      {/* Header */}
      <div className="bg-primary text-primary-foreground pl-16 pr-6 lg:px-6 py-8 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Kada Manager</h1>
        <p className="text-primary-foreground/90 text-sm">കട മാനേജർ</p>
      </div>

      {/* Daily Summary Cards */}
      <div className="px-4 -mt-8 space-y-4 mb-6">
        {/* Profit/Loss Card */}
        <Card className="bg-card shadow-lg border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">
              Today's Profit / നേട്ടം
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-3xl font-bold ${profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                  Rs.{profit.toLocaleString('en-IN')}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {profit >= 0 ? 'Profit' : 'Loss'}
                </p>
              </div>
              {profit >= 0 ? (
                <TrendingUp className="h-12 w-12 text-success" />
              ) : (
                <TrendingDown className="h-12 w-12 text-destructive" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sales & Expenses Row */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-card shadow-lg border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Sales</p>
                  <p className="text-xl font-bold text-success">
                    Rs.{todaySales.toLocaleString('en-IN')}
                  </p>
                </div>
                <ShoppingCart className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-lg border-0">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Expenses</p>
                  <p className="text-xl font-bold text-destructive">
                    Rs.{todayExpenses.toLocaleString('en-IN')}
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alert */}
        {lowStockCount > 0 && (
          <Card className="bg-warning/10 border-warning/20 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-warning" />
                <div>
                  <p className="font-semibold text-warning">Low Stock Alert</p>
                  <p className="text-sm text-muted-foreground">{lowStockCount} items need reorder</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions / പെട്ടെന്നുള്ള പ്രവർത്തനങ്ങൾ</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link to="/inventory">
            <Card className="bg-card hover:bg-muted/50 transition-all shadow-lg border-0 cursor-pointer h-full">
              <CardContent className="pt-6 text-center">
                <Package className="h-12 w-12 text-primary mx-auto mb-3" />
                <p className="font-semibold">Inventory</p>
                <p className="text-xs text-muted-foreground mt-1">സാധനങ്ങൾ</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/expenses">
            <Card className="bg-card hover:bg-muted/50 transition-all shadow-lg border-0 cursor-pointer h-full">
              <CardContent className="pt-6 text-center">
                <Coffee className="h-12 w-12 text-secondary mx-auto mb-3" />
                <p className="font-semibold">Income & Expenses</p>
                <p className="text-xs text-muted-foreground mt-1">വരവ് & ചെലവ്</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/sellers">
            <Card className="bg-card hover:bg-muted/50 transition-all shadow-lg border-0 cursor-pointer h-full">
              <CardContent className="pt-6 text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-3" />
                <p className="font-semibold">Sellers</p>
                <p className="text-xs text-muted-foreground mt-1">കച്ചവടക്കാർ</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/reports">
            <Card className="bg-card hover:bg-muted/50 transition-all shadow-lg border-0 cursor-pointer h-full">
              <CardContent className="pt-6 text-center">
                <FileText className="h-12 w-12 text-secondary mx-auto mb-3" />
                <p className="font-semibold">Reports</p>
                <p className="text-xs text-muted-foreground mt-1">റിപ്പോർട്ടുകൾ</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/billing">
            <Card className="bg-card hover:bg-muted/50 transition-all shadow-lg border-0 cursor-pointer h-full">
              <CardContent className="pt-6 text-center">
                <Receipt className="h-12 w-12 text-primary mx-auto mb-3" />
                <p className="font-semibold">Billing</p>
                <p className="text-xs text-muted-foreground mt-1">ബില്ലിംഗ്</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/credit">
            <Card className="bg-card hover:bg-muted/50 transition-all shadow-lg border-0 cursor-pointer h-full">
              <CardContent className="pt-6 text-center">
                <CreditCard className="h-12 w-12 text-secondary mx-auto mb-3" />
                <p className="font-semibold">Credit Tracking</p>
                <p className="text-xs text-muted-foreground mt-1">ക്രെഡിറ്റ് ട്രാക്കിംഗ്</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/pricing">
            <Card className="bg-card hover:bg-muted/50 transition-all shadow-lg border-0 cursor-pointer h-full">
              <CardContent className="pt-6 text-center">
                <DollarSign className="h-12 w-12 text-primary mx-auto mb-3" />
                <p className="font-semibold">Pricing List</p>
                <p className="text-xs text-muted-foreground mt-1">വില പട്ടിക</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/settings">
            <Card className="bg-card hover:bg-muted/50 transition-all shadow-lg border-0 cursor-pointer h-full">
              <CardContent className="pt-6 text-center">
                <SettingsIcon className="h-12 w-12 text-secondary mx-auto mb-3" />
                <p className="font-semibold">Settings</p>
                <p className="text-xs text-muted-foreground mt-1">ക്രമീകരണങ്ങൾ</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Category Performance */}
      <div className="px-4">
        <h2 className="text-lg font-semibold mb-4">Today's Performance</h2>
        <Card className="bg-card shadow-lg border-0">
          <CardContent className="pt-6">
            {categoryPerformance.length > 0 ? (
              <div className="space-y-4">
                {categoryPerformance.map((item, index) => (
                  <div key={item.category}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">{item.category}</span>
                      <span className="text-sm font-bold">Rs.{item.amount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`${getColorClass(index)} h-2 rounded-full`} 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No transactions recorded today
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
