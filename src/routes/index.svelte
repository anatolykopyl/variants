<script>
    let groupTask = false;
    let name = "";
    let memberCount = 10;
    
    function createRoom() {
        const url=`${process.env.URL}/api/create/?g=${groupTask}&n=${name}&c=${memberCount}`;
        window.location.href = url;
    }

    let id;
    let invalidId = false;
    let invalidIdMsg = '';

    function connect() {
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
            const url=`${process.env.URL}/room/?id=${id}`;
            window.location.href = url;
        } else if (id === '' || id === undefined) {
            invalidId = true;
            invalidIdMsg = 'Введите код'
        } else {
            invalidId = true;
            invalidIdMsg = 'Неверный формат кода :('
        }
    }

    const plcType = ['Лабораторная работа', 'Лаба', 'Практическая работа', 'Практика', 'Лабораторная', 'Доклад'];
    const plcSubj = ['физике', 'химии', 'философии'];
    const plcName = `${plcType[Math.floor(Math.random()*plcType.length)]} по ${plcSubj[Math.floor(Math.random()*plcSubj.length)]} № ${Math.floor(Math.random()*12)+1}`;
</script>

<svelte:head>
	<title>Study Buddy</title>
</svelte:head>

<greeting>
    <div class="startbtns">
        <div>
            <div class="cardHeader">
                <h2>Создать работу</h2>
            </div>
            <div class="inputs">
                <div class="toggle">
                    По вариантам
                    <label class="switch">
                        <input type="checkbox" bind:checked={groupTask}>
                        <span class="slider round"></span>
                    </label>
                    По бригадам
                </div>
                <div class="inputWrap">
                    Название работы:<br>
                    <input type="text" size="45" placeholder={plcName} bind:value={name}>
                </div>
                <div style="text-align: center;">
                    <input type="number" id="varCount" name="варианты" min="2" max="50" bind:value={memberCount}>
                    {#if groupTask}бригад{:else}вариантов{/if}
                </div>
                <span style="text-align: center;">
                    <input class="btn" type="button" value="Создать" on:click={createRoom}>
                </span>
            </div>
        </div>
        <div>
            <div class="cardHeader">
                <h2>Присоединиться к работе</h2>
            </div>
            <div class="inputs">
                <div class="inputWrap">
                    Код подключения:<br>
                    <input type="text" size="45" placeholder="43d0505c-d695-4323-9140-5d7744ec95e7" bind:value={id}>
                    {#if invalidId}<span class="error-hint">{invalidIdMsg}</span>{/if}
                </div>
                <span style="text-align: center;">
                    <input class="btn" type="button" value="Подключиться" on:click={connect}>
                </span>
            </div>
        </div>
    </div>
</greeting>

<style>
	greeting {
		text-align: center;
	}

    .inputWrap {
        display: table;
    }

    .inputWrap > input {
        display: table-cell; 
        width: 100%;
    }

    .error-hint {
        color: indianred;
    }

    .btn {
        width: 15ch;
    }

    .startbtns {
        display: flex;
        justify-content: space-evenly;
        justify-items: center;
        flex-wrap: wrap;
        margin-top: 18vh;
    }

    .startbtns > div {
        border-radius: 8px;
        box-shadow: lightgrey 0px 5px 20px;
        width: 30vw;
        height: 30vw;
        margin-bottom: 10vw;
    }

    .cardHeader {
        background-color: rgb(240, 240, 240);
        border-radius: 8px 8px 0px 0px;
        width: 100%;
        height: 16%;
        margin-bottom: 2vw;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    h2 {
        margin: 0px;
        font-weight: 100;
    }

    .inputs {
        display: flex;
        height: 70%;
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
        background-color: #3fc53b;
    }

    input:focus + .slider {
        box-shadow: 0 0 1px #3fc53b;
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

    @media only screen and (max-width: 1024px) {
        .startbtns {
            margin-top: 2vh;
        }

        .startbtns > div {
            width: 80vw;
            height: 80vw;
        }
    }

    @media only screen and (max-width: 480px) {
        .startbtns {
            margin-top: 0px;
        }

        .startbtns > div {
            width: 97vw;
            height: 97vw;
        }
    }
</style>
