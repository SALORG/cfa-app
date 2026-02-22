import quants from "./quants.json";
import economics from "./economics.json";
import fsa from "./fsa.json";
import corporate from "./corporate.json";
import equity from "./equity.json";
import fixedIncome from "./fixed-income.json";
import derivatives from "./derivatives.json";
import alternatives from "./alternatives.json";
import portfolio from "./portfolio.json";
import ethics from "./ethics.json";
import consolidated from "./consolidated.json";

// The only subject available to free users
export const FREE_SUBJECT_ID = "quants";

export function isContentLocked(subjectId, isPremium = false) {
  if (isPremium) return false;
  return subjectId !== FREE_SUBJECT_ID;
}

export const subjects = [
  quants,
  economics,
  fsa,
  corporate,
  equity,
  fixedIncome,
  derivatives,
  alternatives,
  portfolio,
  ethics,
];

export { consolidated };

export const allModules = subjects.flatMap((s) =>
  s.modules.map((m) => ({
    ...m,
    subjectId: s.id,
    subjectName: s.name,
    subjectColor: s.color,
    subjectIcon: s.icon,
  }))
);

export function getSubject(subjectId) {
  return subjects.find((s) => s.id === subjectId);
}

export function getModule(subjectId, moduleId) {
  const subject = getSubject(subjectId);
  if (!subject) return null;
  return subject.modules.find((m) => m.id === moduleId);
}

export function getAdjacentModules(subjectId, moduleId) {
  const subject = getSubject(subjectId);
  if (!subject) return { prev: null, next: null };
  const mods = subject.modules;
  const idx = mods.findIndex((m) => m.id === moduleId);
  if (idx === -1) return { prev: null, next: null };

  const prev = idx > 0 ? { ...mods[idx - 1], subjectId } : null;
  const next = idx < mods.length - 1 ? { ...mods[idx + 1], subjectId } : null;
  return { prev, next };
}

export function searchModules(query) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  const results = [];

  for (const mod of allModules) {
    let score = 0;
    if (mod.title.toLowerCase().includes(q)) score += 10;

    const cs = mod.cheatSheet;
    if (cs) {
      for (const c of cs.concepts || []) {
        if (c.title.toLowerCase().includes(q)) score += 5;
        if (c.desc.toLowerCase().includes(q)) score += 2;
      }
      for (const f of cs.formulas || []) {
        if (f.name.toLowerCase().includes(q)) score += 5;
        if (f.formula.toLowerCase().includes(q)) score += 3;
      }
    }

    if (score > 0) {
      results.push({ ...mod, score });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 10);
}

export function searchFormulas(query) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  const results = [];

  for (const section of consolidated.masterFormulas.sections) {
    for (const f of section.formulas) {
      let score = 0;
      if (f.name.toLowerCase().includes(q)) score += 10;
      if (f.formula.toLowerCase().includes(q)) score += 5;
      if (f.note && f.note.toLowerCase().includes(q)) score += 3;

      if (score > 0) {
        results.push({
          type: "formula",
          name: f.name,
          formula: f.formula,
          note: f.note,
          subject: section.subject,
          score,
        });
      }
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 8);
}
