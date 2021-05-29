import { useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/client'

export default function Page() {
  const [session, loading] = useSession()
  const [reqres, setreqres] = useState({})

  const request = () => {
    fetch('/api/req')
      .then((res) => res.json())
      .then(setreqres)
  }

  if (loading) return 'loading...'

  if (!session)
    return (
      <>
        Not signed in <br />
        <button onClick={() => signIn()}>Sign in</button>
      </>
    )

  return (
    <div>
      <div>
        Signed in as {session.user.email} <br />
        <pre>{JSON.stringify(session, null, 2)}</pre>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
      <div className="mt-8">
        <button onClick={request} className="px-4 py-1 bg-blue-100 rounded">
          req
        </button>
        <pre>{JSON.stringify(reqres, null, 2)}</pre>
      </div>
    </div>
  )
}
