import { Client } from '@microsoft/microsoft-graph-client';

const accessKeyErrorMessage = 'Der Zugangsschlüssel ist ungültig. Bitte neu einloggen um fortzufahren (siehe Fehlermeldung oben).';

// INTERNAL FUNCTIONS
async function getEvents(client: Client) {
    let result = await client.api('/me/events').get().catch((error: any) => {console.log(error);});
    let events = result.value;
    while (result['@odata.nextLink']) {
        result = await client.api(result['@odata.nextLink']).get().catch((error: any) => {console.log(error);});
        events = events.concat(result.value);
    }
    return events
}

async function deleteEvent(client: Client) {
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
            await client.api('$batch').post({ requests }).catch((error: any) => {console.log(error);})
            requests = [];
        }
    }
    if (requests.length > 0) {
        await client.api('$batch').post({ requests }).catch((error: any) => {console.log(error);})
    }
    return eventsbefore;
}

// SVELTEKIT ACTIONS
export const actions = {
    delete: async ({ request }) => {
        try {
            console.log("- - DELETE ACTION STARTED - -");
            const data = await request.formData();
            const accessKey = data.get('accessKeyDelete')?.toString();

            if (accessKey == null) {
                return { success: false, error: accessKeyErrorMessage };
            }
            
            const client = Client.init({
                authProvider: async (done) => {
                    done(null, accessKey);
                }
            });

            await deleteEvent(client);
            console.log("- - DELETE ACTION ENDED - -");
            return { success: true, message: 'Alle Kalendereinträge wurden erfolgreich gelöscht.'};
        } catch (error: any) {
            const errorMessage = JSON.parse(error.body);
            if (errorMessage.code == "InvalidAuthenticationToken") {
                return { success: false, error: JSON.stringify(error), message: accessKeyErrorMessage };
            }
            return { success: false, error: JSON.stringify(error), message: errorMessage.message };
        }
    },

    create: async ({ request }) => {
        try {
            console.time();
            console.log("- - CREATE ACTION STARTED - -");
            const data = await request.formData();
            const accessKey = data.get('accessKeyCreate')?.toString();
            let csv = data.get('eventArray')?.toString();
            

            let length = 0;

            // ACCESS KEY
            if (accessKey == null || accessKey == "") {
                return { success: false, error: accessKeyErrorMessage, message: accessKeyErrorMessage };
            } 

            const client = Client.init({
                authProvider: async (done) => {
                    done(null, accessKey);
                }
            });

            // CSV
            if (csv == null || csv == "" || csv == undefined) {
                return { success: false,  error: "Keine Daten übergeben.", message: "Keine Daten übergeben.", };
            } else {
                csv = csv.replace(/&quot;/g, '"')
                const csvobj = JSON.parse(csv);
                length = csvobj.length;
                const year = new Date(csvobj[0].start.dateTime).getFullYear();

                let requests = [];
                let requestid = 0;

                for (const row of csvobj) {
                    const eventname: string = row.summary.toString();

                    let startdate: Date = new Date(row.start.dateTime);
                    startdate.setDate(startdate.getDate() + 1);
                    let start: string = startdate.toISOString();
                    start = start.slice(0, -13) + '00:00:00.000Z';

                    let enddate: Date = new Date(row.end.dateTime );
                    enddate.setDate(enddate.getDate() + 1);
                    let end: string = enddate.toISOString();
                    end = end.slice(0, -13) + '00:00:00.000Z';

                    requests.push({
                        id: requestid.toString(),
                        method: 'POST',
                        url: `/me/calendar/events`,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: {
                            subject: eventname,
                            start: {
                                dateTime: start,
                                timeZone: 'Europe/Berlin',
                            },
                            end: {
                                dateTime: end,
                                timeZone: 'Europe/Berlin',
                            },
                            isAllDay: true,
                            isReminderOn: false,
                            showAs: 'free',
                        },
                    });

                    requestid = requestid + 1;
                    if (requests.length === 20) {
                        await client.api('$batch').post({ requests }).catch((error: any) => {console.log(error);});
                        requests = [];
                    }
                };

                if (requests.length > 0) {
                    await client.api('$batch').post({ requests }).catch((error: any) => {console.log(error);});
                    console.log("- - CREATE ACTION ENDED - -");
                    console.timeEnd();
                    return { success: true, message:  length + ' Kalendereinträge wurden erfolgreich in das Jahr ' + year + ' eingefügt.' };
                }
                return { success: false, message:  'Some error in the application occured!' };
            }
        } catch (error: any) {
            console.log(error);
            return { success: false, error: JSON.stringify(error), message: "Unbekannter Fehler"  };
        }
    }
};