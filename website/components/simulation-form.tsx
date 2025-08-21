'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle, Users, User } from 'lucide-react';
import type { SimulationConfig } from '@/lib/types';

interface SimulationFormProps {
  onSimulate: (config: SimulationConfig) => void;
}

export default function SimulationForm({ onSimulate }: SimulationFormProps) {
  const [gameFormat, setGameFormat] = useState<'singles' | 'doubles'>(
    'doubles',
  );
  const [pointsPerGame, setPointsPerGame] = useState('11');
  const [matchFormat, setMatchFormat] = useState<'bestOf1' | 'bestOf3'>(
    'bestOf3',
  );
  const [sideAdvantage, setSideAdvantage] = useState([0]);
  const [firstPointRule, setFirstPointRule] = useState(false);
  const [simulationCount, setSimulationCount] = useState(100000);

  const [singleRating, setSingleRating] = useState('4.5');

  const [team1Player1, setTeam1Player1] = useState('4.5');
  const [team1Player2, setTeam1Player2] = useState('4.0');
  const [team2Player1, setTeam2Player1] = useState('4.5');
  const [team2Player2, setTeam2Player2] = useState('4.0');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const config: SimulationConfig = {
      simulationCount,
      gameFormat,
      pointsPerGame: Number.parseInt(pointsPerGame),
      matchFormat,
      sideAdvantage: sideAdvantage[0],
      firstPointRule,
      players:
        gameFormat === 'singles'
          ? [Number.parseFloat(singleRating)]
          : [
              Number.parseFloat(team1Player1),
              Number.parseFloat(team1Player2),
              Number.parseFloat(team2Player1),
              Number.parseFloat(team2Player2),
            ],
    };

    onSimulate(config);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <Label className="text-base font-medium">Game Format</Label>
        <RadioGroup
          defaultValue="doubles"
          value={gameFormat}
          onValueChange={(value) =>
            setGameFormat(value as 'singles' | 'doubles')
          }
          className="grid grid-cols-2 gap-4"
        >
          <div className="flex cursor-pointer items-center space-x-3 rounded-lg border p-3 hover:bg-accent">
            <RadioGroupItem value="singles" id="singles" />
            <Label
              htmlFor="singles"
              className="flex cursor-pointer items-center gap-2"
            >
              <User className="h-4 w-4" />
              Singles
            </Label>
          </div>
          <div className="flex cursor-pointer items-center space-x-3 rounded-lg border p-3 hover:bg-accent">
            <RadioGroupItem value="doubles" id="doubles" />
            <Label
              htmlFor="doubles"
              className="flex cursor-pointer items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Doubles
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pointsPerGame" className="text-sm font-medium">
            Points Per Game
          </Label>
          <Select value={pointsPerGame} onValueChange={setPointsPerGame}>
            <SelectTrigger id="pointsPerGame" className="h-12">
              <SelectValue placeholder="Select points" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="11">11 Points</SelectItem>
              <SelectItem value="15">15 Points</SelectItem>
              <SelectItem value="21">21 Points</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Match Format</Label>
          <RadioGroup
            defaultValue="bestOf3"
            value={matchFormat}
            onValueChange={(value) =>
              setMatchFormat(value as 'bestOf1' | 'bestOf3')
            }
            className="grid grid-cols-2 gap-3"
          >
            <div className="flex items-center space-x-2 rounded-lg border p-3">
              <RadioGroupItem value="bestOf1" id="bestOf1" />
              <Label htmlFor="bestOf1" className="cursor-pointer text-sm">
                Best of 1
              </Label>
            </div>
            <div className="flex items-center space-x-2 rounded-lg border p-3">
              <RadioGroupItem value="bestOf3" id="bestOf3" />
              <Label htmlFor="bestOf3" className="cursor-pointer text-sm">
                Best of 3
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="simulationCount" className="text-sm font-medium">
            Number of Simulations
          </Label>
          <div className="flex items-center gap-4">
            <Slider
              id="simulationCount"
              min={1}
              max={1000000}
              step={1000}
              value={[simulationCount]}
              onValueChange={(value) => setSimulationCount(value[0])}
              className="flex-1"
            />
            <Input
              type="number"
              min={1}
              max={1000000}
              value={simulationCount}
              onChange={(e) => setSimulationCount(Number(e.target.value))}
              className="h-12 w-24 text-lg"
            />
          </div>
        </div>
      </div>

      <Card className="bg-muted/50 p-4">
        <div className="mb-4 flex items-center gap-2">
          <h3 className="text-base font-medium">Player Ratings (DUPR)</h3>
        </div>

        {gameFormat === 'singles' ? (
          <div className="space-y-2">
            <Label htmlFor="singleRating" className="text-sm">
              Player Rating
            </Label>
            <Input
              id="singleRating"
              type="number"
              step="0.1"
              min="2.0"
              max="8.0"
              value={singleRating}
              onChange={(e) => setSingleRating(e.target.value)}
              className="h-12 text-lg"
              placeholder="4.5"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h4 className="mb-3 text-sm font-medium">Team 1</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="team1Player1" className="text-xs">
                    Player 1
                  </Label>
                  <Input
                    id="team1Player1"
                    type="number"
                    step="0.1"
                    min="2.0"
                    max="8.0"
                    value={team1Player1}
                    onChange={(e) => setTeam1Player1(e.target.value)}
                    className="h-10"
                    placeholder="4.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team1Player2" className="text-xs">
                    Player 2
                  </Label>
                  <Input
                    id="team1Player2"
                    type="number"
                    step="0.1"
                    min="2.0"
                    max="8.0"
                    value={team1Player2}
                    onChange={(e) => setTeam1Player2(e.target.value)}
                    className="h-10"
                    placeholder="4.0"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-medium">Team 2</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="team2Player1" className="text-xs">
                    Player 1
                  </Label>
                  <Input
                    id="team2Player1"
                    type="number"
                    step="0.1"
                    min="2.0"
                    max="8.0"
                    value={team2Player1}
                    onChange={(e) => setTeam2Player1(e.target.value)}
                    className="h-10"
                    placeholder="4.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team2Player2" className="text-xs">
                    Player 2
                  </Label>
                  <Input
                    id="team2Player2"
                    type="number"
                    step="0.1"
                    min="2.0"
                    max="8.0"
                    value={team2Player2}
                    onChange={(e) => setTeam2Player2(e.target.value)}
                    className="h-10"
                    placeholder="4.0"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="sideAdvantage" className="text-sm font-medium">
            Side Advantage
          </Label>
          <span className="text-sm font-medium text-muted-foreground">
            {sideAdvantage[0] < 0
              ? `Left side: ${Math.abs(sideAdvantage[0])}`
              : sideAdvantage[0] > 0
                ? `Right side: ${sideAdvantage[0]}`
                : 'No advantage'}
          </span>
        </div>
        <div className="px-2">
          <div className="flex items-center space-x-4">
            <span className="min-w-0 text-xs text-muted-foreground">
              Left (-5)
            </span>
            <Slider
              id="sideAdvantage"
              min={-5}
              max={5}
              step={1}
              value={sideAdvantage}
              onValueChange={setSideAdvantage}
              className="flex-1"
            />
            <span className="min-w-0 text-xs text-muted-foreground">
              Right (+5)
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Each discrete value represents a 1% advantage
        </p>
      </div>

      <div className="flex items-center justify-between rounded-lg border p-3">
        <div className="flex-1">
          <Label
            htmlFor="firstPointRule"
            className="cursor-pointer text-sm font-medium"
          >
            Serving team loses first point
          </Label>
          <p className="mt-1 text-xs text-muted-foreground">
            On special request :))
          </p>
        </div>
        <Switch
          id="firstPointRule"
          checked={firstPointRule}
          onCheckedChange={setFirstPointRule}
        />
      </div>

      <Button type="submit" className="h-12 w-full text-base font-medium">
        Run Simulation
      </Button>
    </form>
  );
}
