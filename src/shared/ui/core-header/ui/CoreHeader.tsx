'use client'
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
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import DiscordButton from '@/features/authentication/ui/DiscordButton'
import GoogleButton from '@/features/authentication/ui/GoogleButton'
import { LogInIcon } from 'lucide-react'

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
    <div className="w-full border-b p-3 flex justify-between items-center mb-2 bg-background/60 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-md">
          <SidebarTrigger className="h-8 w-8" />
        </div>
        <Separator orientation="vertical" className="h-6" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={breadcrumbPath} className="font-medium hover:text-primary transition-colors">
                  {breadcrumb}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {secondaryBreadcrumb && secondaryBreadcrumbPath && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={secondaryBreadcrumbPath} className="font-medium hover:text-primary transition-colors">
                      {secondaryBreadcrumb}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center bg-muted/30 border px-3 py-1 rounded-full gap-2 text-xs text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Server: Online
        </div>
        {session?.user ? (
          <NavUser
            user={{
              id: session.user.id as string,
              name: session?.user?.name || 'Guest',
              email: session?.user?.email || '',
              avatar: session?.user?.image || ''
            }}
          />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <LogInIcon />
                Sign In
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DiscordButton />
                <GoogleButton />
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}
