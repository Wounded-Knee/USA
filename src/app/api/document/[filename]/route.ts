import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename: filenameParam } = await params
    const filename = decodeURIComponent(filenameParam)
    
    // Validate filename to prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
    }
    
    // Try to find the file in both library sections
    const possiblePaths = [
      join(process.cwd(), 'public', 'library', 'whimsy', filename),
      join(process.cwd(), 'public', 'library', 'project-specs', filename)
    ]
    
    let filePath: string | null = null
    
    // Check which path exists
    for (const path of possiblePaths) {
      if (existsSync(path)) {
        filePath = path
        break
      }
    }
    
    if (!filePath) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }
    
    // Read the file
    const content = await readFile(filePath, 'utf-8')
    
    // Return the content with appropriate headers
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Error reading document file:', error)
    
    if (error instanceof Error && error.message.includes('ENOENT')) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
