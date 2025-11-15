'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb'
import Link from 'next/link'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePathname, useRouter } from 'next/navigation'
import { ALGORITHM_SETS } from '@/constants/algorithms-sets'

export default function AlgorithmsBreadcrumb({ hideCollectionsSegment = false }: { hideCollectionsSegment?: boolean }) {
  const router = useRouter()
  const pathname = usePathname()
  const segment = pathname!.split('/')[2]

  const handleNavigate = (value: string) => {
    router.push('/algorithms/' + value)
  }

  return (
    <div className="flex items-center gap-2 mb-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={'/algorithms'}>Algorithms</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {!hideCollectionsSegment && (
            <>
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
              <BreadcrumbItem>
                <Select onValueChange={(e) => handleNavigate(e)} defaultValue={segment}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ALGORITHM_SETS.map(({ slug, title }) => (
                      <SelectItem key={slug} value={slug.toLowerCase()}>
                        {title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
