import { NextResponse } from 'next/server'
import type { ZodIssue } from 'zod'

type ErrorBody = { message: string; issues?: ZodIssue[] }

export function ok<T>(data: T) {
  return NextResponse.json(data)
}

export function created<T>(data: T) {
  return NextResponse.json(data, { status: 201 })
}

export function noContent() {
  return new NextResponse(null, { status: 204 })
}

export function badRequest(message = 'Invalid request', issues?: ZodIssue[]) {
  const body: ErrorBody = { message }
  if (issues) body.issues = issues
  return NextResponse.json(body, { status: 400 })
}

export function unauthorized(message = 'Unauthorized') {
  return NextResponse.json({ message }, { status: 401 })
}

export function forbidden(message = 'Forbidden') {
  return NextResponse.json({ message }, { status: 403 })
}

export function notFound(message = 'Not found') {
  return NextResponse.json({ message }, { status: 404 })
}

export function conflict(message = 'Conflict') {
  return NextResponse.json({ message }, { status: 409 })
}

export function serverError(scope: string, error: unknown) {
  console.error(`[${scope}]`, error)
  return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
}
