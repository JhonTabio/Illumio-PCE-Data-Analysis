import { type NextRequest, NextResponse } from "next/server"
import { getDatabase, COLLECTIONS } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fileType, data, fileName } = body

    if (!fileType || !data || !Array.isArray(data)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    // Map file type to collection name
    const collectionMap: Record<string, string> = {
      workloads: COLLECTIONS.workloads,
      labels: COLLECTIONS.labels,
      services: COLLECTIONS.services,
      "ip-lists": COLLECTIONS.ipLists,
      rulesets: COLLECTIONS.rulesets,
      "label-groups": COLLECTIONS.labelGroups,
    }

    const collectionName = collectionMap[fileType]
    if (!collectionName) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    const db = await getDatabase()
    const collection = db.collection(collectionName)

    // Create upload metadata
    const uploadId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const uploadedAt = new Date()

    // Get the latest version number for this collection
    const latestDoc = await collection.findOne({}, { sort: { version: -1 } })
    const version = (latestDoc?.version || 0) + 1

    // Add metadata to each record
    const recordsWithMetadata = data.map((record: any) => ({
      ...record,
      _uploadId: uploadId,
      _uploadedAt: uploadedAt,
      _version: version,
      _fileName: fileName,
    }))

    // Insert records
    const result = await collection.insertMany(recordsWithMetadata)

    return NextResponse.json({
      success: true,
      uploadId,
      version,
      insertedCount: result.insertedCount,
      collectionName,
    })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Failed to upload data" }, { status: 500 })
  }
}
