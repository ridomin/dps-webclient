<script>
	import {createHmac} from './hmac'
	import {registerDevice} from './dpsClient'
	export let scopeId = '0ne001617A2'
	export let deviceId = 'device' + Date.now()
	export let deviceKey 
	export let masterKey = 'y3bcyTw0qTZ14jcxKNz6tv1Ntp8PdN+SzCa8Nyuaek0aif6iZLldm3kHawb5DTp6BzBlqXPjM1+Hn7GO3UJ7EA=='
	export let modelId = 'dtmi:com:example:Thermostat;1'
	$: deviceKey = createHmac(masterKey, deviceId).then(d => deviceKey = d)
	
	export let dpsPromise
	
	function provision() {
		dpsPromise = registerDevice(scopeId, deviceId, deviceKey, modelId)
	}
</script>

<main>
	<h1>DPS WebClient</h1>

	<p>
		<label for="inputScopeId">Scope Id</label>
		<input type="text" id="inputScopeId" bind:value={scopeId} />
	</p>

	<p>
		<label for="inputDeviceId">DeviceId</label>
		<input type="text" id="inputDeviceId" bind:value={deviceId}>
	</p>
	<p>
		<label for="inputModelId">Model Id</label>
		<input type="text" id="inputModelId" size="55" bind:value={modelId}>
	</p>
	<p>
		<label for="inputDeviceKey">DeviceKey</label>
		<input type="text" id="inputDeviceKey" size="55" bind:value={deviceKey}>
	</p>
	
	<p>
		<label for="inputMasterKey">use MasterKey
			<input type="checkbox" >
		</label>
	
		<input type="text" id="inputMasterKey" size="105" bind:value={masterKey}>
	</p>
	<p class="right">
		<button on:click="{provision}" id="buttonProvision">Provision</button>
	</p>
	{#await dpsPromise}
		<p>.. provisioning device ..</p>
	{:then dpsResult}
		{#if dpsResult}
			<pre>{dpsResult.operationId}</pre>
			<div>
				status: {dpsResult.registrationState.status} to {dpsResult.registrationState.assignedHub}
			</div>
			<div><a target="_new" href="http://mqtt.rido.dev/?HostName={dpsResult.registrationState.assignedHub}&DeviceId={dpsResult.registrationState.deviceId}&SharedAccessKey={deviceKey}&ModelId={modelId}">Simulate {dpsResult.registrationState.deviceId} on {dpsResult.registrationState.assignedHub} </a></div>
		{/if}
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}

</main>

<style>
	main {
		text-align: left;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	label {
		display: inline-block;
		width: 140px;
		text-align: right;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 2em;
		font-weight: 100;
	}

	@media (min-width: 800px) {
		main {
			max-width: none;
		}
	}
</style>