// NSW curriculum stages, derived automatically from Year level so a parent
// never has to type "Stage 3" by hand (and never gets it wrong or leaves it
// blank, which was silently breaking checklist auto-population before).
export const YEAR_OPTIONS = [
  'Kindergarten', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5',
  'Year 6', 'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12',
];

export function stageForYear(year: string): string {
  const map: Record<string, string> = {
    'Kindergarten': 'Early Stage 1',
    'Year 1': 'Stage 1', 'Year 2': 'Stage 1',
    'Year 3': 'Stage 2', 'Year 4': 'Stage 2',
    'Year 5': 'Stage 3', 'Year 6': 'Stage 3',
    'Year 7': 'Stage 4', 'Year 8': 'Stage 4',
    'Year 9': 'Stage 5', 'Year 10': 'Stage 5',
    'Year 11': 'Stage 6', 'Year 12': 'Stage 6',
  };
  return map[year] || '';
}
