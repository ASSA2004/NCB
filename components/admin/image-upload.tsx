"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClientComponentClient } from "@/lib/supabase/client"
import { ImagePlus, Loader2, X } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

interface ImageUploadProps {
    value: string
    onChange: (url: string) => void
    disabled?: boolean
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const supabase = createClientComponentClient()

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0]
            if (!file) return

            setIsUploading(true)

            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('portfolio')
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data } = supabase.storage
                .from('portfolio')
                .getPublicUrl(filePath)

            onChange(data.publicUrl)
            toast.success("Image uploaded")
        } catch (error) {
            console.error(error)
            toast.error("Error uploading image", { description: "Make sure the 'portfolio' bucket exists and is public." })
        } finally {
            setIsUploading(false)
        }
    }

    if (value) {
        return (
            <div className="relative w-full h-48 rounded-md overflow-hidden border border-border">
                <div className="absolute top-2 right-2 z-10">
                    <Button
                        type="button"
                        onClick={() => onChange("")}
                        variant="destructive"
                        size="icon"
                        disabled={disabled}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <Image
                    src={value}
                    alt="Upload"
                    fill
                    className="object-cover"
                />
            </div>
        )
    }

    return (
        <div className="w-full h-48 rounded-md border-2 border-dashed border-input flex items-center justify-center bg-muted/50 hover:bg-muted transition-colors relative cursor-pointer">
            <Input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                onChange={onUpload}
                disabled={disabled || isUploading}
            />
            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                {isUploading ? (
                    <>
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <p className="text-sm font-medium">Uploading...</p>
                    </>
                ) : (
                    <>
                        <ImagePlus className="h-8 w-8" />
                        <p className="text-sm font-medium">Click to upload image</p>
                    </>
                )}
            </div>
        </div>
    )
}
