"use client"

import { ImageUpload } from "@/components/admin/image-upload"


import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Plus, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { createProject, updateProject, type DBProject } from "@/app/actions/projects"
import { toast } from "sonner"

const projectSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters."),
    title_ta: z.string().optional(),
    slug: z.string().min(2, "Slug must be at least 2 characters.").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens."),
    location: z.string().min(2, "Location is required."),
    location_ta: z.string().optional(),
    total_area: z.string().optional(),
    total_area_ta: z.string().optional(),
    ground_floor: z.string().optional(),
    ground_floor_ta: z.string().optional(),
    first_floor: z.string().optional(),
    first_floor_ta: z.string().optional(),
    highlights: z.string().optional(),
    highlights_ta: z.string().optional(),
    thumbnail: z.string().url("Must be a valid URL."),
    completion_date: z.string().optional(),
    status: z.enum(["Completed", "In Progress"]),
    featured: z.boolean().default(false),
    gallery: z.array(z.object({ value: z.string().url("Must be a valid URL") })).optional(),
})

type ProjectFormValues = z.infer<typeof projectSchema>

interface ProjectFormProps {
    initialData?: DBProject | null
}

export function ProjectForm({ initialData }: ProjectFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const defaultValues: Partial<ProjectFormValues> = initialData
        ? {
            ...initialData,
            title_ta: initialData.title_ta || "",
            location_ta: initialData.location_ta || "",
            total_area: initialData.total_area || "",
            total_area_ta: initialData.total_area_ta || "",
            ground_floor: initialData.ground_floor || "",
            ground_floor_ta: initialData.ground_floor_ta || "",
            first_floor: initialData.first_floor || "",
            first_floor_ta: initialData.first_floor_ta || "",
            highlights: initialData.highlights || "",
            highlights_ta: initialData.highlights_ta || "",
            completion_date: initialData.completion_date || "",
            status: initialData.status as "Completed" | "In Progress",
            gallery: initialData.gallery ? initialData.gallery.map((url) => ({ value: url })) : [],
        }
        : {
            title: "",
            slug: "",
            location: "",
            status: "In Progress",
            featured: false,
            gallery: [],
        }

    const form = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema),
        defaultValues,
    })

    const { fields, append, remove } = useFieldArray({
        name: "gallery",
        control: form.control,
    })

    async function onSubmit(data: ProjectFormValues) {
        setLoading(true)
        try {
            const formattedData = {
                ...data,
                gallery: data.gallery?.map((item) => item.value) || [],
            }

            if (initialData) {
                await updateProject(initialData.id, formattedData)
                toast.success("Project updated successfully.")
            } else {
                await createProject({ ...formattedData, id: crypto.randomUUID() } as DBProject) // ID generation handled here or DB, but typed as DBProject
                toast.success("Project created successfully.")
            }
            router.push("/admin/projects")
            router.refresh()
        } catch (error) {
            console.error(error)
            toast.error("Something went wrong.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6 space-y-4">
                        <h3 className="font-semibold text-lg">Basic Details</h3>

                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Project Title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="title_ta"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title (Tamil)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Title in Tamil" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug</FormLabel>
                                    <FormControl>
                                        <Input placeholder="project-slug" {...field} />
                                    </FormControl>
                                    <FormDescription>Unique identifier for URL.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Location" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="location_ta"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location (Tamil)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Location in Tamil" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </Card>

                    <Card className="p-6 space-y-4">
                        <h3 className="font-semibold text-lg">Project Specs</h3>

                        <FormField
                            control={form.control}
                            name="total_area"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Total Area</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. 2400 Sq.ft." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="completion_date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Completion Date/Year</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. 2024" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="In Progress">In Progress</SelectItem>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="featured"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Featured Project
                                        </FormLabel>
                                        <FormDescription>
                                            This project will appear on the home page.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </Card>
                </div>

                <Card className="p-6 space-y-4">
                    <h3 className="font-semibold text-lg">Details & Descriptions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="ground_floor"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ground Floor Details</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Details..." className="h-24" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="ground_floor_ta"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ground Floor Details (Tamil)</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Details in Tamil..." className="h-24" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="first_floor"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Floor Details</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Details..." className="h-24" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="first_floor_ta"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Floor Details (Tamil)</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Details in Tamil..." className="h-24" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </Card>

                <Card className="p-6 space-y-4">
                    <h3 className="font-semibold text-lg">Images</h3>

                    <FormField
                        control={form.control}
                        name="thumbnail"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Thumbnail Image</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value}
                                        onChange={field.onChange}
                                        disabled={loading}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <FormLabel>Gallery Images</FormLabel>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => append({ value: "" })}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Image
                            </Button>
                        </div>
                        {fields.map((field, index) => (
                            <div key={field.id} className="relative mb-4">
                                <FormField
                                    control={form.control}
                                    name={`gallery.${index}.value`}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <ImageUpload
                                                    value={field.value || ""}
                                                    onChange={field.onChange}
                                                    disabled={loading}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="absolute top-2 right-2 z-10">
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => remove(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="flex items-center gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? "Update Project" : "Create Project"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
