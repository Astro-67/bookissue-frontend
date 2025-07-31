import React, { useState, useRef } from 'react'
import { useUploadProfilePicture, useDeleteProfilePicture } from '../../../hooks/api'
import { useAuth } from '../../../contexts/AuthContext'
import { getMediaUrl } from '../../../utils/media'

interface ProfilePictureUploadProps {
  onUploadSuccess?: () => void
}

export const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({ 
  onUploadSuccess 
}) => {
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  
  const uploadMutation = useUploadProfilePicture()
  const deleteMutation = useDeleteProfilePicture()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      alert('Please select a valid image file (JPG, JPEG, or PNG).')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB.')
      return
    }

    setSelectedFile(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      await uploadMutation.mutateAsync(selectedFile)
      setSelectedFile(null)
      setPreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      onUploadSuccess?.()
    } catch (error) {
      // Error is handled by the mutation's onError
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your profile picture?')) {
      return
    }

    try {
      await deleteMutation.mutateAsync()
    } catch (error) {
      // Error is handled by the mutation's onError
    }
  }

  const handleCancel = () => {
    setSelectedFile(null)
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const currentProfilePictureUrl = user?.profile_picture_url

  return (
    <div className="flex items-start space-x-4">
      {/* Current/Preview Image */}
      <div className="flex-shrink-0">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : currentProfilePictureUrl ? (
              <img
                src={getMediaUrl(currentProfilePictureUrl) || ''}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // If image fails to load, show default avatar
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center bg-gray-200">
                        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    `;
                  }
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Upload Controls */}
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileSelect}
            className="hidden"
          />

          {selectedFile ? (
            // File selected - show upload/cancel buttons
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Selected: <span className="font-medium">{selectedFile.name}</span>
              </p>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploadMutation.isPending}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={uploadMutation.isPending}
                  className="px-3 py-1.5 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // No file selected - show select/delete buttons
            <div className="space-y-3">
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                >
                  Choose Picture
                </button>
                {currentProfilePictureUrl && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500">
                JPG, JPEG, or PNG. Max 5MB.
              </p>
            </div>
          )}
        </div>
    </div>
  )
}
