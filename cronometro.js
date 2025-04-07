let timer;
let startTime;
let running = false; // Indica se o cronômetro está ativo

document.addEventListener("DOMContentLoaded", () => {
    const pedidoInput = document.getElementById("pdido-cont");
    const cronometroInput = document.getElementById("cronometro");
    const iniciarButton = document.getElementById("iniciar");
    const salvarButton = document.getElementById("Salvar");

    // Recupera dados do localStorage ao carregar a página
    const storedPedido = localStorage.getItem("pedido");
    const storedStartTime = localStorage.getItem("startTime");

    if (storedPedido && storedStartTime) {
        pedidoInput.value = storedPedido;
        startTime = new Date(parseInt(storedStartTime, 10));
        startTimer(cronometroInput);
        iniciarButton.textContent = "Parar";
        running = true;
        salvarButton.disabled = true; // Desabilita o botão Salvar se o cronômetro estiver ativo
    }

    iniciarButton.addEventListener("click", () => {
        const pedido = pedidoInput.value.trim();
        if (running) {
            // Parar o cronômetro
            clearInterval(timer);
            iniciarButton.textContent = "Iniciar";
            running = false;
            salvarButton.disabled = false; // Habilita o botão Salvar quando parar
        } else {
            // Iniciar o cronômetro
            if (pedido !== "") {
                localStorage.setItem("pedido", pedido);
                startTime = new Date();
                localStorage.setItem("startTime", startTime.getTime());
                startTimer(cronometroInput);
                iniciarButton.textContent = "Parar";
                running = true;
                salvarButton.disabled = true; // Desabilita o botão Salvar quando iniciar
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
                // Simulação de envio de dados
                enviarDadosSimulados(pedido, tempo)
                    .then((sucesso) => {
                        if (sucesso) {
                            cronometroInput.value = "00:00:00";
                            localStorage.removeItem("pedido");
                            localStorage.removeItem("startTime");
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

// Função simulada para envio de dados
function enviarDadosSimulados(pedido, tempo) {  
    return new Promise((resolve) => {
        // Simulando um atraso no envio
        setTimeout(() => {
            console.log("Dados enviados:", { pedido, tempo });
            resolve(true); // Retorna sucesso
        }, 1000);
    });
}

document.querySelector('#cronometro-pedido').addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário

    const form = event.target;
    const formData = new FormData(form); // Captura todos os dados do formulário

    const submitButton = form.querySelector('button[type="submit"]'); // Seleciona o botão de envio

    // Altera o texto do botão para "Enviando dados..."
    const originalButtonText = submitButton.textContent; // Salva o texto original do botão
    submitButton.textContent = "Salvando...";

    try {
        const response = await fetch('Link da planilha do Google sheets', {
            method: 'POST',
            body: formData // Envia os dados diretamente
        });

        if (response.ok) {
            alert('Dados salvos com sucesso!');
            form.reset();
            document.querySelector('.tempoTotal').style.display = "none";
        } else {
            console.error('Erro ao enviar:', response.statusText);
            alert('Erro ao enviar os dados. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro de conexão. Verifique sua internet.');
    } finally {
        // Restaura o texto do botão e habilita novamente
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    }
});
