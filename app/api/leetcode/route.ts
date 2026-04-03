import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
        return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    try {
        const query = `
        query getUserProfile($username: String!) {
            allQuestionsCount {
                difficulty
                count
            }
            matchedUser(username: $username) {
                profile {
                    ranking
                    reputation
                }
                submitStats {
                    acSubmissionNum {
                        difficulty
                        count
                        submissions
                    }
                }
            }
            userContestRanking(username: $username) {
                rating
                topPercentage
            }
        }`;

        const res = await fetch('https://leetcode.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0'
            },
            body: JSON.stringify({
                query,
                variables: { username }
            }),
            next: { revalidate: 3600 }
        });

        if (!res.ok) {
            throw new Error('Failed to fetch LeetCode data');
        }

        const data = await res.json();
        const user = data.data?.matchedUser;
        const contest = data.data?.userContestRanking;

        if (!user) {
            throw new Error('User not found on LeetCode');
        }

        const totalQuestions = data.data.allQuestionsCount;
        const acSubmissions = user.submitStats.acSubmissionNum;

        // Parse difficulty counts
        let easyTotal = 0, medTotal = 0, hardTotal = 0;
        totalQuestions.forEach((q: any) => {
            if (q.difficulty === 'Easy') easyTotal = q.count;
            if (q.difficulty === 'Medium') medTotal = q.count;
            if (q.difficulty === 'Hard') hardTotal = q.count;
        });

        let easySolved = 0, medSolved = 0, hardSolved = 0;
        acSubmissions.forEach((s: any) => {
            if (s.difficulty === 'Easy') easySolved = s.count;
            if (s.difficulty === 'Medium') medSolved = s.count;
            if (s.difficulty === 'Hard') hardSolved = s.count;
        });

        return NextResponse.json({
            ranking: user.profile.ranking,
            contestRating: contest ? Math.round(contest.rating) : 'N/A',
            topPercentage: contest ? contest.topPercentage : 'N/A',
            easy: { solved: easySolved, total: easyTotal },
            medium: { solved: medSolved, total: medTotal },
            hard: { solved: hardSolved, total: hardTotal },
            totalSolved: easySolved + medSolved + hardSolved
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
