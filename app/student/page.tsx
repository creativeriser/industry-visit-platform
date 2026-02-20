import { getCompanies } from "@/lib/companies"
import { IndustryGrid } from "@/components/faculty/industry-grid"
import { DashboardHeader } from "@/components/faculty/dashboard-header"

export default async function StudentDashboardPage() {
    const companies = await getCompanies()

    return (
        <div className="h-full flex flex-col overflow-y-auto no-scrollbar scroll-smooth">
            <DashboardHeader basePath="/student" />

            <div className="flex-1 p-8 pt-6 max-w-[1600px] mx-auto w-full space-y-12">
                <section>
                    <IndustryGrid
                        companies={companies}
                        basePath="/student"
                        title="Available Industry Visits"
                        subtitle="Browse and express interest in upcoming visits"
                    />
                </section>
            </div>
        </div>
    )
}
