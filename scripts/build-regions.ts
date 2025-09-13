import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// CSV 파일 경로 (UTF-8 변환된 거)
const SRC = resolve(process.cwd(), "data/regions_utf8.csv");
const OUT_DIR = resolve(process.cwd(), "src/generated");
mkdirSync(OUT_DIR, { recursive: true });

function parseCSV(text: string) {
  const [header, ...lines] = text.trim().split(/\r?\n/);
  const cols = header.split(",");

  const idxCode = cols.findIndex(c => /행정코드/.test(c));
  const idxName = cols.findIndex(c => /행정구역명/.test(c));
  const idxLeaf = cols.findIndex(c => /최하위행정구역명/.test(c));

  if (idxCode < 0 || idxName < 0) {
    throw new Error("CSV 헤더 매핑 실패: 행정코드/행정구역명 없음");
  }

  return lines.map(line => {
    const cells = line.split(",");
    return {
      code: cells[idxCode].trim(),
      name: cells[idxName].trim(),
      leaf: idxLeaf >= 0 ? cells[idxLeaf].trim() : "",
    };
  });
}

const csv = readFileSync(SRC, "utf8");
const rows = parseCSV(csv).filter(r => /^\d{10}$/.test(r.code));

/** 매핑: 전체 행정구역명 → 코드 */
const regionMap: Record<string, number> = {};
for (const r of rows) {
  regionMap[r.name] = Number(r.code);
}

// build-regions.ts 마지막 부분에 추가
type Node = { name: string; code?: number; children: Record<string, Node> };
const root: Record<string, Node> = {};

for (const r of rows) {
  const parts = r.name.split(' '); // 예: ["경상남도","사천시","곤명면","용산리"]
  if (parts.length < 2) continue;

  let cur = root;
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    cur[p] ??= { name: p, children: {} };
    if (i === parts.length - 1) {
      cur[p].code = Number(r.code);
    }
    cur = cur[p].children;
  }
}

writeFileSync(resolve(OUT_DIR, "regions.tree.json"), JSON.stringify(root, null, 2));

// JSON 저장
writeFileSync(resolve(OUT_DIR, "regions.map.json"), JSON.stringify(regionMap, null, 2));

console.log("✔ regions.map.json 생성 완료 (총", Object.keys(regionMap).length, "건)");