import { getCompanies } from "@/lib/companies"
import { DashboardClient } from "@/components/faculty/dashboard-client"

export default async function FacultyDashboardPage() {
    const companies = await getCompanies()

    return <DashboardClient companies={companies} />
}
