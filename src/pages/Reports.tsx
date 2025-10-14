import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp, TrendingDown, Download, Share2, Calendar } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { transactionsAPI } from "@/lib/api";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, format, subMonths, parse } from "date-fns";

const Reports = () => {
  const [period, setPeriod] = useState<"week" | "month" | "custom">("week");
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());

  const { data: transactions = [] } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => transactionsAPI.getAll(),
  });

  const today = new Date();
  
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  
  const lastMonthStart = startOfMonth(subMonths(today, 1));
  const lastMonthEnd = endOfMonth(subMonths(today, 1));

  const filterTransactionsByDateRange = (startDate: Date, endDate: Date) => {
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  };

  const weekTransactions = filterTransactionsByDateRange(weekStart, weekEnd);
  const monthTransactions = filterTransactionsByDateRange(monthStart, monthEnd);
  const lastMonthTransactions = filterTransactionsByDateRange(lastMonthStart, lastMonthEnd);

  const customDate = new Date(parseInt(selectedYear), parseInt(selectedMonth), 1);
  const customMonthStart = startOfMonth(customDate);
  const customMonthEnd = endOfMonth(customDate);
  const customMonthTransactions = filterTransactionsByDateRange(customMonthStart, customMonthEnd);

  const calculateSummary = (transactionList: typeof transactions) => {
    const sales = transactionList
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactionList
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const profit = sales - expenses;
    
    return { sales, expenses, profit };
  };

  const weeklyData = calculateSummary(weekTransactions);
  const monthlyData = calculateSummary(monthTransactions);
  const lastMonthData = calculateSummary(lastMonthTransactions);
  const customMonthData = calculateSummary(customMonthTransactions);

  const currentPeriodTransactions = 
    period === "week" ? weekTransactions : 
    period === "month" ? monthTransactions : 
    customMonthTransactions;
  
  const getCategoryPerformance = () => {
    const incomeTransactions = currentPeriodTransactions.filter(t => t.type === "income");
    const totalSales = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    if (totalSales === 0) {
      return [];
    }
    
    const categoryMap = new Map<string, number>();
    
    incomeTransactions.forEach(t => {
      const current = categoryMap.get(t.category) || 0;
      categoryMap.set(t.category, current + t.amount);
    });
    
    return Array.from(categoryMap.entries()).map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / totalSales) * 100,
    })).sort((a, b) => b.amount - a.amount);
  };

  const categoryPerformance = getCategoryPerformance();

  const calculateGrowth = () => {
    if (lastMonthData.profit === 0) {
      if (monthlyData.profit > 0) {
        return { growth: 100, isPositive: true };
      }
      return { growth: 0, isPositive: true };
    }
    
    const growth = ((monthlyData.profit - lastMonthData.profit) / Math.abs(lastMonthData.profit)) * 100;
    return { growth, isPositive: growth >= 0 };
  };

  const { growth, isPositive } = calculateGrowth();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-secondary text-secondary-foreground px-6 py-6 rounded-b-3xl shadow-lg">
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-secondary-foreground/90 text-sm">റിപ്പോർട്ടുകൾ</p>
      </div>

      {/* Period Selector */}
      <div className="px-4 py-4 space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Button 
            variant={period === "week" ? "default" : "outline"} 
            className="rounded-full gap-2"
            onClick={() => setPeriod("week")}
          >
            <Calendar className="h-4 w-4" />
            This Week
          </Button>
          <Button 
            variant={period === "month" ? "default" : "outline"} 
            className="rounded-full gap-2"
            onClick={() => setPeriod("month")}
          >
            <Calendar className="h-4 w-4" />
            This Month
          </Button>
          <Button 
            variant={period === "custom" ? "default" : "outline"} 
            className="rounded-full gap-2"
            onClick={() => setPeriod("custom")}
          >
            <Calendar className="h-4 w-4" />
            Custom Month
          </Button>
        </div>

        {period === "custom" && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Month</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">January</SelectItem>
                  <SelectItem value="1">February</SelectItem>
                  <SelectItem value="2">March</SelectItem>
                  <SelectItem value="3">April</SelectItem>
                  <SelectItem value="4">May</SelectItem>
                  <SelectItem value="5">June</SelectItem>
                  <SelectItem value="6">July</SelectItem>
                  <SelectItem value="7">August</SelectItem>
                  <SelectItem value="8">September</SelectItem>
                  <SelectItem value="9">October</SelectItem>
                  <SelectItem value="10">November</SelectItem>
                  <SelectItem value="11">December</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Year</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => currentYear - i).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Period Summary */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">
          {period === "week" ? "Weekly" : period === "month" ? "Monthly" : "Custom Month"} Summary
        </h2>
        <Card className="bg-card shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-base">
              {period === "week" 
                ? `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`
                : period === "month"
                ? format(today, "MMMM yyyy")
                : format(customDate, "MMMM yyyy")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Sales</span>
              <span className="text-xl font-bold text-success">
                ₹{(period === "week" ? weeklyData : period === "month" ? monthlyData : customMonthData).sales.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Expenses</span>
              <span className="text-xl font-bold text-destructive">
                ₹{(period === "week" ? weeklyData : period === "month" ? monthlyData : customMonthData).expenses.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="pt-4 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Net Profit</span>
                <span className="text-2xl font-bold text-success">
                  ₹{(period === "week" ? weeklyData : period === "month" ? monthlyData : customMonthData).profit.toLocaleString('en-IN')}
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
            {categoryPerformance.length > 0 ? (
              categoryPerformance.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{item.category}</span>
                    <span className="font-bold">₹{item.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${index % 2 === 0 ? 'bg-primary' : 'bg-secondary'}`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.percentage.toFixed(1)}% of total sales
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No income data available for the selected period
              </p>
            )}
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
        <Card className={`${isPositive ? 'bg-success/10 border-success/20' : 'bg-destructive/10 border-destructive/20'} shadow-lg`}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              {isPositive ? (
                <TrendingUp className="h-8 w-8 text-success" />
              ) : (
                <TrendingDown className="h-8 w-8 text-destructive" />
              )}
              <div>
                <p className={`font-semibold ${isPositive ? 'text-success' : 'text-destructive'}`}>
                  Growth This Month
                </p>
                <p className={`text-2xl font-bold ${isPositive ? 'text-success' : 'text-destructive'}`}>
                  {isPositive ? '+' : ''}{growth.toFixed(1)}%
                </p>
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
