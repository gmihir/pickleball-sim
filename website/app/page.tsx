'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SimulationForm from '@/components/simulation-form';
import SimulationResults from '@/components/simulation-results';
import { runSimulation } from '@/lib/simulation';
import type {
  SimulationConfig,
  SimulationResults as SimResultsType,
} from '@/lib/types';

export default function PickleballSimulator() {
  const [results, setResults] = useState<SimResultsType | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState('config');
  const [simulationCount, setSimulationCount] = useState(0);

  const handleSimulate = async (config: SimulationConfig) => {
    setIsSimulating(true);
    setActiveTab('results');
    setSimulationCount(config.simulationCount);

    setTimeout(() => {
      const simulationResults = runSimulation(config);
      setResults(simulationResults);
      setIsSimulating(false);
    }, 100);
  };

  const handleReset = () => {
    setResults(null);
    setActiveTab('config');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-4">
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-2xl font-bold md:text-3xl">
            Pickleball Game Simulator
          </h1>
          <p className="text-sm text-muted-foreground">
            Optimize match strategy! Or just mess around :) 
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-2">
            <TabsTrigger value="config" className="text-sm">
              Configuration
            </TabsTrigger>
            <TabsTrigger
              value="results"
              disabled={!results && !isSimulating}
              className="text-sm"
            >
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="mt-0">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Simulation Configuration</CardTitle>
                <CardDescription className="text-sm">
                  Settings to fiddle around with
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SimulationForm onSimulate={handleSimulate} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="mt-0">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Simulation Results</CardTitle>
                <CardDescription className="text-sm">
                  Based on{' '}
                  {isSimulating
                    ? `${simulationCount.toLocaleString()} matches...`
                    : results
                    ? `${results.simulationCount.toLocaleString()} matches`
                    : '...'}{' '}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SimulationResults
                  results={results}
                  isLoading={isSimulating}
                  onReset={handleReset}
                  simulationCount={simulationCount}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}