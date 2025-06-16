'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'

import Sidebar from '@/components/Sidebar'
import DashboardHeader from '../components/DashboardHeader'
import ProfileCard from './components/ProfileInfoCard'
import ProfileSettingsForm from './components/ProfileSettingsForm'
import type { UserProfile } from '@/types'

export default function SettingsPage() {
  const router = useRouter()
  const session = useSession()
  const supabase = useSupabaseClient()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session) {
      router.push('/auth/login')
      return
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (error) {
        console.error('❌ Failed to fetch profile:', error)
      } else {
        setProfile(data)
      }
      setLoading(false)
    }

    fetchProfile()
  }, [session, supabase, router])

  if (!session) return <p className="p-8 text-center">🔐 Redirecting to login...</p>
  if (loading) return <p className="p-8 text-center">🔄 Loading user profile...</p>

  return (
    <Sidebar>
      <DashboardHeader />
      <div className="p-8 w-full mx-auto">
        {profile ? (
          <>
            <ProfileCard data={profile} />
            <ProfileSettingsForm data={profile} onSave={(updatedProfile) => setProfile(updatedProfile)} />
          </>
        ) : (
          <p className="text-center text-red-500">🚫 Profile not found.</p>
        )}
      </div>
    </Sidebar>
  )
}
