import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Download, Share2, Calendar } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const Reports = () => {
  const weeklyData = {
    sales: 17250,
    expenses: 9500,
    profit: 7750,
  };

  const monthlyData = {
    sales: 73500,
    expenses: 42000,
    profit: 31500,
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-secondary text-secondary-foreground px-6 py-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-secondary-foreground/90 text-sm">റിപ്പോർട്ടുകൾ</p>
      </div>

      {/* Period Selector */}
      <div className="px-4 py-4">
        <div className="flex gap-2">
          <Button variant="default" className="rounded-full gap-2">
            <Calendar className="h-4 w-4" />
            This Week
          </Button>
          <Button variant="outline" className="rounded-full gap-2">
            <Calendar className="h-4 w-4" />
            This Month
          </Button>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Weekly Summary</h2>
        <Card className="bg-card shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-base">Oct 7 - Oct 14, 2025</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Sales</span>
              <span className="text-xl font-bold text-success">
                ₹{weeklyData.sales.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Expenses</span>
              <span className="text-xl font-bold text-destructive">
                ₹{weeklyData.expenses.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="pt-4 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Net Profit</span>
                <span className="text-2xl font-bold text-success">
                  ₹{weeklyData.profit.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Summary */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Monthly Summary</h2>
        <Card className="bg-card shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-base">October 2025</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Sales</span>
              <span className="text-xl font-bold text-success">
                ₹{monthlyData.sales.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Expenses</span>
              <span className="text-xl font-bold text-destructive">
                ₹{monthlyData.expenses.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="pt-4 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Net Profit</span>
                <span className="text-2xl font-bold text-success">
                  ₹{monthlyData.profit.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Category Performance</h2>
        <Card className="bg-card shadow-lg border-0">
          <CardContent className="pt-6 space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Tea & Snacks</span>
                <span className="font-bold">₹8,400</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div className="bg-primary h-3 rounded-full" style={{ width: '48%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">48% of total sales</p>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Groceries</span>
                <span className="font-bold">₹8,850</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div className="bg-secondary h-3 rounded-full" style={{ width: '52%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">52% of total sales</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="px-4 space-y-3">
        <Button className="w-full rounded-xl gap-2" size="lg">
          <Download className="h-5 w-5" />
          Download PDF Report
        </Button>
        <Button variant="outline" className="w-full rounded-xl gap-2" size="lg">
          <Share2 className="h-5 w-5" />
          Share via WhatsApp
        </Button>
      </div>

      {/* Growth Indicator */}
      <div className="px-4 mt-6">
        <Card className="bg-success/10 border-success/20 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-success" />
              <div>
                <p className="font-semibold text-success">Growth This Month</p>
                <p className="text-2xl font-bold text-success">+12.5%</p>
                <p className="text-sm text-muted-foreground">Compared to last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Reports;
