/** GET 쿼리 유틸 */
export function withQuery(path: string, params: Record<string, unknown>): string {
  const usp = new URLSearchParams();

  for (const [k, v] of Object.entries(params)) {
    if (v == null) continue;

    if (Array.isArray(v)) {
      v.forEach((x) => usp.append(k, String(x)));
    } else {
      usp.set(k, String(v));
    }
  }

  return `${path}?${usp.toString()}`;
}