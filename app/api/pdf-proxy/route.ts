import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const driveUrl = searchParams.get('url');

    if (!driveUrl) {
        return new NextResponse('Missing URL parameter', { status: 400 });
    }

    // Mathematically extract the drive ID
    const match = driveUrl.match(/\/file\/d\/([^/]+)/);
    if (!match) {
        return new NextResponse('Invalid Google Drive URL', { status: 400 });
    }
    
    const fileId = match[1];
    
    // Connect to the raw export buffer securely bypassing the viewer WAF 
    // '&confirm=t' bypasses the explicit large-file virus-scan prompt
    const directLink = `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`;

    try {
        const response = await fetch(directLink, { redirect: "follow" });
        
        if (!response.ok) {
            throw new Error(`Google API returned ${response.status}`);
        }

        // Return the exact byte stream, but explicitly override all strict UI headers 
        // Force the browser layer to interpret this purely as a flat inline natively-renderable pdf
        return new NextResponse(response.body, {
            headers: {
                'Content-Type': 'application/pdf',
                'Access-Control-Allow-Origin': '*',
                'Content-Disposition': 'inline; filename="resume.pdf"',
                'Cache-Control': 'public, max-age=86400, s-maxage=86400'
            }
        });
    } catch (error: any) {
        return new NextResponse(`Proxy routing failed: ${error.message}`, { status: 500 });
    }
}
