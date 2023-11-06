import { z } from "zod";

const currentyear = new Date().getFullYear();
const lastyear = currentyear - 1;
const nextyear = currentyear + 1;
const yearlist: readonly [string, string, string] = [lastyear.toString(), currentyear.toString(), nextyear.toString()] as const;

export const birthdayformSchema = z.object({
    content: z.string({ required_error: "Bitte füge die csv Datei ein" }).min(2),
    year: z.enum(yearlist, { required_error: "Bitte spezifiziere ein Jahr" }),
    accessKey: z.string()
});

export type Birthdayform = typeof birthdayformSchema;