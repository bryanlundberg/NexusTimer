'use client';

import * as React from 'react';
import Link from 'next/link';
import {SidebarTrigger} from '@/components/ui/sidebar';
import {Separator} from '@/components/ui/separator';
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList} from '@/components/ui/breadcrumb';
import {Card} from '@/components/ui/card';
import AlgorithmRender from '@/components/twisty/AlgorithmRender';
import {OLL_ALGS} from "@/app/algorithms/oll/oll";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

export default function Page() {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-6">
        <SidebarTrigger className="-ml-1"/>
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4"/>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={'/algorithms'}>Algorithms</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4"/>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={'/algorithms/oll'}>OLL</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="mb-4">
        <h1 className="text-xl font-semibold">OLL - Orientation of the Last Layer</h1>
      </div>

      <div className={'max-h-dvh overflow-auto'}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {OLL_ALGS.map((item) => (
            <Card key={`OLL-${item.group}-${item.name}`} className="p-3 h-auto">
              <h1>{`OLL-${item.group}-${item.name}`}</h1>
              <div className={"flex flex-row items-start gap-3"}>
                <AlgorithmRender
                  config={{
                    visualization: 'experimental-2D-LL',
                    background: 'none',
                    controlPanel: 'none',
                    alg: item.alg[0],
                    experimentalStickering: 'OLL',
                    experimentalSetupAnchor: 'end',
                  }} width={120} height={120}
                />
                <div className={'flex flex-col gap-2 justify-between text-sm grow'}>
                  {item.alg.map((alg, index) => (
                    <Card className={"p-3 flex items-center justify-center flex-row bg-primary text-primary-foreground"}
                          key={`OLL-${item.group}-${item.name}-alg-${index}`}>
                      <div className={"grow space-y-2"}>
                        <Label className={'ml-2'}>Alternative #{index}:</Label>
                        <Input value={alg} readOnly className={'w-full'}/>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
