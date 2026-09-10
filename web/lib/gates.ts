export type GateQuestion = {
  q: string;
  o: string[];
  a: number;
  w: string;
  t?: string;
};

export function shuffleQuestions(
  questions: GateQuestion[],
  count = 5,
): GateQuestion[] {
  const byTag = new Map<string, GateQuestion[]>();
  const untagged: GateQuestion[] = [];
  for (const q of questions) {
    const copy = { ...q, o: [...q.o] };
    if (q.t) {
      const list = byTag.get(q.t) ?? [];
      list.push(copy);
      byTag.set(q.t, list);
    } else {
      untagged.push(copy);
    }
  }
  const tags = [...byTag.keys()];
  for (let i = tags.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tags[i], tags[j]] = [tags[j], tags[i]];
  }
  const picked: GateQuestion[] = [];
  for (const tag of tags) {
    if (picked.length >= count) break;
    const list = byTag.get(tag);
    if (!list?.length) continue;
    const k = Math.floor(Math.random() * list.length);
    picked.push(list[k]);
  }
  const rest = [
    ...untagged,
    ...tags.flatMap((tag) => {
      const used = picked.find((p) => p.t === tag);
      return (byTag.get(tag) ?? []).filter((q) => q !== used);
    }),
  ];
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  while (picked.length < count && rest.length) {
    picked.push(rest.pop()!);
  }
  return picked.slice(0, count).map(shuffleOptions);
}

function shuffleOptions(item: GateQuestion): GateQuestion {
  const order = item.o.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return {
    q: item.q,
    o: order.map((i) => item.o[i]),
    a: order.indexOf(item.a),
    w: item.w,
    t: item.t,
  };
}
