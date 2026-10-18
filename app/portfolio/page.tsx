import { Navigation } from "@/components/navigation"
import { ProjectsGallery } from "@/components/projects-gallery"
import { getProjects } from "@/app/actions/projects"

export const dynamic = 'force-dynamic'

export default async function PortfolioPage() {
    const projects = await getProjects()

    return (
        <main className="min-h-screen bg-background">
            <Navigation />
            <div className="pt-20">
                <ProjectsGallery projects={projects} />
            </div>
        </main>
    )
}
