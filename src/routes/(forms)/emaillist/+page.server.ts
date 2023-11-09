import { Client } from '@microsoft/microsoft-graph-client';
import { error } from '@sveltejs/kit';

function createContactRequest( contactData: any, requestid: number, contactFolderId: string) {
    let email = contactData.email.toString();
    let name = contactData.name.toString();

    if (email) {
        let contact = {
            surname: name,
            emailAddresses: [{
                address: email,
                name: name
            }]
        };
        return {
            id: requestid.toString(),
            method: 'POST',
            url: '/me/contactFolders/' + contactFolderId + '/contacts',
            headers: {
                'Content-Type': 'application/json'
            },
            body: contact
        };
    } return null;
}

export const actions = {
    default: async ({ request }) => {
        try {
            const data = await request.formData();
            const contactlistname = data.get('contactlistname')?.toString();
            const contactsjson = data.get('contacts')?.toString();
            const accessKey = data.get('accessKey')?.toString();

            if (!accessKey || !contactsjson) {
                throw error(404, {
                    message: 'Access key is required'
                });
            } 

            const client = Client.init({
                authProvider: async(done) => {
                    done(null, accessKey);
                }
            });

            const contacts = JSON.parse(contactsjson);
            if (!contacts) {
                throw error(404, {
                    message: 'Contacts are required'
                });
            }
            
            const contactFolder = {
                displayName: contactlistname
            };
            const parentFolderId = await client.api('/me/contactFolders').post(contactFolder);

            let requests = [];
            let requestid = 0;

            for (const contactData of contacts) {
                requestid = requestid + 1;
                let contact = createContactRequest(contactData, requestid, parentFolderId.id);
                if (contact) {
                    requests.push(contact);
                }
                if (requests.length === 20) {
                    await client.api('$batch').post({ requests });
                    requests = [];
                };
            };
            if (requests.length > 0) {
                await client.api('$batch').post({ requests });
            };
            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    message: 'Es wurden ' + contacts.length + ' Kontakte hinzugefügt.'
                }
            };
        } catch (err) {
            console.log(err);
            throw error(500, {
                message: 'Internal server error'
            });
        }
    }
};