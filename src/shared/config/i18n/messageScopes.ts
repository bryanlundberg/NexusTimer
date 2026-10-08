import { omit, pick } from 'es-toolkit/compat'
import type { AbstractIntlMessages } from 'next-intl'

const SHELL = ['Cookies', 'Index.Offline']

const LANDING = ['LandingPage', 'Metadata.pages']

const SERVER_ONLY = [
  'OpenGraphImage',
  'Metadata.keywords',
  'Index.AlgorithmsPage.guides',
  'Index.AlgorithmsPage.descriptions'
]

export function shellMessages(messages: AbstractIntlMessages): AbstractIntlMessages {
  return pick(messages, SHELL)
}

export function landingMessages(messages: AbstractIntlMessages): AbstractIntlMessages {
  return pick(messages, LANDING)
}

export function appMessages(messages: AbstractIntlMessages): AbstractIntlMessages {
  return omit(messages, [...SHELL, ...SERVER_ONLY, 'LandingPage'])
}
