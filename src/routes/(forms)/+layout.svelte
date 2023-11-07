<script>
	import "../../app.postcss";

	import { Separator } from "$lib/components/ui/separator";
	import { ModeWatcher } from "mode-watcher";
	import { authStore } from "$lib/authStore";
	import { logout } from "$lib/msal";

	import SidebarNav from "$lib/components/SidebarNav.svelte";
	import DarkModeToggle from "$lib/components/DarkModeToggle.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
	import AuthForm from "$lib/components/AuthForm.svelte";

	// TODO: Add Avatar with name and email, account Information, etc.

	const sidebarNavItems = [
		{
			title: "Dashboard",
			href: "/dashboard"
		},
		{
			title: "Kalendertermine einfügen",
			href: "/calendar"
		},
		{
			title: "E-Mail Verteilerlisten",
			href: "/emaillist"
		},
	];

	const formNavItems= [
		{
			title: "Formular Jahresarbeitszeit",
			href: "/error"
		},
		{
			title: "Formular Abwesenheit",
			href: "/error"
		},
	];
</script>

<ModeWatcher />
<div class="h-screen">
	{#if $authStore.auth}
		<div class="hidden space-y-6 p-10 pb-16 md:block">
			<div class="space-y-0.5 flex justify-between">
				<div>
					<h2 class="text-2xl font-bold tracking-tight">Primarschule Münchenstein</h2>
					<p class="text-muted-foreground">Verwalte verschiedene Aspekte deines Accounts und fülle Formulare aus</p>
				</div>
				<div class="flex flex-row space-x-4 align-middle">
					<DarkModeToggle/>
					<Button on:click={logout} variant="destructive">Logout</Button>
				</div>
			</div>
			<Separator class="my-6" />
			<div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
				<aside class="-mx-4 lg:w-1/5">
					<SidebarNav items={sidebarNavItems}/>
					<SidebarNav items={formNavItems} />
				</aside>
				<div class="flex-1 lg:max-w-2xl">
					<slot />
				</div>
			</div>
		</div>
	{:else}
		<AuthForm />
	{/if}
</div>
