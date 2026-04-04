const BATCH_COUNTER_KEY = "spqc_batch_counter";

/**
 * Generate a unique batch ID in the format SPQC-DDMMYYYY-T{n}.
 * The counter is persisted in localStorage per calendar day and increments
 * by 1 each time a new test form is opened.
 *
 * Safe to call once per form mount — call it inside a useState lazy initializer
 * (not useEffect) to guarantee it runs exactly once even in React Strict Mode.
 *
 * Example: SPQC-04042026-T1
 */
export function generateBatchId(): string {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = String(now.getFullYear());
  const today = `${dd}${mm}${yyyy}`;

  let counter = 1;
//   try {
//     const stored = localStorage.getItem(BATCH_COUNTER_KEY);
//     if (stored) {
//       const parsed = JSON.parse(stored) as { date: string; count: number };
//       if (parsed.date === today) {
//         counter = parsed.count + 1;
//       }
//     }
//     localStorage.setItem(
//       BATCH_COUNTER_KEY,
//       JSON.stringify({ date: today, count: counter }),
//     );
//   } catch {
//     // localStorage unavailable — keep counter = 1
//   }

  return `SPQC-${today}-T${counter}`;
}
