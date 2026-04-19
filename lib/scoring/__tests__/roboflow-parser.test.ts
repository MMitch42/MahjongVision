import { describe, it, expect } from "vitest";
import {
  roboflowLabelToTile,
  parsePredictions,
  MIN_CONFIDENCE,
  type RawPrediction,
} from "../roboflow-parser";

function pred(cls: string, confidence: number, x: number): RawPrediction {
  return { class: cls, confidence, x, y: 0, width: 10, height: 10 };
}

describe("roboflowLabelToTile", () => {
  it("maps suited tiles correctly", () => {
    expect(roboflowLabelToTile("1m")).toEqual({ suit: "man", value: 1 });
    expect(roboflowLabelToTile("5p")).toEqual({ suit: "pin", value: 5 });
    expect(roboflowLabelToTile("9s")).toEqual({ suit: "sou", value: 9 });
  });

  it("maps honor tiles correctly", () => {
    expect(roboflowLabelToTile("1z")).toEqual({ suit: "honor", value: "east" });
    expect(roboflowLabelToTile("2z")).toEqual({ suit: "honor", value: "south" });
    expect(roboflowLabelToTile("3z")).toEqual({ suit: "honor", value: "west" });
    expect(roboflowLabelToTile("4z")).toEqual({ suit: "honor", value: "north" });
    expect(roboflowLabelToTile("5z")).toEqual({ suit: "honor", value: "haku" });
    expect(roboflowLabelToTile("6z")).toEqual({ suit: "honor", value: "hatsu" });
    expect(roboflowLabelToTile("7z")).toEqual({ suit: "honor", value: "chun" });
  });

  it("throws for unrecognized label", () => {
    expect(() => roboflowLabelToTile("0m")).toThrow("Unrecognized");
    expect(() => roboflowLabelToTile("10p")).toThrow("Unrecognized");
    expect(() => roboflowLabelToTile("8z")).toThrow("Unrecognized");
    expect(() => roboflowLabelToTile("foo")).toThrow("Unrecognized");
  });
});

describe("parsePredictions", () => {
  it("returns empty array for empty input", () => {
    expect(parsePredictions([])).toEqual([]);
  });

  it("filters out predictions below MIN_CONFIDENCE", () => {
    const preds = [
      pred("1m", MIN_CONFIDENCE - 0.01, 10),
      pred("2m", MIN_CONFIDENCE, 20),
      pred("3m", 0.9, 30),
    ];
    const tiles = parsePredictions(preds);
    expect(tiles).toHaveLength(2);
    expect(tiles[0]).toEqual({ suit: "man", value: 2 });
    expect(tiles[1]).toEqual({ suit: "man", value: 3 });
  });

  it("sorts predictions left-to-right by x coordinate", () => {
    const preds = [
      pred("9s", 0.9, 300),
      pred("1m", 0.9, 10),
      pred("5p", 0.9, 150),
    ];
    const tiles = parsePredictions(preds);
    expect(tiles).toEqual([
      { suit: "man", value: 1 },
      { suit: "pin", value: 5 },
      { suit: "sou", value: 9 },
    ]);
  });
});
