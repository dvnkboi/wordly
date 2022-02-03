
//? ce que signifie un mot dans le tableau de mots
interface Word {
    ltr: string,
    isGuessed: boolean,
}

//? fait la regle de trois pour calculer 
export function map(x: number, in_min: number, in_max: number, out_min: number, out_max: number): number {
    return Math.max(Math.min((x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min, out_max), out_min);
}

//? attend ms de temps
export function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//? tableau contenant l'alphabet
export const alpha: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

//? transforme un mot en tableau de mots
export function getWordArray(word: string): Word[] {
    const wordArray: Word[] = [];
    for (const letter of word) {
        wordArray.push({
            ltr: letter,
            isGuessed: letter != " " ? false : true,
        });
    }
    return wordArray;
}

//? tableau contenant les mots
export const words: string[] = [
    "CLOUD COMPUTING",
    "BIG DATA",
    "BUISNESS INTEL",
    "DATABASE",
    "ENSAT",
    "WEBINAIRES",
    "GENIE INFO",
    "COMPUTER SCIENCE",
    "METHODE AGILE",
    "SCRUM",
    "TRELLO",
    "GITHUB",
]
