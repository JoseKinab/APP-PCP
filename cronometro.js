let timer;
let startTime;
let running = false; // Indica se o cronômetro está ativo

document.addEventListener("DOMContentLoaded", function () {
    // Captura os elementos dos inputs dos dois formulários
    const pedidoOrigem = document.getElementById("pdido-cont");
    const quantidadeOrigem = document.getElementById("quantidade");
    const pedidoDestino = document.getElementById("pedido");
    const quantidadeDestino = document.getElementById("caixas");
    const linhaOrigem = document.getElementById("Linha"); // Novo input
    const linhaDestino = document.getElementById("linha"); // Input de destino
    const salvarButton = document.getElementById("Salvar");

    // Recupera os valores do localStorage ao carregar a página
    pedidoOrigem.value = localStorage.getItem("pedido") || "";
    quantidadeOrigem.value = localStorage.getItem("quantidade") || "";
    pedidoDestino.value = localStorage.getItem("pedido") || "";
    quantidadeDestino.value = localStorage.getItem("quantidade") || "";
    linhaOrigem.value = localStorage.getItem("linha") || ""; // Recupera Linha
    linhaDestino.value = linhaOrigem.value;

    // Adiciona eventos para copiar os valores e armazená-los
    pedidoOrigem.addEventListener("input", function () {
        pedidoDestino.value = pedidoOrigem.value;
        localStorage.setItem("pedido", pedidoOrigem.value);
    });

    quantidadeOrigem.addEventListener("input", function () {
        quantidadeDestino.value = quantidadeOrigem.value;
        localStorage.setItem("quantidade", quantidadeOrigem.value);
    });

    linhaOrigem.addEventListener("input", function () { // Copia valor do input Linha
        linhaDestino.value = linhaOrigem.value;
        localStorage.setItem("linha", linhaOrigem.value);
    });

    // Remove o valor do localStorage ao salvar o formulário
    salvarButton.addEventListener("click", () => {
        localStorage.removeItem("linha");
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const pedidoInput = document.getElementById("pdido-cont");
    const cronometroInput = document.getElementById("cronometro");
    const iniciarButton = document.getElementById("iniciar");
    const salvarButton = document.getElementById("Salvar");
    const quantidadeInput = document.getElementById("quantidade");
    const quilosInput = document.getElementById("quilos");

    // Recupera dados do localStorage ao carregar a página
    const storedPedido = localStorage.getItem("pedido");
    const storedStartTime = localStorage.getItem("startTime");
    const storedCesta = localStorage.getItem("tipoDeCesta");
    const storedQuantidade = localStorage.getItem("quantidade");
    const storedQuilos = localStorage.getItem("quilos");

    if (storedPedido && storedStartTime) {
        pedidoInput.value = storedPedido;
        startTime = new Date(parseInt(storedStartTime, 10));
        startTimer(cronometroInput);
        iniciarButton.textContent = "Parar";
        running = true;
        salvarButton.disabled = true; // Desabilita o botão Salvar se o cronômetro estiver ativo
    }

    if (storedQuantidade) {
        quantidadeInput.value = storedQuantidade;
    }

    if (storedQuilos) {
        quilosInput.value = storedQuilos;
    }

    if (storedCesta) {
        const selectedRadio = document.querySelector(`input[name="Cesta"][value="${storedCesta}"]`);
        if (selectedRadio) {
            selectedRadio.checked = true;
        }
    }

    iniciarButton.addEventListener("click", () => {
        const pedido = pedidoInput.value.trim();
        if (running) {
            clearInterval(timer);
            iniciarButton.textContent = "Iniciar";
            running = false;
            salvarButton.disabled = false;
        } else {
            if (pedido !== "") {
                localStorage.setItem("pedido", pedido);
                startTime = new Date();
                localStorage.setItem("startTime", startTime.getTime());
                startTimer(cronometroInput);
                iniciarButton.textContent = "Parar";
                running = true;
                salvarButton.disabled = true;
            } else {
                alert("Por favor, insira o número do pedido.");
            }
        }
    });

    salvarButton.addEventListener("click", () => {
        if (!running) {
            const pedido = pedidoInput.value.trim();
            const tempo = cronometroInput.value;

            if (pedido && tempo) {
                enviarDadosSimulados(pedido, tempo)
                    .then((sucesso) => {
                        if (sucesso) {
                            cronometroInput.value = "00:00:00";
                            localStorage.removeItem("pedido");
                            localStorage.removeItem("startTime");
                            localStorage.removeItem("quantidade");
                            localStorage.removeItem("quilos");
                        } else {
                            alert("Erro ao enviar os dados. Tente novamente.");
                        }
                    })
                    .catch(() => {
                        alert("Erro de conexão. Verifique sua internet.");
                    });
            } else {
                alert("Não há dados para salvar.");
            }
        } else {
            alert("Pare o cronômetro antes de salvar.");
        }
    });

    document.querySelectorAll('input[name="Cesta"]').forEach(input => {
        input.addEventListener('change', (event) => {
            localStorage.setItem('tipoDeCesta', event.target.value);
        });
    });

    quantidadeInput.addEventListener("change", (event) => {
        localStorage.setItem("quantidade", event.target.value);
    });

    quilosInput.addEventListener("change", (event) => {
        localStorage.setItem("quilos", event.target.value);
    });
});

function startTimer(cronometroInput) {
    clearInterval(timer);
    timer = setInterval(() => {
        const now = new Date();
        const elapsedTime = Math.floor((now - startTime) / 1000);
        const hours = String(Math.floor(elapsedTime / 3600)).padStart(2, "0");
        const minutes = String(Math.floor((elapsedTime % 3600) / 60)).padStart(2, "0");
        const seconds = String(elapsedTime % 60).padStart(2, "0");
        cronometroInput.value = `${hours}:${minutes}:${seconds}`;
    }, 1000);
}

function enviarDadosSimulados(pedido, tempo) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Dados enviados:", { pedido, tempo });
            resolve(true);
        }, 1000);
    });
}

document.querySelector('#cronometro-pedido').addEventListener('submit', async (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = "Salvando...";

    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbzUgIDTfuD7EwmL-kXp5LsPN5dhDgi8M1dCqbljgZRZJUweVjVxg1RNN2o-gOfa4zi2/exec', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Dados salvos com sucesso!');
            form.reset();
            localStorage.removeItem("quantidade");
            localStorage.removeItem("quilos");
        } else {
            alert('Erro ao enviar os dados. Tente novamente.');
        }
    } catch (error) {
        alert('Erro de conexão. Verifique sua internet.');
    } finally {
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    }
});