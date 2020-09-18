<script>
    import queryString from "query-string";

    let parsed = {};

    if (typeof window !== 'undefined') {
        parsed = queryString.parse(window.location.search);
    }

    import { onMount } from 'svelte';

    let room;

	onMount(async () => {
        var url = `http://localhost:3000/api/join/?id=${parsed.id}`;
		const res = await fetch(url);
        room = await res.json();
        console.log(room);
    });
    
    function selectVar(selected) {
        if (!room.teams[selected]) {
            room.teams[selected] = [];
        }
        room.teams[selected][room.teams[selected].length] = "Толя";
        console.log(room.teams[selected]);
    }
</script>

<svelte:head>
	<title></title>
</svelte:head>

<list>
    {#if room}
        <h1>{room.name}</h1>
        <ol>
        {#each room.teams as _, i}
            <li class={room.group==="true" ? "group" : "individual"} on:click={() => selectVar(i)}>
                {#each room.teams[i] as name}
                    <span class="name">{name}</span>
                {/each}
            </li>
        {/each}
        </ol>
    {:else}
        Loading...
    {/if}
</list>

<style>
    h1 {
        font-weight: 100;
    }

    list {
        text-align: center;
    }

    ol {
        width: 50%;
        margin: auto;
        list-style: none;
        counter-reset: item;
        font-size: larger;
    }

    li {
        text-align: left;
        border-bottom: solid lightblue 1px;
        counter-increment: item;
        padding: 6px;
        margin-bottom: 10px;
    }

    .name {
        background-color: lightcoral;
        border-radius: 8px;
        padding: 3px;
        margin-right: 5px;
    }

    li:before {
        margin-right: 10px;
        content: counter(item);
        border-radius: 100%;
        color: white;
        width: 1.2em;
        text-align: center;
        display: inline-block;
    }

    .individual:before {
        background-color: #2196F3;
    }

    .group:before {
        background-color: #f57323;
    }
</style>