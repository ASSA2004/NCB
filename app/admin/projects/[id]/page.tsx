import { getProjectById } from "@/app/actions/projects"
import { ProjectForm } from "@/components/admin/project-form"
import { notFound } from "next/navigation"

interface PageProps {
    params: {
        id: string
    }
}

export default async function EditProjectPage({ params }: PageProps) {
    const project = await getProjectById(params.id)

    if (!project) {
        notFound()
    }

    return (
        <div className="p-8 space-y-6 max-w-5xl mx-auto">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
                <p className="text-muted-foreground">Manage project details and gallery.</p>
            </div>
            <ProjectForm initialData={project} />
        </div>
    )
}
