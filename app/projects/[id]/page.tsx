import { getProjectById } from "@/app/actions/projects"
import { ProjectDetailClient } from "@/components/project-detail-client"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const project = await getProjectById(params.id)

  if (!project) {
    notFound()
  }

  return <ProjectDetailClient project={project} />
}
