import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import * as React from 'react';
import { ALGORITHM_SET } from '@/constants/algorithms-sets';
import { Progress } from '@/components/ui/progress'

export default function AlgorithmsCollection({ set }: { set: ALGORITHM_SET }) {
  const { slug, title, description, cube, Icon, difficulty } = set;
  return (
    <Link href={slug} className="focus:outline-none focus:ring-2 focus:ring-primary rounded-md">
      <Card className="h-full transition-all hover:bg-muted/50 hover:shadow-sm">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-primary/10 text-primary">
              <Icon className="h-5 w-5" aria-hidden="true"/>
            </div>
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge>{cube}</Badge>
          </div>
        </CardHeader>
        <div className={'flex flex-col gap-2'}>
          <div className={'flex flex-row justify-between items-center font-semibold text-xs px-6 '}>
            <div>Skill</div>
            <div className={'flex flex-row items-center gap-1'}>
              {difficulty === 1
                ? 'Casual Enthusiast'
                : difficulty === 2
                  ? 'Dedicated Learner'
                  : 'Algorithm Master'
              }</div>
          </div>
          <CardContent className="flex flex-row gap-3">
            <Progress className={'grow'} value={difficulty >= 1 ? 100 : 0}/>
            <Progress className={'grow'} value={difficulty >= 2 ? 100 : 0}/>
            <Progress className={'grow'} value={difficulty >= 3 ? 100 : 0}/>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}
