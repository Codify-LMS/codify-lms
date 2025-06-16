'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

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

  useEffect(() => {
  axios.get('http://localhost:8080/api/v1/users/me')
    .then(res => setData(res.data))
    .catch(err => setError(err))
    .finally(() => setLoading(false))
    }, [])


  return { data, loading, error }
}
