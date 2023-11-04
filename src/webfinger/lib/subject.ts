export const extractSubject = (subject: string) => {
  const [user, host] = subject
    .slice(5) // remove `acct:`
    .split('@') // split

  return { user, host }
}
