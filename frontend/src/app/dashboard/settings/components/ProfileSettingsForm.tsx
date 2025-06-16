'use client'

import { useState } from 'react'
import axios from 'axios'
import { supabase } from '@/supabaseClient'
import { UserProfile } from '@/types'
import AvatarUploader from '@/components/AvatarUploader'
import { useUser } from '@/hooks/useUser'

export default function ProfileSettingsForm({
  data,
  onSave,
}: {
  data: UserProfile
  onSave: (profile: UserProfile) => void
}) {
  const [formData, setFormData] = useState<UserProfile>(data)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setUploading] = useState(false)

  const { refreshUserDetails } = useUser()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarUpload = async (): Promise<string | null> => {
    if (!file) return null

    const ext = file.name.split('.').pop()
    const filePath = `avatars/${formData.email}-${Date.now()}.${ext}`

    const { error } = await supabase.storage.from('avatars').upload(filePath, file)
    if (error) {
      console.error('Upload failed:', error.message)
      return null
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
    return data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    let avatarUrl = formData.avatarUrl

    // Jika ada file baru, upload dulu ke Supabase
    if (file) {
      const uploadedUrl = await handleAvatarUpload()
      if (uploadedUrl) {
        avatarUrl = uploadedUrl
      }
    }

    const payload = { ...formData, avatarUrl }

    try {
      const res = await axios.put('http://localhost:8080/api/v1/users/me', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (res.status === 200) {
        onSave(res.data)
        await refreshUserDetails()
        alert('✅ Profile updated successfully!')
      } else {
        throw new Error('Unexpected response from server')
      }
    } catch (err) {
      console.error(err)
      alert('❌ Failed to update profile')
    } finally {
      setUploading(false)
      setFile(null)
      setPreview(null)
    }
  }

  const handleDeleteAvatar = () => {
    setFormData((prev) => ({ ...prev, avatarUrl: '' }))
    setFile(null)
    setPreview(null)
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-8 space-y-6 w-full">
      <h2 className="text-2xl font-semibold text-gray-800">Account Settings</h2>

      {/* Avatar & Upload Section */}
      <div className="flex items-center space-x-6">
        <img
          src={preview || formData.avatarUrl || '/default-avatar.png'}
          alt="Avatar preview"
          className="w-24 h-24 rounded-full object-cover border"
        />
        <input
          type="file"
          id="avatar-file"
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            const selected = e.target.files?.[0]
            if (selected) {
              setFile(selected)
              setPreview(URL.createObjectURL(selected))
            }
          }}
        />
        <label htmlFor="avatar-file">
          <span className="bg-blue-800 text-white px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-blue-700">
            Select File
          </span>
        </label>

        {file && (
          <AvatarUploader
            userEmail={formData.email}
            file={file}
            onSuccess={(url) => {
              setFormData((prev) => ({ ...prev, avatarUrl: url }))
              setPreview(null)
              setFile(null)
            }}
            onError={(msg) => alert(msg)}
          />
        )}

        <button
          type="button"
          onClick={handleDeleteAvatar}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm hover:bg-gray-400"
        >
          Delete avatar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName ?? ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName ?? ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username ?? ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email ?? ''}
            readOnly
            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-500"
          />
        </div>

        <div className="flex justify-between gap-4 pt-4">
          <button
            type="submit"
            disabled={isUploading}
            className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition"
          >
            {isUploading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition"
            onClick={() => alert('⚠️ Not implemented yet')}
          >
            Delete Account
          </button>
        </div>
      </form>
    </div>
  )
}
