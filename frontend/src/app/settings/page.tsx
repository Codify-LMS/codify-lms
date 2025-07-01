'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@supabase/auth-helpers-react'

import Sidebar from '@/components/Sidebar'
import DashboardHeader from '../dashboard/components/DashboardHeader'
import ProfileCard from './components/ProfileInfoCard'
import ProfileSettingsForm from './components/ProfileSettingsForm'
import type { UserProfile } from '@/types'

export default function SettingsPage() {
  const router = useRouter()
  const session = useSession()
  console.log("🧪 Session object:", session)


  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session) {
      router.push('/auth/login')
      return
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`https://codify-lms-production.up.railway.app/api/v1/users/me`, {
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
      {/* ✅ PERBAIKAN DI SINI: Ubah padding pada div pembungkus */}
      <div className="px-8 py-6 w-full"> {/* Ganti 'p-8' menjadi 'px-8 py-6' */}
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