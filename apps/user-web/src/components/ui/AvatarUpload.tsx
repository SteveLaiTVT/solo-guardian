/**
 * @file AvatarUpload.tsx
 * @description Avatar upload component with preview and validation
 */
import { useRef, useState } from 'react'
import { Camera, Loader2, User, X } from 'lucide-react'
import { Button } from './button'

interface AvatarUploadProps {
  currentAvatar?: string | null
  onUpload: (file: File) => void
  isUploading?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
}

const iconSizes = {
  sm: 16,
  md: 24,
  lg: 32,
}

export function AvatarUpload({
  currentAvatar,
  onUpload,
  isUploading = false,
  size = 'lg',
  className = '',
}: AvatarUploadProps): JSX.Element {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setError('Image size must be less than 5MB')
      return
    }

    // Clear error and show preview
    setError(null)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    onUpload(file)
  }

  const handleClick = (): void => {
    fileInputRef.current?.click()
  }

  const handleClearPreview = (): void => {
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const displayUrl = previewUrl || currentAvatar

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="relative">
        <div
          className={`${sizeClasses[size]} rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border`}
        >
          {displayUrl ? (
            <img
              src={displayUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="text-muted-foreground" size={iconSizes[size]} />
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="animate-spin text-white" size={iconSizes[size]} />
            </div>
          )}
        </div>

        {previewUrl && !isUploading && (
          <button
            onClick={handleClearPreview}
            className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
            aria-label="Clear preview"
          >
            <X size={16} />
          </button>
        )}

        <button
          onClick={handleClick}
          disabled={isUploading}
          className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          aria-label="Upload avatar"
        >
          <Camera size={size === 'sm' ? 12 : size === 'md' ? 16 : 20} />
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Avatar file input"
      />

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="text-center">
        <Button
          variant="outline"
          size="sm"
          onClick={handleClick}
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Change Avatar'}
        </Button>
        <p className="text-xs text-muted-foreground mt-1">
          PNG, JPG up to 5MB
        </p>
      </div>
    </div>
  )
}
