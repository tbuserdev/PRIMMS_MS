import type { Client } from '@microsoft/microsoft-graph-client';
import { number } from 'zod';

export async function getEvents(client: Client) {
    let result = await client.api('/me/events').get();
    let events = result.value;
    while (result['@odata.nextLink']) {
        result = await client.api(result['@odata.nextLink']).get();
        events = events.concat(result.value);
    }
    return events
}

export async function deleteEvent(client: Client) {
    let events = await getEvents(client);
    let eventsbefore = events.map((events: any) => events.subject);
    let requests = [];
    for (let event of events) {
        requests.push({
            id: event.id,
            method: 'DELETE',
            url: `/me/events/${event.id}`
        });
        if (requests.length === 20) {
            await client.api('$batch').post({ requests });
            requests = [];
        }
    }
    if (requests.length > 0) {
        await client.api('$batch').post({ requests });
    }
    return eventsbefore;
}

export function createEventRequest(name: string, start: string, end: string, requestid: number) {
    return {
        id: requestid.toString(),
        method: 'POST',
        url: '/me/events',
        body: {
            subject: name,
            start: {
                dateTime: start.toString(),
                timezone: 'Europe/Berlin',
            },
            end: {
                dateTime: end.toString(),
                timezone: 'Europe/Berlin',
            },
            isAllDay: true,
            isReminderOn: false,
            showAs: 'free',
        },
        headers: {
            'Content-Type': 'application/json',
        },
    }
}

export async function addEvents(client: Client, data: any, formyear: string) {
    let requests = [];
    let requestid = 0;

    for (const row of data) {
        if (row['Vorname'] != null || row['Name'] != null || row['Geb'] != null, row['Kü'] != null) {
            let name = row['Vorname'] + ' ' + row['Name'] + ' (' + row['Kü'] + ')';

            if (row['Vorname'] != null || row['Vorname'] != '') {

                let year = parseInt(formyear);
                let date_parts = row['Geb'].split('.');
                let month = parseInt(date_parts[1]) - 1;
                let day = parseInt(date_parts[0]);

                let startDate = new Date(year, month, day, 0, 0, 0, 0);
                let endDate = new Date(year, month, day, 0, 0, 0, 0);
                endDate.setDate(endDate.getDate() + 1);

                let start = startDate.toLocaleString('en-US', { timeZone: 'Europe/Berlin' });
                let end = endDate.toLocaleString('en-US', { timeZone: 'Europe/Berlin' });

                requestid = requestid + 1;
                requests.push(createEventRequest(name, start, end, requestid));
                if (requests.length === 20) { // Batch limit is 20 requests
                    await client.api('$batch').post({ requests });
                    requests = [];
                }
            }
        }
    }
    if (requests.length > 0) {
        await client.api('$batch').post({ requests });
    }
}