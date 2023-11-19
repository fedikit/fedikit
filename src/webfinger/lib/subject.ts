import type { Webfinger } from './types.ts'

export const parseSubject = (subject: string) => {
  const [user, host] = subject
    .slice(5) // remove `acct:`
    .split('@') // split

  return { user, host }
}

export const fetchSubject = async (subject: string) => {
  const { host } = parseSubject(subject)

  return await fetch(
    `https://${host}/.well-known/webfinger?resource=${subject}`,
    {
      headers: { 'Accept': 'application/jrd+json' },
    },
  ).then((res) => res.json() as unknown as Webfinger)
}
