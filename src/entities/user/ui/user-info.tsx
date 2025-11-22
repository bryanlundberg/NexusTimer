import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { GlobeAmericasIcon } from '@heroicons/react/24/outline'
import { Badge } from '@/components/ui/badge'
import * as React from 'react'
import { useMemo, useState } from 'react'
import { UserDocument } from '@/entities/user/model/user'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useUser } from '@/entities/user/model/useUser'

export default function UserInfo({ user }: { user: UserDocument }) {
  const { data: session } = useSession()
  const { mutate } = useUser(user._id)
  const isCurrentUser = session?.user?.id === user._id
  const timezones = useMemo(() => (Intl as any).supportedValuesOf('timeZone'), [])
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      timezone: user?.timezone || '',
      goal: user?.goal || '',
      pronoun: user?.pronoun || '',
      bio: user?.bio || ''
    }
  })

  const [isEditing, setIsEditing] = useState(false)
  const handleSaveChanges = async (form: any) => {
    const updatedForm = {
      ...form,
      timezone: form.timezone || undefined,
      goal: form.goal || undefined,
      pronoun: form.pronoun || undefined,
      bio: form.bio || undefined
    }

    try {
      const request = await fetch(`/api/v1/users/${session?.user?.id}`, {
        method: 'PATCH',
        body: JSON.stringify(updatedForm)
      })

      if (!request.ok) {
        toast('Failed to update user')
        return
      }

      await mutate()
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error('Failed to update user')
      return
    }
  }

  return (
    <div className="flex flex-col gap-2 p-4 md:sticky md:top-4 h-fit w-full max-w-xs">
      {isEditing ? (
        <>
          <div className="relative">
            <Avatar className="size-40 mb-2 shadow-lg">
              <AvatarImage className={'object-cover'} src={user.image} alt={user.name} />
              <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          <div className="w-full mt-2">
            <label className="text-sm text-muted-foreground">Name</label>
            <Input
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 5,
                  message: 'Name must be at least 5 characters long'
                }
              })}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div className="w-full mt-2">
            <label className="text-sm text-muted-foreground">Timezone</label>
            <Controller
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz: string) => (
                      <SelectItem key={tz} value={tz}>
                        {tz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              name={'timezone'}
            />
          </div>

          <div className="w-full mt-2">
            <label className="text-sm text-muted-foreground">Pronoun</label>
            <Controller
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select pronoun" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={'He'}>He</SelectItem>
                    <SelectItem value={'She'}>She</SelectItem>
                    <SelectItem value={'Other'}>Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
              name={'pronoun'}
            />
          </div>

          <div className="w-full mt-2">
            <label className="text-sm text-muted-foreground">Goal</label>
            <Input {...register('goal')} />
          </div>

          <div className="w-full mt-2">
            <label className="text-sm text-muted-foreground">Bio</label>
            <Textarea placeholder="Tell us about yourself" {...register('bio')} className="w-full" rows={3} />
          </div>

          <div className="flex gap-2 mt-4 w-full">
            <Button variant="outline" className="flex-1" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button className="flex-1" disabled={isSubmitting} onClick={handleSubmit(handleSaveChanges)}>
              Save
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="relative">
            <Avatar className="size-60 mb-2 shadow-lg mx-auto">
              <AvatarImage className={'object-cover'} src={user.image} alt={user.name} />
              <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          <h2 className="scroll-m-20 text-center text-xl font-extrabold tracking-tight text-balance flex items-center justify-center gap-2">
            {user.name}{' '}
            {user?.pronoun && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground font-normal">
                <span>{user?.pronoun}</span>
              </div>
            )}
          </h2>

          {user?.timezone && (
            <div className={'flex items-center gap-1'}>
              <GlobeAmericasIcon className={'size-5'} />
              {user?.timezone}
              <span className={'opacity-50'}>
                (
                {new Intl.DateTimeFormat('en-US', {
                  timeZone: user.timezone,
                  timeStyle: 'short'
                }).format(new Date())}
                )
              </span>
            </div>
          )}
          {user?.goal && <Badge>{user?.goal}</Badge>}

          {user?.bio && (
            <div className="w-full mt-2 text-sm">
              <p className="text-muted-foreground">{user?.bio}</p>
            </div>
          )}

          {isCurrentUser && !isEditing && (
            <Button variant="secondary" onClick={() => setIsEditing(true)}>
              Edit profile
            </Button>
          )}
        </>
      )}
    </div>
  )
}
