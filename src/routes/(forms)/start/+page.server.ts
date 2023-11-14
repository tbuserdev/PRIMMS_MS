export const actions = {
    default: async ({ request }) => {
        try {
            const data = await request.formData();
            const vorname = data.get('Vorname')?.toString();
            const nachname = data.get('Nachname')?.toString();
            const personalnummer = data.get('Personalnummer')?.toString();
            const schulhaus = data.get('Schulhaus')?.toString();
            const klasse = data.get('Klasse')?.toString();
            const schultyp = data.get('Schultyp')?.toString();
            const accessKey = data.get('accessKey')?.toString();

            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    vorname: vorname,
                    nachname: nachname,
                    personalnummer: personalnummer,
                    schulhaus: schulhaus,
                    klasse: klasse,
                    schultyp: schultyp
                }
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    error
                }
            };
        }
    }
};