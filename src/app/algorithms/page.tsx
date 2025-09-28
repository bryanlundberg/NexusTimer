import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb';
import Link from 'next/link';
import * as React from 'react';
import MoreCategories from '@/components/algorithms/more-categories/more-categories';
import { ALGORITHM_SETS } from '@/constants/algorithms-sets';
import AlgorithmsCollection from '@/components/algorithms/algorithms-collection/algorithms-collection';

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ALGORITHM_SETS.map((set) => (
          <AlgorithmsCollection key={set.slug} set={set}/>
        ))}

        <MoreCategories/>
      </div>
    </div>
  )
}
