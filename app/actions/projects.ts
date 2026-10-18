'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Project } from '@/lib/projects-data' // Importing type for reference, but we might define a new type locally if the DB schema differs slightly

// Define the shape of a Project based on our DB schema
export type DBProject = {
    id: string
    slug: string
    title: string
    title_ta: string | null
    location: string
    location_ta: string | null
    total_area: string | null
    total_area_ta: string | null
    ground_floor: string | null
    ground_floor_ta: string | null
    first_floor: string | null
    first_floor_ta: string | null
    highlights: string | null
    highlights_ta: string | null
    thumbnail: string
    featured: boolean
    completion_date: string | null
    status: 'Completed' | 'In Progress' | null
    gallery: string[] | null
    created_at?: string
    updated_at?: string
}

export async function getProjects() {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('project_s1')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching projects:', error)
        return []
    }

    return data as DBProject[]
}

export async function getProjectById(id: string) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('project_s1')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error(`Error fetching project ${id}:`, error)
        return null
    }

    return data as DBProject
}

export async function createProject(formData: DBProject) {
    const supabase = createClient()

    // Basic validation/sanitization could happen here
    const { data, error } = await supabase
        .from('project_s1')
        .insert([formData])
        .select()

    if (error) {
        console.error('Error creating project:', error)
        throw new Error('Failed to create project')
    }

    revalidatePath('/projects')
    revalidatePath('/admin/projects')
    return { success: true, data }
}

export async function updateProject(id: string, formData: Partial<DBProject>) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('project_s1')
        .update(formData)
        .eq('id', id)
        .select()

    if (error) {
        console.error(`Error updating project ${id}:`, error)
        throw new Error('Failed to update project')
    }

    revalidatePath('/projects')
    revalidatePath(`/projects/${id}`)
    revalidatePath('/admin/projects')
    return { success: true, data }
}

export async function deleteProject(id: string) {
    const supabase = createClient()

    const { error } = await supabase
        .from('project_s1')
        .delete()
        .eq('id', id)

    if (error) {
        console.error(`Error deleting project ${id}:`, error)
        throw new Error('Failed to delete project')
    }

    revalidatePath('/projects')
    revalidatePath('/admin/projects')
    return { success: true }
}
