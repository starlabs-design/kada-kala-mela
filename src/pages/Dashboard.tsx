import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FileText,
  ShoppingCart,
  Coffee,
  AlertCircle
} from "lucide-react";

const Dashboard = () => {
  const [todaySales] = useState(2450);
  const [todayExpenses] = useState(1200);
  const profit = todaySales - todayExpenses;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-6 py-8 rounded-b-3xl shadow-lg">
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
                  ₹{profit.toLocaleString('en-IN')}
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
                    ₹{todaySales.toLocaleString('en-IN')}
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
                    ₹{todayExpenses.toLocaleString('en-IN')}
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alert */}
        <Card className="bg-warning/10 border-warning/20 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-warning" />
              <div>
                <p className="font-semibold text-warning">Low Stock Alert</p>
                <p className="text-sm text-muted-foreground">3 items need reorder</p>
              </div>
            </div>
          </CardContent>
        </Card>
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
        </div>
      </div>

      {/* Category Performance */}
      <div className="px-4">
        <h2 className="text-lg font-semibold mb-4">Today's Performance</h2>
        <Card className="bg-card shadow-lg border-0">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Tea & Snacks</span>
                  <span className="text-sm font-bold">₹1,200</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Groceries</span>
                  <span className="text-sm font-bold">₹1,250</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-secondary h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
