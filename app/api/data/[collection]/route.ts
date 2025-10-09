import { type NextRequest, NextResponse } from "next/server"
import { getDatabase, COLLECTIONS } from "@/lib/mongodb"

export async function GET(request: NextRequest, { params }: { params: { collection: string } }) {
  try {
    const { collection: collectionParam } = params
    const { searchParams } = new URL(request.url)
    const version = searchParams.get("version")

    // Map URL param to collection name
    const collectionMap: Record<string, string> = {
      workloads: COLLECTIONS.workloads,
      labels: COLLECTIONS.labels,
      services: COLLECTIONS.services,
      "ip-lists": COLLECTIONS.ipLists,
      rulesets: COLLECTIONS.rulesets,
      "label-groups": COLLECTIONS.labelGroups,
    }

    const collectionName = collectionMap[collectionParam]
    if (!collectionName) {
      return NextResponse.json({ error: "Invalid collection" }, { status: 400 })
    }

    const db = await getDatabase()
    const collection = db.collection(collectionName)

    // Build query
    const query: any = {}
    if (version) {
      query._version = Number.parseInt(version)
    }

    // Fetch data
    const data = await collection.find(query).sort({ _uploadedAt: -1 }).limit(10000).toArray()

    return NextResponse.json({
      success: true,
      data,
      count: data.length,
    })
  } catch (error) {
    console.error("[v0] Fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}
