'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@supabase/auth-helpers-react'

import Sidebar from '@/components/Sidebar'
import DashboardHeader from '../components/DashboardHeader'
import ProfileCard from './components/ProfileInfoCard'
import ProfileSettingsForm from './components/ProfileSettingsForm'
import type { UserProfile } from '@/types'

export default function SettingsPage() {
  const router = useRouter()
  const session = useSession()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session) {
      router.push('/auth/login')
      return
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/v1/users/me`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        })

        if (!res.ok) {
          throw new Error('Failed to fetch profile from backend')
        }

        const data = await res.json()
        setProfile(data)
      } catch (err) {
        console.error('❌ Error fetching profile:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [session, router])

  if (!session) return <p className="p-8 text-center">🔐 Redirecting to login...</p>
  if (loading) return <p className="p-8 text-center">🔄 Loading user profile...</p>

  return (
    <Sidebar>
      <DashboardHeader />
      <div className="p-8 w-full mx-auto">
        {profile ? (
          <>
            <ProfileCard data={profile} />
            <ProfileSettingsForm
              data={profile}
              onSave={(updatedProfile) => setProfile(updatedProfile)}
            />
          </>
        ) : (
          <p className="text-center text-red-500">🚫 Profile not found.</p>
        )}
      </div>
    </Sidebar>
  )
}
