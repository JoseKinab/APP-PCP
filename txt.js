let infoTempo = document.querySelector(".tempoTotal");

// Função para salvar os dados do formulário no Local Storage
function saveFormData() {
    const form = document.querySelector('.myForm');
    const formData = {
        linha: document.getElementById('linha').value,
        data: document.getElementById('data').value,
        pedido: document.getElementById('pedido').value,
        caixas: document.getElementById('caixas').value,
        inicio: document.getElementById('inicio').value,
        final: document.getElementById('final').value,
        justificativa: document.getElementById('justificativa').value
    };
    localStorage.setItem('formData', JSON.stringify(formData));
}

// Função para carregar os dados do Local Storage
function loadFormData() {
    const savedData = localStorage.getItem('formData');
    if (savedData) {
        const formData = JSON.parse(savedData);
        document.getElementById('linha').value = formData.linha || '';
        document.getElementById('data').value = formData.data || '';
        document.getElementById('pedido').value = formData.pedido || '';
        document.getElementById('caixas').value = formData.caixas || '';
        document.getElementById('inicio').value = formData.inicio || '';
        document.getElementById('final').value = formData.final || '';
        document.getElementById('justificativa').value = formData.justificativa || 'Parada linha';
        
        // Se houver tempo final, recalcula o tempo ocioso
        if (formData.final && formData.inicio) {
            const [horaInicio, minutoInicio] = formData.inicio.split(':').map(Number);
            const [horaFinal, minutoFinal] = formData.final.split(':').map(Number);

            const tempoInicioMinutos = horaInicio * 60 + minutoInicio;
            const tempoFinalMinutos = horaFinal * 60 + minutoFinal;
            const tempoTotalMinutos = tempoFinalMinutos - tempoInicioMinutos;

            const horas = Math.floor(tempoTotalMinutos / 60);
            const minutos = tempoTotalMinutos % 60;

            infoTempo.style.display = "block";
            const resultado = `Tempo ocioso\n ${horas} hora(s) e ${minutos} minuto(s).`;
            document.getElementById('tempo-ocioso').value = resultado;
        }
    }
}

// Carrega os dados salvos quando a página é carregada
document.addEventListener('DOMContentLoaded', loadFormData);

// Adiciona listeners para salvar os dados quando houver mudanças
document.getElementById('linha').addEventListener('input', saveFormData);
document.getElementById('data').addEventListener('input', saveFormData);
document.getElementById('pedido').addEventListener('input', saveFormData);
document.getElementById('caixas').addEventListener('input', saveFormData);
document.getElementById('inicio').addEventListener('input', saveFormData);
document.getElementById('justificativa').addEventListener('change', saveFormData);

// Função para calcular o tempo ocioso (modificada para salvar dados)
document.getElementById('final').addEventListener('input', function() {
    const inicio = document.getElementById('inicio').value;
    const final = this.value;

    if (inicio && final) {
        const [horaInicio, minutoInicio] = inicio.split(':').map(Number);
        const [horaFinal, minutoFinal] = final.split(':').map(Number);

        const tempoInicioMinutos = horaInicio * 60 + minutoInicio;
        const tempoFinalMinutos = horaFinal * 60 + minutoFinal;
        const tempoTotalMinutos = tempoFinalMinutos - tempoInicioMinutos;

        const horas = Math.floor(tempoTotalMinutos / 60);
        const minutos = tempoTotalMinutos % 60;

        infoTempo.style.display = "block";
        const resultado = `Tempo ocioso\n ${horas} hora(s) e ${minutos} minuto(s).`;
        document.getElementById('tempo-ocioso').value = resultado;
    } else {
        infoTempo.style.display = "none";
        document.getElementById('tempo-ocioso').value = "";
    }
    
    // Salva os dados após calcular o tempo
    saveFormData();
});

// Função para enviar os dados do formulário (modificada para limpar Local Storage)
document.querySelector('.myForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const justificativaSelect = document.getElementById('justificativa');
    const justificativaValue = justificativaSelect.options[justificativaSelect.selectedIndex].value;
    formData.set('justificativa', justificativaValue);

    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = "Enviando dados...";

    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbxFsEy4WKaWjfUrJ15bq9Jb7kNvTBQcq6ldbw-4OfEywIMrVoKipTgzvqdgnGMjL_XD/exec', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Dados enviados com sucesso!');
            form.reset();
            document.querySelector('.tempoTotal').style.display = "none";
            // Limpa o Local Storage após envio bem-sucedido
            localStorage.removeItem('formData');
        } else {
            console.error('Erro ao enviar:', response.statusText);
            alert('Erro ao enviar os dados. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro de conexão. Verifique sua internet.');
    } finally {
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    }
});



