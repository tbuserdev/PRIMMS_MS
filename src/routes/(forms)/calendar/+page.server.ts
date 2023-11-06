import { superValidate } from "sveltekit-superforms/server";
import { fail } from "@sveltejs/kit";
import { birthdayformSchema } from "$lib/schema";
import Papa from 'papaparse';
import { Client } from '@microsoft/microsoft-graph-client';
import { getEvents, deleteEvent, addEvents } from '$lib/msgraph_calendar';

function csvToJS(csv: string) {
    const parsed_csv = Papa.parse(csv, { header: true });

    const headers = parsed_csv.meta.fields;
    if (headers != null) {
        const required = ['Vorname', 'Name', 'Geb'];
        const missing = required.filter(r => !headers.includes(r));
        if (missing.length > 0) {
            return null;
        } else {
            return parsed_csv.data;
        }
    } else {
        return null;
    }
}

export const load = () => {
    return {
        form: superValidate(birthdayformSchema),
        eventsbefore: [],
        eventsafter: []
    };
};

export const actions = {
    default: async (event) => {
        try {
            const form = await superValidate(event, birthdayformSchema);

            if (!form.valid) {
                return fail(400, form);
            }

            const csv = form.data.content;
            const year = form.data.year;
            const accessKey = form.data.accessKey;
            const data = csvToJS(csv.toString());

            const client = Client.init({
                authProvider: async (done) => {
                    done(null, accessKey);
                }
            });

            const eventsbefore = await deleteEvent(client);
            await addEvents(client, data, year);
            const events = await getEvents(client);
            const eventsafter = events.map((event: any) => event.subject);

            console.log("Events before: ", eventsbefore);
            console.log("Events after: ", eventsafter);

            return {
                form: form,
                eventsbefore: eventsbefore,
                eventsafter: eventsafter
            };
        } catch (error) {
            console.log(error);
            return fail(500, error as Record<string, unknown>);
        }
    }
};