<script>
    let groupTask = false;
    let name = "";
    let memberCount = 10;
    
    function createRoom() {
        const url=`http://localhost:3000/api/create/?g=${groupTask}&n=${name}&c=${memberCount}`;
        window.location.href = url;
    }

    function connect() {
        
    }
</script>

<svelte:head>
	<title>Varian.cc</title>
</svelte:head>

<greeting>
    <h1>varian.cc</h1>
    <div class="startbtns">
        <div>
            <h2>Создать работу</h2>
            <div class="inputs">
                <div class="toggle">
                    По вариантам
                    <label class="switch">
                        <input type="checkbox" bind:checked={groupTask}>
                        <span class="slider round"></span>
                    </label>
                    По бригадам
                </div>
                <div>
                    Количество {#if groupTask}бригад{:else}вариантов{/if}:
                    <input type="number" id="varCount" name="варианты" min="2" max="50" bind:value={memberCount}>
                </div>
                <div>
                    Название работы:<br>
                    <input type="text" size="45" placeholder="Лабораторная работа по физике №3" bind:value={name}>
                </div>
                <input type="button" value="Создать" on:click={createRoom}>
            </div>
        </div>
        <div>
            <h2>Присоедениться к работе</h2>
            <div class="inputs">
                <div>
                    Код подключения:<br>
                    <input type="text" size="45" placeholder="43d0505c-d695-4323-9140-5d7744ec95e7">
                </div>
                <input type="button" value="Подключиться" on:click={connect}>
            </div>
        </div>
    </div>
</greeting>

<style>
	greeting {
		text-align: center;
	}

    .startbtns {
        display: flex;
        justify-content: space-evenly;
        justify-items: center;
    }

    .startbtns > div {
        border-radius: 8px;
        box-shadow: lightgrey 0px 5px 20px;
        width: 30vw;
        height: 30vw;
        padding: 2vw;
    }

    h1 {
        font-size: xx-large;
        font-weight: 100;
        text-transform: uppercase;
    }

    h2 {
        padding-bottom: 1em;
    }

    .inputs {
        display: flex;
        height: 75%;
        margin-left: 5%;
        margin-right: 5%;
        flex-direction: column;
        justify-content: space-between;
        text-align: left;
    }

    .toggle {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .switch {
        margin-left: 10px;
        margin-right: 10px;
        position: relative;
        display: inline-block;
        width: 60px;
        height: 34px;
    }

    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #2196F3;
        -webkit-transition: .4s;
        transition: .4s;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
    }

    input:checked + .slider {
        background-color: #f57323;
    }

    input:focus + .slider {
        box-shadow: 0 0 1px #f57323;
    }

    input:checked + .slider:before {
        -webkit-transform: translateX(26px);
        -ms-transform: translateX(26px);
        transform: translateX(26px);
    }

    /* Rounded sliders */
    .slider.round {
        border-radius: 34px;
    }

    .slider.round:before {
        border-radius: 50%;
    }
</style>
