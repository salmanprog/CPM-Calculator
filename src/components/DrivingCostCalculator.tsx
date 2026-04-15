import { useState, useMemo } from "react";

const DrivingCostCalculator = () => {
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [startOdo, setStartOdo] = useState("");
  const [endOdo, setEndOdo] = useState("");
  const [fuel, setFuel] = useState("");
  const [tolls, setTolls] = useState("");
  const [rate, setRate] = useState("");

  const results = useMemo(() => {
    const s = parseFloat(startOdo) || 0;
    const e = parseFloat(endOdo) || 0;
    const f = parseFloat(fuel) || 0;
    const t = parseFloat(tolls) || 0;
    const r = parseFloat(rate) || 0;

    const miles = Math.max(e - s, 0);
    const expenses = f + t;
    const cpm = miles > 0 ? expenses / miles : 0;
    const profit = r - expenses;

    return { miles, expenses, cpm, profit };
  }, [startOdo, endOdo, fuel, tolls, rate]);

  const fmt = (n: number) => `$${n.toFixed(2)}`;
  const hasInput = parseFloat(endOdo) > 0 || parseFloat(rate) > 0;

  return (
    <div className="min-h-screen bg-background flex items-start justify-center py-8 px-4 sm:py-16">
      <div className="w-full max-w-md space-y-5">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">CPM Daily Calculator</h1>
          <p className="text-muted-foreground mt-1 text-sm">Track your daily cost per mile & profit</p>
        </div>

        {/* Inputs */}
        <fieldset className="border border-border rounded-lg p-5 bg-card space-y-4">
          <legend className="text-xs font-semibold tracking-widest text-muted-foreground uppercase px-2">Daily Entry</legend>

          <div>
            <label className="text-sm font-medium text-foreground">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">Start Odometer</label>
              <input
                type="number"
                placeholder="e.g. 125000"
                value={startOdo}
                onChange={(e) => setStartOdo(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">End Odometer</label>
              <input
                type="number"
                placeholder="e.g. 125450"
                value={endOdo}
                onChange={(e) => setEndOdo(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">Fuel ($)</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={fuel}
                onChange={(e) => setFuel(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Tolls / Misc ($)</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={tolls}
                onChange={(e) => setTolls(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Load Rate ($)</label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </fieldset>

        {/* Results */}
        {hasInput && (
          <fieldset className="border border-border rounded-lg p-5 bg-card">
            <legend className="text-xs font-semibold tracking-widest text-muted-foreground uppercase px-2">Results</legend>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="bg-accent rounded-lg p-4 text-center">
                <p className="text-xs text-muted-foreground">Total Miles</p>
                <p className="text-2xl font-bold text-foreground">{results.miles.toLocaleString()}</p>
              </div>
              <div className="bg-accent rounded-lg p-4 text-center">
                <p className="text-xs text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold text-foreground">{fmt(results.expenses)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-accent rounded-lg p-4 text-center">
                <p className="text-xs text-muted-foreground">Cost Per Mile</p>
                <p className="text-2xl font-bold text-primary">{fmt(results.cpm)}</p>
              </div>
              <div className={`rounded-lg p-4 text-center ${results.profit >= 0 ? "bg-green-500/10" : "bg-red-500/10"}`}>
                <p className="text-xs text-muted-foreground">Profit</p>
                <p className={`text-2xl font-bold ${results.profit >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {fmt(results.profit)}
                </p>
              </div>
            </div>

            {/* Breakdown */}
            {results.miles > 0 && (
              <div className="mt-5">
                <div className="h-3 rounded-full overflow-hidden flex bg-muted">
                  <div
                    className="bg-primary h-full transition-all"
                    style={{ width: `${Math.min((results.expenses / (parseFloat(rate) || 1)) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Expenses: {fmt(results.expenses)}</span>
                  <span>Rate: {fmt(parseFloat(rate) || 0)}</span>
                </div>
              </div>
            )}
          </fieldset>
        )}
      </div>
    </div>
  );
};

export default DrivingCostCalculator;
