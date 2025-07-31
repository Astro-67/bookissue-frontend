import React, { useRef } from 'react'

interface ProfilePictureUploadProps {
  onFileSelect?: (file: File | null) => void
  currentProfilePicture?: string | null
  onDelete?: () => void
  isEditing?: boolean
}

export const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({ 
  onFileSelect,
  currentProfilePicture,
  onDelete,
  isEditing = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      onFileSelect?.(null)
      return
    }

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      alert('Please select a valid image file (JPG, JPEG, or PNG).')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      onFileSelect?.(null)
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB.')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      onFileSelect?.(null)
      return
    }

    onFileSelect?.(file)
  }

  const handleDeleteClick = () => {
    if (window.confirm('Are you sure you want to remove your current profile picture?')) {
      onDelete?.();
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleFileSelect}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-300 rounded-md"
      />
      {currentProfilePicture && isEditing && (
        <button
          type="button"
          onClick={handleDeleteClick}
          className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 focus:outline-none focus:ring-1 focus:ring-red-500"
        >
          Remove Current Picture
        </button>
      )}
      <p className="text-xs text-gray-500">
        JPG, JPEG, or PNG. Max 5MB.
      </p>
    </div>
  )
}
