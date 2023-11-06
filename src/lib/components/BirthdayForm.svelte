<script lang="ts">
    import * as Form from "$lib/components/ui/form";
    import { Label } from "$lib/components/ui/label";

    import { birthdayformSchema, type Birthdayform } from "$lib/schema";
    import type { SuperValidated } from "sveltekit-superforms";
    
    export let form: SuperValidated<Birthdayform>;
    export let accessToken: string;

    const currentyear = new Date().getFullYear();
    const lastyear = currentyear - 1;
    const nextyear = currentyear + 1;
    const yearlist: readonly [string, string, string] = [lastyear.toString(), currentyear.toString(), nextyear.toString()] as const;

    //TODO: Add Checkbox for deletion of old birthdays - verschiedene Jahre in einem Kalender=Löscht alle Geburtstage aus dem Kalender
  </script>

<Form.Root 
    {form}
    schema={birthdayformSchema}
    let:config
    method="POST"
    class="space-y-8">

    <!-- CSV -->
    <Form.Field {config} name="content">
        <Form.Item class="space-y-4">
            <Form.Label>CSV Export</Form.Label>
            <Form.Textarea
            placeholder='"Name";"Vorname";"Kü";"Geb";'  
            class="resize-none"
            />
            <Form.Description>
                Lade das .csv File von SAL herunter und füge den gesamten Inhalt hier ein.
            </Form.Description>
        <Form.Validation />
        </Form.Item>
    </Form.Field>

    <!-- YEAR -->
    <Form.Field {config} name="year">
        <Form.Item class="space-y-3">
            <Form.Label>In welches Jahr sollen die Geburtstage eingefügt werden?</Form.Label>
            <Form.RadioGroup class="flex flex-col space-y-1">
            {#each yearlist as year}
                <Form.Item class="flex items-center space-x-3 space-y-0">
                    <Form.RadioItem value={year} id={year} />
                    <Label for="all" class="font-normal">{year}</Label>
                </Form.Item>
            {/each}
            </Form.RadioGroup>
            <Form.Validation />
        </Form.Item>
    </Form.Field>

    <input type="hidden" name="accessKey" bind:value={accessToken} />
    <Form.Button class="mt-4">Geburtstage eintragen</Form.Button>
</Form.Root>
