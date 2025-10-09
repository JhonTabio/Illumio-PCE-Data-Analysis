import { NextResponse } from "next/server"
import { getDatabase, COLLECTIONS } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await getDatabase()

    // Get versions from all collections
    const collections = Object.values(COLLECTIONS)
    const versionPromises = collections.map(async (collectionName) => {
      const collection = db.collection(collectionName)
      const versions = await collection
        .aggregate([
          {
            $group: {
              _id: "$_version",
              uploadId: { $first: "$_uploadId" },
              uploadedAt: { $first: "$_uploadedAt" },
              fileName: { $first: "$_fileName" },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: -1 } },
        ])
        .toArray()

      return {
        collection: collectionName,
        versions: versions.map((v) => ({
          version: v._id,
          uploadId: v.uploadId,
          uploadedAt: v.uploadedAt,
          fileName: v.fileName,
          count: v.count,
        })),
      }
    })

    const results = await Promise.all(versionPromises)

    return NextResponse.json({
      success: true,
      collections: results,
    })
  } catch (error) {
    console.error("[v0] Versions fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch versions" }, { status: 500 })
  }
}
