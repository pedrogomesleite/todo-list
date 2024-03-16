const checkArea = document.getElementById("check-area");
const textInput = document.getElementById("text-input");
const progess = document.querySelector(".progres-bar");
const contText = document.querySelector(".itens");
var tarefaList = [];
var count = 0;


class Tarefa {
    constructor(element, estate, id, text) {
        this.element = element;
        this.estate = estate;
        this.id = id;
        this.text = text;
    }
}

class TarefaD {
    constructor(text, estate, id) {
        this.text = text;
        this.estate = estate;
        this.id = id;
    }
}

function appendTarefa() {
    let text = textInput.value;
    textInput.value = "";
    if(text === "") {
        return;
    }
    let [newAtt, check] = createTarefa(text, count);
    let tarefa = new Tarefa(newAtt, false, count, text);

    check.addEventListener("change", () => {
        tarefa.estate = !tarefa.estate;
        listTarefas();
    });

    count += 1;
    tarefaList.push(tarefa);
    listTarefas();
    textInput.focus();
}

function appendTarefaInit(text, estate, id) {
    let [newAtt, check] = createTarefa(text, id, estate);
    let tarefa = new Tarefa(newAtt, estate, id, text);

    check.addEventListener("change", () => {
        tarefa.estate = !tarefa.estate;
        listTarefas();
    });

    count += 1;
    tarefaList.push(tarefa);
    listTarefas();
}

function createTarefa(text, id, estate = false) {
    let tarefa = document.createElement('div');
    tarefa.className = "tarefa";
    tarefa.style.order = `${id}`;
    let check = document.createElement('input');
    check.type = "checkbox";
    check.id = `check-${id}`;
    check.checked = estate;
    let pa = document.createElement('p');
    pa.innerText = text;
    pa.className = "tarefa-text";
    tarefa.appendChild(check);
    tarefa.appendChild(pa);
    return [tarefa, check];
}

var filter = 2;

function listTarefas() {
    while(checkArea.firstChild) {
        checkArea.removeChild(checkArea.firstChild);
    }
    let completed = 0;
    for (const tarefa of tarefaList) {
        if (filter == 2) {
          checkArea.appendChild(tarefa.element);
        } else if (filter == 0 && tarefa.estate) {
          checkArea.appendChild(tarefa.element);
        } else if (filter == 1 && !tarefa.estate) {
          checkArea.appendChild(tarefa.element);
        }

        if(tarefa.estate) {
            completed += 1;
            tarefa.element.className = "tarefa line";
        }
        else {
            tarefa.element.className = "tarefa";
        }
    }

    contText.innerText = `${tarefaList.length - completed} itens restantes`;

    let porcent = Math.floor((completed / tarefaList.length) * 100);
    porcent = `${porcent? porcent: 0}%`
    progess.style.setProperty("--progress-width", porcent);
}

function changeFilter(v) {
    filter = v;
    const btn1 = document.querySelector(`.btn-${v}`);
    const btn2 = document.querySelector(`.btn-${(v+1)%3}`);
    const btn3 = document.querySelector(`.btn-${(v+2)%3}`);

    btn1.className = `btn-black btn-${v}`;
    btn2.className = `btn btn-${(v+1)%3}`;
    btn3.className = `btn btn-${(v+2)%3}`;
    listTarefas();
}

function cleanList() {
    let newList = [];
    for (let tarefa of tarefaList) {
        if (!tarefa.estate) {
            newList.push(tarefa);
        }
    }
    tarefaList = newList
    listTarefas();
}

window.onload = () => {
    let max = 0;
    console.log(localStorage);
    for (let i = 0; i < localStorage.length; i++) {
        const chave = localStorage.key(i);
        if (chave) {
            valor = localStorage.getItem(chave);
            const tarefa = JSON.parse(valor);
            appendTarefaInit(tarefa.text, tarefa.estate, tarefa.id);
            if(tarefa.id > max){
                max = tarefa.id;
            }
        }
    }
    count = max;
    listTarefas();
};


window.addEventListener('beforeunload', function(event) {
    localStorage.clear();
    for (const tarefa of tarefaList) {
        let localTarefa = new TarefaD(tarefa.text, tarefa.estate, tarefa.id);
        localStorage.setItem(`tarefa_${tarefa.id}`, JSON.stringify(localTarefa));
    }
});

