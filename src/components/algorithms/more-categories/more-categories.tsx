import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Puzzle } from 'lucide-react';

export default function MoreCategories() {
  return (
    <div className="block">
      <Card className="h-full opacity-70">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-muted text-muted-foreground">
              <Puzzle className="h-5 w-5" aria-hidden="true"/>
            </div>
            <div>
              <CardTitle className="text-base">Coming soon</CardTitle>
              <CardDescription>More categories</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Coming soon
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
