import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import Link from 'next/link'
import { NavUser } from '@/widgets/sidebar/ui/nav-user'
import * as React from 'react'
import { useSession } from 'next-auth/react'

interface CoreHeaderProps {
  breadcrumbPath: string
  breadcrumb: string

  secondaryBreadcrumbPath?: string
  secondaryBreadcrumb?: string
}

export default function CoreHeader({
  breadcrumb,
  breadcrumbPath,
  secondaryBreadcrumbPath,
  secondaryBreadcrumb
}: CoreHeaderProps) {
  const { data: session } = useSession()

  return (
    <div className="w-full border-b p-2 flex justify-between items-center mb-2 backdrop-blur-lg">
      <div className="flex items-center gap-2 w-fit">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={breadcrumbPath}>{breadcrumb}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {secondaryBreadcrumb && secondaryBreadcrumbPath && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={secondaryBreadcrumbPath}>{secondaryBreadcrumb}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <NavUser
        user={{
          name: session?.user?.name || 'Guest',
          email: session?.user?.email || ',',
          avatar: session?.user?.image || ''
        }}
      />
    </div>
  )
}
