import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { createClient } from '@/lib/supabase/server'






export async function POST(request: NextRequest) {
    console.log("we are uploading the file")
    try {
        const supabase = await createClient()

        const formData = await request.formData()
        const files = formData.getAll('files')
        console.log("we are uploading the file", files)


        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No files provided' }, { status: 400 })
        }

        const uploadedFiles = []
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 401 })
        }
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            return NextResponse.json({ error: 'Session not found' }, { status: 401 })
        }

        for (const file of files) {
            if (!(file instanceof File)) continue

            // Validate file type (MIME type)
            const allowedMimeTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'text/plain',
                'image/jpeg',
                'image/png',
                'image/gif',
            ];
            if (!allowedMimeTypes.includes(file.type)) {
                console.warn(`Skipping file ${file.name}: Invalid MIME type ${file.type}`);
                continue;
            }

            // Validate file size (e.g., max 20MB)
            const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
            if (file.size > MAX_FILE_SIZE) {
                console.warn(`Skipping file ${file.name}: File size ${file.size} exceeds limit ${MAX_FILE_SIZE}`);
                continue;
            }

            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)

            const originalName = file.name
            const extension = originalName.split('.').pop()
            const uniqueId = uuidv4()
            const newFileName = `${uniqueId}.${extension}`

            const { data, error } = await supabase.storage
                .from('docs') // replace with your actual bucket name
                .upload(`uploads/${newFileName}`, buffer, {
                    contentType: file.type,
                    upsert: false
                })

            if (error) {
                console.error('Supabase storage upload error:', error)
                continue
            }

            const { data: publicUrlData } = supabase.storage
                .from('docs')
                .getPublicUrl(`uploads/${newFileName}`)

            console.log("the public url is :::::::::::::::::::", publicUrlData);
            const { error: dbError } = await supabase.from("documents").insert([
                {
                    user_id: user.id,
                    originalName: originalName,
                    path: newFileName,
                    publicUrl: publicUrlData.publicUrl,
                    newFileName: newFileName,
                    type: file.type,
                    size: file.size,
                },
            ]);

            if (dbError) {
                console.error("❌ DB insert error:", dbError.message);
            }

            uploadedFiles.push({
                originalName,
                fileName: newFileName,
                size: file.size,
                type: file.type,
                path: newFileName
            })
        }



        console.log('Files uploaded to Supabase successfully:', uploadedFiles)

        return NextResponse.json({
            message: 'Files uploaded to Supabase successfully',
            files: uploadedFiles,
            fileRoute: uploadedFiles[0]?.path || null
        })
    } catch (error) {
        console.error('Unexpected error uploading files:', error)
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }
}

export const config = {
    api: {
        bodyParser: false
    }
}


// export async function POST(request: NextRequest) {
//     try {
//         const formData = await request.formData()
//         const files = formData.getAll('files')

//         if (!files || files.length === 0) {
//             return NextResponse.json(
//                 { error: 'No files provided' },
//                 { status: 400 }
//             )
//         }

//         const uploadedFiles = []
//         const uploadDir = join(process.cwd(), 'uploads')
//         await mkdir(uploadDir, { recursive: true })

//         for (const file of files) {
//             if (!(file instanceof File)) continue

//             const bytes = await file.arrayBuffer()
//             const buffer = Buffer.from(bytes)

//             const uniqueId = uuidv4()
//             const originalName = file.name
//             const extension = originalName.split('.').pop()
//             const newFileName = `${uniqueId}.${extension}`

//             const filePath = join(uploadDir, newFileName)
//             await writeFile(filePath, buffer)

//             uploadedFiles.push({
//                 originalName,
//                 fileName: newFileName,
//                 size: file.size,
//                 type: file.type,
//                 path: filePath
//             })
//         }

//         const response = NextResponse.json({
//             message: 'Files uploaded successfully',
//             files: uploadedFiles,
//             fileRoute: uploadedFiles[0].fileName
//         })

//         return response

//     } catch (error) {
//         console.error('Error uploading files:', error)
//         return NextResponse.json(
//             { error: 'Error uploading files' },
//             { status: 500 }
//         )
//     }
// }

// export const config = {
//     api: {
//         bodyParser: false
//     }
// }




