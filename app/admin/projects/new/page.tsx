import { ProjectForm } from "@/components/admin/project-form"

export default function NewProjectPage() {
    return (
        <div className="p-8 space-y-6 max-w-5xl mx-auto">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">New Project</h1>
                <p className="text-muted-foreground">Create a new project portfolio item.</p>
            </div>
            <ProjectForm />
        </div>
    )
}
