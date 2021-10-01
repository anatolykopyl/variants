<script>
    import queryString from "query-string";

    let parsed = {};

    if (typeof window !== 'undefined') {
        parsed = queryString.parse(window.location.search);
    }

    import { onMount } from 'svelte';

    let room;
    let res;
    async function getRoom() {
        var url = `${process.env.URL}/api/join/?id=${parsed.id}`;
		res = await fetch(url);
        room = await res.json();
    }

    onMount(async () => getRoom());

    String.prototype.toColor = function() {
        var colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
                    '#3366E6', '#99FF99', '#B34D4D', '#80B300', '#E6B3B3', 
                    '#6680B3', '#66991A', '#FF99E6', '#CCFF1A', '#FF1A66',
                    '#E6331A', '#33FFCC', '#B366CC', '#CC80CC', '#991AFF',
                    '#E666FF', '#4DB3FF', '#1AB399', '#E666B3', '#CC9999',
                    '#B3B31A', '#00E680', '#E6FF80', '#1AFF33', '#FF3380',
                    '#CCCC00', '#66E64D', '#4D80CC', '#E64D66', '#4DB380',
                    '#FF4D4D', '#99E6E6', '#6666FF'];
        
        var hash = 0;
        if (this.length === 0) return hash;
        for (var i = 0; i < this.length; i++) {
            hash = this.charCodeAt(i) + ((hash << 5) - hash);
            hash = hash & hash;
        }
        hash = ((hash % colors.length) + colors.length) % colors.length;
        return colors[hash];
    }

    let nameInput = [];
    let enabledInput;
    
    function selectVar(selected, event) {
        if (!event || event && event.keyCode === 13) {
            if (!room.teams[selected]) {
                room.teams[selected] = [];
            }
            if (nameInput[selected] !== "" && nameInput[selected] !== undefined) {
                room.teams[selected][room.teams[selected].length] = nameInput[selected];
                //room.teams[selected].push(nameInput[selected]);
                var url = `${process.env.URL}/api/select/?id=${parsed.id}&name=${nameInput[selected]}&team=${selected}`;
                fetch(url);
                nameInput[selected] = "";
            }
        }
    }

    function selectInput(selected) {
        enabledInput = selected;
    }

    let highlightedTeam, highlightedName;
    function highlightName(name, i) {
        if (i === highlightedTeam && name === highlightedName) {
            highlightedTeam = undefined;
            highlightedName = undefined;
        } else {
            highlightedTeam = i;
            highlightedName = name;
        }
    }

    function removeName() {
        room.teams[highlightedTeam] = room.teams[highlightedTeam].filter(n => n !== highlightedName);
        var url = `${process.env.URL}/api/delete/?id=${parsed.id}&name=${highlightedName}&team=${highlightedTeam}`;
        fetch(url);
    }
</script>

<svelte:head>
    <meta property="og:title" content={room && room.name ? room.name : 'Study Buddy'}>
	<title>{room && room.name ? room.name : 'Study Buddy'}</title>
</svelte:head>

<list>
    {#if room}
        <div class="exit"><a href={process.env.URL}>Вернуться на главную</a></div>
        <h1>{room.name}</h1>
        <p class="subtext">По {room.group == "true" ? "бригадам" : "вариантам"}</p>
        <ol>
        {#each room.teams as _, i}
            <li class={room.group === "true" ? "group" : "individual"} on:click={() => selectInput(i)} style="border-color: {enabledInput==i ? 'gray' : 'lightgray'}">
                {#each room.teams[i] as name}
                    <span class="name" style="background-color: {name.toColor()}">
                        <span on:click={() => highlightName(name, i)}>{name}</span>
                        {#if (i === highlightedTeam && name === highlightedName)}
                            <span class="deleteName" on:click={removeName}>×</span>
                        {/if}
                    </span>
                {/each}
                {#if room.teams[i].length == 0 || room.group == "true"}
                    <input class="addName" type="button" value="+" on:click={() => selectVar(i)}>
                    <input class="nameInput" type="text" bind:value={nameInput[i]} on:keyup={(event) => selectVar(i, event)}>
                {/if}
            </li>
        {/each}
        </ol>

        <span class="footer">
            Код подключения: <code>{parsed.id}</code>
            <a href="https://github.com/anatolykopyl/variants">
                <img src="/github.png" alt="github" class="githubLink">
            </a>
        </span>
    {:else if res==undefined}
        <div class="status">Загрузка...</div>
    {:else if res.status==404}
        <div class="status">
            <h1>404</h1>
            Такой комнаты не существует :(<br>
            <a href={process.env.URL}>Вернуться на главную</a>
        </div>
    {/if}
</list>

<style>
    h1 {
        font-weight: 100;
        margin-bottom: 0px;
    }

    .exit {
        height: 0px;
        width: 100%;
        text-align: left;
        font-size: small;
        cursor: pointer;
    }

    .subtext {
        font-size: x-small;
        margin-bottom: 50px;
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
        padding-bottom: 100px;
    }

    li {
        text-align: left;
        border-bottom: solid lightgray 1px;
        counter-increment: item;
        padding: 0px;
        height: 2em;
        margin-bottom: 10px;
        white-space: nowrap;
    }

    .name {
        border-radius: 5px;
        padding: 3px 8px 3px 8px;
        margin: 0px 0px 0px 15px;
        user-select: none;
        cursor: pointer;
    }

    .nameInput {
        background-color: transparent;
        margin: 0px;
        padding: 0px;
        border: none;
        height: 2em;
        width: 100%;
    }

    .nameInput:focus {
        outline: none;
    }

    .addName {
        width: 1.2em;
        height: 1.2em;
        border-radius: 100%;
        background-color: yellowgreen;
        border: none;
        padding: 0px;
        text-align: center;
        margin-right: 15px;
        margin-left: 15px;
        cursor: pointer;
    }

    .deleteName {
        display: inline-block;
        margin-left: 6px;
        transition-duration: 0.3s;
        transition-property: transform;
    }

    .deleteName:hover {
        transform: scale(1.2);
    }

    li:before {
        margin-top: 8px;
        margin-right: 10px;
        content: counter(item);
        border-radius: 100%;
        width: 1.2em;
        text-align: center;
        display: inline-block;
    }

    .status {
        width: 100%;
        text-align: center;
        margin-top: 250px;
    }

    .status > h1 {
        font-size: 128px;
        font-weight: bold;
    }

    .footer > a {
        margin-left: 16px;
    }

    .githubLink {
        width: 24px;
        height: 24px;
        vertical-align: middle;
    }

    @media only screen and (max-width: 1024px) {
        ol {
            width: 100%;
            margin: 0 0 50px 0;
            padding: 0 0 50px 0;
        }
    }
</style>