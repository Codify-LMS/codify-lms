'use client'
import { useState } from 'react'
import { supabase } from '@/supabaseClient'

export default function AvatarUploader({
  userEmail,
  file,
  onSuccess,
  onError,
}: {
  userEmail: string
  file: File | null
  onSuccess: (url: string) => void
  onError: (msg: string) => void
}) {
  const [isUploading, setUploading] = useState(false)

  const handleUpload = async () => {
    if (!file) return onError('No file selected.')

    setUploading(true)

    const ext = file.name.split('.').pop()
    const path = `avatars/${userEmail}-${Date.now()}.${ext}`

    const { error } = await supabase.storage.from('avatars').upload(path, file)
    if (error) {
      onError(error.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    onSuccess(data.publicUrl)
    setUploading(false)
  }

  return (
    <button
      type="button"
      disabled={isUploading}
      onClick={handleUpload}
      className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800"
    >
      {isUploading ? 'Uploading...' : 'Upload New Avatar'}
    </button>
  )
}
