
// Map of Surah names to their numbers
const surahMap: Record<string, number> = {
    "alfatihah": 1, "al-fatihah": 1, "fatihah": 1,
    "albaqarah": 2, "al-baqarah": 2, "baqarah": 2,
    "aliimran": 3, "ali-imran": 3, "al-imran": 3, "imran": 3,
    "annisa": 4, "an-nisa": 4, "nisa": 4,
    "almaidah": 5, "al-maidah": 5, "maidah": 5,
    "alanam": 6, "al-anam": 6, "anam": 6,
    "alaraf": 7, "al-araf": 7, "araf": 7,
    "alanfal": 8, "al-anfal": 8, "anfal": 8,
    "attaubah": 9, "at-taubah": 9, "taubah": 9,
    "yunus": 10,
    "hud": 11,
    "yusuf": 12,
    "arrad": 13, "ar-rad": 13, "rad": 13,
    "ibrahim": 14,
    "alhijr": 15, "al-hijr": 15, "hijr": 15,
    "annahl": 16, "an-nahl": 16, "nahl": 16,
    "alisra": 17, "al-isra": 17, "isra": 17,
    "alkahfi": 18, "al-kahfi": 18, "kahfi": 18,
    "maryam": 19,
    "thaha": 20, "taha": 20,
    "alanbiya": 21, "al-anbiya": 21, "anbiya": 21,
    "alhajj": 22, "al-hajj": 22, "hajj": 22,
    "almuminun": 23, "al-muminun": 23, "muminun": 23,
    "annur": 24, "an-nur": 24, "nur": 24,
    "alfurqan": 25, "al-furqan": 25, "furqan": 25,
    "asy-syuara": 26, "asysyuara": 26, "syuara": 26,
    "annam": 27, "an-naml": 27, "naml": 27,
    "alqashash": 28, "al-qashash": 28, "qashash": 28,
    "alankabut": 29, "al-ankabut": 29, "ankabut": 29,
    "arrum": 30, "ar-rum": 30, "rum": 30,
    "luqman": 31,
    "assajdah": 32, "as-sajdah": 32, "sajdah": 32,
    "al-ahzab": 33, "ahzab": 33,
    "saba": 34,
    "fathir": 35,
    "yasin": 36,
    "ash-shaffat": 37, "shaffat": 37,
    "shad": 38,
    "azzumar": 39, "az-zumar": 39, "zumar": 39,
    "ghafir": 40,
    "fushilat": 41,
    "asy-syura": 42, "syura": 42,
    "azzukhruf": 43, "az-zukhruf": 43, "zukhruf": 43,
    "addukhan": 44, "ad-dukhan": 44, "dukhan": 44,
    "aljasiyah": 45, "al-jasiyah": 45, "jasiyah": 45,
    "alahqaf": 46, "al-ahqaf": 46, "ahqaf": 46,
    "muhammad": 47,
    "alfath": 48, "al-fath": 48, "fath": 48,
    "alhujurat": 49, "al-hujurat": 49, "hujurat": 49,
    "qaf": 50,
    "adz-dzariyat": 51, "dzariyat": 51,
    "ath-thur": 52, "thur": 52,
    "annajm": 53, "an-najm": 53, "najm": 53,
    "alqamar": 54, "al-qamar": 54, "qamar": 54,
    "arrahman": 55, "ar-rahman": 55, "rahman": 55,
    "alwaqiah": 56, "al-waqiah": 56, "waqiah": 56,
    "alhadid": 57, "al-hadid": 57, "hadid": 57,
    "almujadilah": 58, "al-mujadilah": 58, "mujadilah": 58,
    "alhasyr": 59, "al-hasyr": 59, "hasyr": 59,
    "almumtahanah": 60, "al-mumtahanah": 60, "mumtahanah": 60,
    "ash-shaff": 61, "shaff": 61,
    "aljumuah": 62, "al-jumuah": 62, "jumuah": 62,
    "almunafiqun": 63, "al-munafiqun": 63, "munafiqun": 63,
    "attaghabun": 64, "at-taghabun": 64, "taghabun": 64,
    "ath-thalaq": 65, "thalaq": 65,
    "attahrim": 66, "at-tahrim": 66, "tahrim": 66,
    "almulk": 67, "al-mulk": 67, "mulk": 67,
    "alqalam": 68, "al-qalam": 68, "qalam": 68,
    "alhaqqah": 69, "al-haqqah": 69, "haqqah": 69,
    "almaarij": 70, "al-maarij": 70, "maarij": 70,
    "nuh": 71,
    "aljin": 72, "al-jin": 72, "jin": 72,
    "almuzammil": 73, "al-muzammil": 73, "muzammil": 73,
    "almuddatsir": 74, "al-muddatsir": 74, "muddatsir": 74,
    "alqiyamah": 75, "al-qiyamah": 75, "qiyamah": 75,
    "alinsan": 76, "al-insan": 76, "insan": 76,
    "almursalat": 77, "al-mursalat": 77, "mursalat": 77,
    "annaba": 78, "an-naba": 78, "naba": 78,
    "annaziat": 79, "an-naziat": 79, "naziat": 79,
    "abasa": 80,
    "attakwir": 81, "at-takwir": 81, "takwir": 81,
    "alinfithar": 82, "al-infithar": 82, "infithar": 82,
    "almuthaffifin": 83, "al-muthaffifin": 83, "muthaffifin": 83,
    "alinsyiqaq": 84, "al-insyiqaq": 84, "insyiqaq": 84,
    "alburuj": 85, "al-buruj": 85, "buruj": 85,
    "ath-thariq": 86, "thariq": 86,
    "alala": 87, "al-ala": 87, "ala": 87,
    "alghasyiyah": 88, "al-ghasyiyah": 88, "ghasyiyah": 88,
    "alfajr": 89, "al-fajr": 89, "fajr": 89,
    "albalad": 90, "al-balad": 90, "balad": 90,
    "asy-syams": 91, "syams": 91,
    "allail": 92, "al-lail": 92, "lail": 92,
    "adh-dhuha": 93, "dhuha": 93,
    "alinsyirah": 94, "al-insyirah": 94, "insyirah": 94,
    "attin": 95, "at-tin": 95, "tin": 95,
    "alalaq": 96, "al-alaq": 96, "alaq": 96,
    "alqadr": 97, "al-qadr": 97, "qadr": 97,
    "albayyinah": 98, "al-bayyinah": 98, "bayyinah": 98,
    "alzalzalah": 99, "al-zalzalah": 99, "zalzalah": 99,
    "aladiyat": 100, "al-adiyat": 100, "adiyat": 100,
    "alqariah": 101, "al-qariah": 101, "qariah": 101,
    "attakatsur": 102, "at-takatsur": 102, "takatsur": 102,
    "alashr": 103, "al-ashr": 103, "ashr": 103,
    "alhumazah": 104, "al-humazah": 104, "humazah": 104,
    "alfil": 105, "al-fil": 105, "fil": 105,
    "quraisy": 106,
    "almaun": 107, "al-maun": 107, "maun": 107,
    "alkautsar": 108, "al-kautsar": 108, "kautsar": 108,
    "alkafirun": 109, "al-kafirun": 109, "kafirun": 109,
    "annashr": 110, "an-nashr": 110, "nashr": 110,
    "allahab": 111, "al-lahab": 111, "lahab": 111,
    "alikhlas": 112, "al-ikhlas": 112, "ikhlas": 112,
    "alfalaq": 113, "al-falaq": 113, "falaq": 113,
    "annas": 114, "an-nas": 114, "nas": 114
};

/**
 * Mendeteksi apakah user meminta ayat Al-Quran tertentu.
 * Jika ya, mencoba mengambil text aslinya dari API.
 */
export async function enrichPromptWithQuran(prompt: string): Promise<string> {
    const normalized = prompt.toLowerCase().replace(/[^a-z0-9\s-]/g, '');

    // Regex patterns: "surat x ayat y", "qs x:y"
    // Match groups: 1=Surah Name/Number, 2=Ayah Number
    const patterns = [
        /(?:surat|surah|qs|q\.s|al-quran)\s+([a-z\s-]+?)\s*(?:ayat|:)\s*(\d+)/i,
        /(?:ayat)\s+(\d+)\s+(?:surat|surah)\s+([a-z\s-]+)/i // "Ayat 5 Surat Al Baqarah"
    ];

    let surahNameOrNum = '';
    let ayahNum = '';

    for (const pattern of patterns) {
        const match = normalized.match(pattern);
        if (match) {
            // Logic untuk pattern ke-2 (Ayat dulu baru Surat)
            if (pattern.source.startsWith('(?:ayat)')) {
                ayahNum = match[1];
                surahNameOrNum = match[2];
            } else {
                surahNameOrNum = match[1];
                ayahNum = match[2];
            }
            break;
        }
    }

    if (!surahNameOrNum || !ayahNum) return prompt;

    // Clean surah name keys
    const cleanSurahKey = surahNameOrNum.trim().replace(/\s+/g, '');

    let surahNumber = 0;

    // Is it a number?
    if (!isNaN(parseInt(cleanSurahKey))) {
        surahNumber = parseInt(cleanSurahKey);
    } else {
        // Lookup map
        surahNumber = surahMap[cleanSurahKey];
    }

    if (!surahNumber || surahNumber < 1 || surahNumber > 114) return prompt;

    console.log(`[QuranService] Detected fetch request: Surah ${surahNumber} Ayah ${ayahNum}`);

    try {
        // Fetch Arabic
        const arbRes = await fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNum}/quran-uthmani`);
        const arbData = await arbRes.json();

        // Fetch Indo Translation
        const idRes = await fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNum}/id.indonesian`);
        const idData = await idRes.json();

        if (arbData.code === 200 && idData.code === 200) {
            const arabicText = arbData.data.text;
            const translation = idData.data.text;

            const additionalContext = `
\n[SYSTEM DATA: REFERENSI VALID AL-QURAN]
Berikut adalah data valid dari Database Al-Quran Kemenag/Cloud untuk Surah ke-${surahNumber} Ayat ${ayahNum}:
Teks Arab: ${arabicText}
Terjemahan: "${translation}"

INSTRUKSI: Gunakan teks Arab dan Terjemahan di atas secara persis dalam jawabanmu. Jangan mengubah satu huruf pun dari teks Arab tersebut.
\n`;
            return prompt + additionalContext;
        }
    } catch (err) {
        console.error("[QuranService] Failed to fetch ayah:", err);
    }

    return prompt;
}
