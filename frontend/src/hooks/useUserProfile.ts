'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSessionContext } from '@supabase/auth-helpers-react'

export type UserProfile = {
  fullName: string
  nickName?: string
  gender?: string
  country?: string
  language?: string
  timeZone?: string
  email: string
  avatarUrl?: string
}

export default function useUserProfile() {
  const [data, setData] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const { session } = useSessionContext()

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.access_token) {
        setError(new Error('No access token found'))
        setLoading(false)
        return
      }

      try {
        const res = await axios.get('https://codify-lms-production.up.railway.app/api/v1/users/me', {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        })

        setData(res.data)
      } catch (err: any) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [session?.access_token])

  return { data, loading, error }
}
