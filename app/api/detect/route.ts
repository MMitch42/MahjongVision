import { NextResponse } from "next/server";
import { parsePredictions, type RawPrediction } from "@/lib/scoring/roboflow-parser";

export async function POST(request: Request) {
  let body: { image?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { image } = body;
  if (!image || typeof image !== "string") {
    return NextResponse.json({ error: "Missing required field: image (base64 string)" }, { status: 400 });
  }

  const apiKey = process.env.ROBOFLOW_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Roboflow environment variables not configured" }, { status: 500 });
  }

  const url = `https://detect.roboflow.com/riichicam/1?api_key=${apiKey}`;

  let roboflowData: { predictions?: RawPrediction[] };
  try {
    const response = await fetch(url, {
      method: "POST",
      body: image,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { error: `Roboflow request failed (${response.status}): ${text}` },
        { status: 502 }
      );
    }

    roboflowData = await response.json();
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to reach Roboflow: ${err instanceof Error ? err.message : String(err)}` },
      { status: 502 }
    );
  }

  const rawPredictions: RawPrediction[] = roboflowData.predictions ?? [];

  let tiles;
  try {
    tiles = parsePredictions(rawPredictions);
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to parse predictions: ${err instanceof Error ? err.message : String(err)}` },
      { status: 422 }
    );
  }

  if (tiles.length < 1) {
    return NextResponse.json(
      { error: "No tiles detected. Try better lighting or a closer shot." },
      { status: 422 }
    );
  }

  if (tiles.length > 18) {
    return NextResponse.json(
      { error: "Too many tiles detected. Try scanning hand and dora separately." },
      { status: 422 }
    );
  }

  return NextResponse.json({ tiles, rawPredictions });
}
