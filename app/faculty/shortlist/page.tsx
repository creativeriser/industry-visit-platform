import { getCompanies } from "@/lib/companies"
import { ShortlistClient } from "@/components/faculty/shortlist-client"

export default async function ShortlistPage() {
    const companies = await getCompanies()

    return <ShortlistClient companies={companies} />
}
