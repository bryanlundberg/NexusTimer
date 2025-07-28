import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import ButtonNavbar from '@/components/navigation/buttons/button-navbar';
import Link from 'next/link';

export default function PeopleBreadcrumb({ userName }: { userName: string }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <ButtonNavbar/>
        </BreadcrumbItem>
        <BreadcrumbSeparator/>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={'/people'}>People</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator/>
        <BreadcrumbItem>
          {userName}
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
