import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import * as React from 'react';
import { Layers, Grid3x3, Puzzle, CheckCircle2 } from 'lucide-react';

// Fake data constant defined outside the component (maquetado de datos falsos)
// This allows us to render the UI by mapping over structured data instead of hardcoding JSX.
const ALGORITHM_CATEGORIES = [
  {
    slug: '/algorithms/oll',
    title: 'OLL',
    description: 'Orientation of the Last Layer',
    cube: '3x3',
    learned: 20,
    total: 57,
    Icon: Layers,
  },
  {
    slug: '/algorithms/pll',
    title: 'PLL',
    description: 'Permutation of the Last Layer',
    cube: '3x3',
    learned: 12,
    total: 21,
    Icon: Grid3x3,
  },
  {
    slug: '/algorithms/coll',
    title: 'COLL',
    description: 'Corners of the Last Layer',
    cube: '3x3',
    learned: 6,
    total: 9,
    Icon: Grid3x3,
  },
  {
    slug: '/algorithms/cll',
    title: 'CLL',
    description: 'Corners of the Last Layer',
    cube: '2x2',
    learned: 10,
    total: 42,
    Icon: Grid3x3,
  }
] as const;

type Category = (typeof ALGORITHM_CATEGORIES)[number];

function ProgressBar({ percent }: { percent: number }) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
        <span>Learned</span>
        <span>{clamped}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted">
        <div className="h-2 rounded-full bg-primary" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}

function AlgorithmCard({ category }: { category: Category }) {
  const { slug, title, description, cube, learned, total, Icon } = category;
  const percent = (learned / total) * 100;
  return (
    <Link href={slug} className="focus:outline-none focus:ring-2 focus:ring-primary rounded-md">
      <Card className="h-full transition-all hover:bg-muted/50 hover:shadow-sm">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-primary/10 text-primary">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{cube}</Badge>
            <Badge variant="outline" className="hidden sm:inline-flex">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              {learned}/{total}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <ProgressBar percent={percent} />
        </CardContent>
      </Card>
    </Link>
  );
}

export default function Page() {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-6">
        <SidebarTrigger className="-ml-1"/>
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={'/algorithms'}>Algorithms</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Grid of algorithm categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ALGORITHM_CATEGORIES.map((category) => (
          <AlgorithmCard key={category.slug} category={category} />
        ))}

        {/* Más categorías (placeholder para futuras secciones) */}
        <div className="hidden lg:block">
          <Card className="h-full opacity-70">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-muted text-muted-foreground">
                  <Puzzle className="h-5 w-5" aria-hidden="true" />
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
      </div>
    </div>
  )
}
