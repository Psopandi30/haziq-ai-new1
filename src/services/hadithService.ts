
// Map common names to API slugs
const bookMap: Record<string, string> = {
    "bukhari": "bukhari", "bukhori": "bukhari", "imam-bukhari": "bukhari",
    "muslim": "muslim", "imam-muslim": "muslim",
    "nasai": "nasai", "an-nasai": "nasai",
    "abu-daud": "abu-daud", "abudaud": "abu-daud", "abu-dawud": "abu-daud",
    "tirmidzi": "tirmidzi", "at-tirmidzi": "tirmidzi", "tirmigi": "tirmidzi",
    "ibnu-majah": "ibnu-majah", "ibnumajah": "ibnu-majah",
    "malik": "malik", "imam-malik": "malik",
    "ahmad": "ahmad", "imam-ahmad": "ahmad",
    "darimi": "darimi", "ad-darimi": "darimi"
};

/**
 * Mendeteksi apakah user meminta hadits spesifik.
 * Jika ya, mencoba mengambil text aslinya dari API.
 * API Source: https://api.hadith.gading.dev/
 */
export async function enrichPromptWithHadith(prompt: string): Promise<string> {
    const normalized = prompt.toLowerCase();

    // Regex: "HR Bukhari No 1", "Hadits Muslim Nomor 50", "Riwayat Abu Daud 10"
    // Group 1: Narrator (Perawi)
    // Group 2: Number
    const pattern = /(?:hadits|hadist|hr|h\.r)\.?\s+(?:riwayat\s+)?([a-z\s-]+?)\s+(?:nomor|no|no\.|:)?\s*(\d+)/i;

    const match = normalized.match(pattern);
    if (!match) return prompt;

    const narratorRaw = match[1].trim().replace(/\s+/g, '-');
    const number = match[2];

    // Find slug
    let slug = '';
    for (const key in bookMap) {
        if (narratorRaw.includes(key)) {
            slug = bookMap[key];
            break;
        }
    }

    if (!slug) return prompt;

    console.log(`[HadithService] Detected fetch request: ${slug} #${number}`);

    try {
        // Fetch Data
        const res = await fetch(`https://api.hadith.gading.dev/books/${slug}/${number}`);
        const data = await res.json();

        if (data.code === 200 || (data.data && data.data.contents)) {
            const hadithData = data.data.contents || data.data; // Structure might vary slightly or be flattened
            const arabic = hadithData.arab;
            const translation = hadithData.id;

            const additionalContext = `
\n[SYSTEM DATA: REFERENSI VALID HADITS]
Berikut adalah data valid dari Database Hadits Digital untuk HR. ${slug} Nomor ${number}:
Teks Arab: ${arabic}
Terjemahan: "${translation}"

INSTRUKSI: Gunakan teks Arab dan Terjemahan di atas sebagai referensi utama jawabanmu.
\n`;
            return prompt + additionalContext;
        }
    } catch (err) {
        console.error("[HadithService] Failed to fetch hadith:", err);
    }

    return prompt;
}
