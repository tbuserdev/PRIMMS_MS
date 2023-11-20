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
	import TokenExpired from '$lib/components/TokenExpired.svelte';

	const sidebarNavItems = [
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
			title: "Abwesenheit",
			href: "/abwesenheit"
		},
	];

	const Nav = [
		{
			title: "Startseite",
			href: "/start"
		}
	]
</script>

<ModeWatcher />
{#if $authStore.auth}
	<div class="space-y-6 p-10 pb-16">

		<!-- NAVBAR -->
		<div class="space-y-0.5 flex justify-between">
			<a href="/start">
				<h2 class="text-2xl font-bold tracking-tight">Primarschule Münchenstein</h2>
				<TokenExpired />
			</a>
			<div class="flex flex-row space-x-4 align-middle">
				<DarkModeToggle/>
				<Button on:click={logout} variant="destructive">Logout</Button>
			</div>
		</div>
		<Separator class="my-6" />
		
		<div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
			<!-- SIDEBAR -->
			<aside class="lg:w-1/5 space-y-4">
				<div class="-mx-4">
					<SidebarNav items={Nav}/>
				</div>
				<Separator/>
				<p class="text-sm text-muted-foreground">Office</p>
				<div class="-mx-4">
					<SidebarNav items={sidebarNavItems}/>
				</div>
				<Separator/>
				<p class="text-sm text-muted-foreground">Formulare</p>
				<div class="-mx-4">
					<SidebarNav items={formNavItems} />
				</div>
			</aside>

			<!-- CONTENT -->
			<div class="flex-1 lg:max-w-2xl">
				<slot />
			</div>
		</div>
	</div>
{:else}
	<AuthForm />
{/if}