'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { SimulationResults as SimResultsType } from '@/lib/types';
import { ArrowLeft, Download } from 'lucide-react';
import { ResultsChart } from './results-chart';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface SimulationResultsProps {
  results: SimResultsType | null;
  isLoading: boolean;
  onReset: () => void;
  simulationCount: number;
}

export default function SimulationResults({
  results,
  isLoading,
  onReset,
  simulationCount,
}: SimulationResultsProps) {
  if (isLoading) {
    return <LoadingState simulationCount={simulationCount} />;
  }

  if (!results) {
    return null;
  }

  const {
    recommendation,
    serveFirstWinRate,
    chooseSideWinRate,
    optimalServer,
  } = results;

  const isServeFirst = recommendation === 'Serve First';

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold">Recommendation</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge
                className={`${isServeFirst ? 'bg-green-600' : 'bg-blue-600'} px-3 py-1 text-white`}
                variant="secondary"
              >
                {recommendation}
              </Badge>
              {optimalServer && (
                <Badge variant="outline" className="px-3 py-1">
                  Optimal server: Player {optimalServer}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="flex-1 bg-transparent sm:flex-none"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              New Simulation
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="pb-4 pt-4">
            <div className="text-center">
              <div className="text-xl font-bold text-green-700 sm:text-2xl">
                {(serveFirstWinRate * 100).toFixed(2)}%
              </div>
              <p className="text-xs font-medium text-green-600 sm:text-sm">
                Serve First Win Rate
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="pb-4 pt-4">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-700 sm:text-2xl">
                {(chooseSideWinRate * 100).toFixed(2)}%
              </div>
              <p className="text-xs font-medium text-blue-600 sm:text-sm">
                Choose Side Win Rate
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Win Probability Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 sm:h-80">
            <ResultsChart
              serveFirstWinRate={serveFirstWinRate}
              chooseSideWinRate={chooseSideWinRate}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingState({ simulationCount }: { simulationCount: number }) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <h2 className="text-xl font-bold">Running Simulation...</h2>
          <p className="text-sm text-muted-foreground">
            Analyzing {simulationCount.toLocaleString()} matches...
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="pb-4 pt-4">
              <div className="text-center">
                <Skeleton className="mx-auto mb-2 h-6 w-16 sm:h-8 sm:w-24" />
                <Skeleton className="mx-auto h-3 w-20 sm:h-4 sm:w-32" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex h-64 items-center justify-center sm:h-80">
            <div className="text-center">
              <Skeleton className="mb-4 h-32 w-full sm:h-40" />
              <p className="text-sm text-muted-foreground">
                Processing {simulationCount.toLocaleString()} simulation data...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
