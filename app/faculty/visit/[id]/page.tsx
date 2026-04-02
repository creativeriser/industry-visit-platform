import { getCompanyById } from "@/lib/companies"
import { notFound } from "next/navigation"
import { VisitWorkspace } from "./visit-workspace"

export default async function VisitDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const company = await getCompanyById(parseInt(id))

    if (!company) {
        notFound()
    }

    return (
        <VisitWorkspace company={company} />
    )
}
