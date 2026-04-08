import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
        return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    try {
        // Fetch User Profile
        const userRes = await fetch(`https://api.github.com/users/${username}`, {
            headers: {
                'User-Agent': 'Industry-Visit-Platform-App',
                ...(process.env.GITHUB_TOKEN && { 'Authorization': `Bearer ${process.env.GITHUB_TOKEN}` })
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });
        
        if (!userRes.ok) throw new Error('GitHub user not found');
        const userData = await userRes.json();

        // Fetch Repositories to calculate languages and find top ones
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
            headers: {
                'User-Agent': 'Industry-Visit-Platform-App',
                ...(process.env.GITHUB_TOKEN && { 'Authorization': `Bearer ${process.env.GITHUB_TOKEN}` })
            },
            next: { revalidate: 3600 }
        });
        
        let repos = [];
        let topLang = "Unknown";
        let totalCommitsProxy = 0; // Without GraphQL, we proxy commits via repo count heuristics or just mock it safely
        const langCounts: Record<string, number> = {};

        if (reposRes.ok) {
            repos = await reposRes.json();
            
            // Calculate Languages Full Array
            repos.forEach((r: any) => {
                if (r.language) {
                    langCounts[r.language] = (langCounts[r.language] || 0) + 1;
                }
                totalCommitsProxy += (r.size || 10); // A proxy metric since raw commits require heavy graphQL
            });
            
            if (Object.keys(langCounts).length > 0) {
                topLang = Object.keys(langCounts).reduce((a, b) => langCounts[a] > langCounts[b] ? a : b);
            }
        }

        // Sort repos by stars for "Pinned" replacements
        const topRepos = repos
            .filter((r: any) => !r.fork)
            .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
            .slice(0, 2)
            .map((r: any) => ({
                name: r.name,
                description: r.description || 'No description provided.',
                language: r.language || 'Unknown',
                stars: r.stargazers_count
            }));

        const joinedYear = new Date(userData.created_at).getFullYear();

        return NextResponse.json({
            followers: userData.followers,
            following: userData.following,
            public_repos: userData.public_repos,
            joinedYear,
            topLang,
            langCounts, // NEW EXPORT
            topRepos,
            // Mocking hard metrics that require deep graph pipelines to prevent massive API rate limits
            totalCommitsProxy: totalCommitsProxy > 1000 ? Math.floor(totalCommitsProxy / 10) : totalCommitsProxy, 
            prs: Math.floor(userData.public_repos * 1.5),
            issues: Math.floor(userData.public_repos * 0.5),
            reviews: Math.floor(userData.public_repos * 0.8)
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
