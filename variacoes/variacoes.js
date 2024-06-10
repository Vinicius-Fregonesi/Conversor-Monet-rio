document.addEventListener('DOMContentLoaded', function() {
    const listaCategorias = document.querySelectorAll('.itemCategoria');
    const listaMoney= document.querySelectorAll('.itemMoney');
    let tipoGrafico;
    let moedaBuscar;
    let numeroDias;
    function convertToCSV(jsonData) {
        const array = typeof jsonData != 'object' ? JSON.parse(jsonData) : jsonData;
        let csv = '';
      
        // Adicionando os cabeçalhos das colunas
        const headers = Object.keys(array[0]);
        csv += headers.join(',') + '\r\n';
      
        // Adicionando os dados
        for (let i = 0; i < array.length; i++) {
          const row = [];
          for (const header of headers) {
            // Se a chave existir, adiciona o valor correspondente, senão, adiciona uma string vazia
            row.push(array[i][header] || '');
          }
          csv += row.join(',') + '\r\n';
        }
        return csv;
      }
            
    async function downloadCSV(csvData, fileName) {
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', fileName);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    listaCategorias.forEach(item => {
        item.addEventListener('click', () => {
            tipoGrafico = item.innerHTML;
            document.getElementById('botaoCategoria').innerHTML= item.innerHTML;
        });
    });
    listaMoney.forEach(item=>{
        item.addEventListener('click', ()=>{
            moedaBuscar= item.innerHTML;
            document.getElementById('botaoMoeda').innerHTML= item.innerHTML;
        })
    })
    document.getElementById('btnGerar').addEventListener('click', ()=>{
        switch(tipoGrafico){
            case 'Compra':  
                tipoGrafico= "bid";
                break;
            case 'Venda':
                tipoGrafico= "ask";
                break;
            case 'Variação':
                tipoGrafico= "varBid";
                break;
            case 'Porcentagem de Variação':
                tipoGrafico= "pctChange";
                break;
            case 'Porcentagem de Variação':
                tipoGrafico= "pctChange";
                break;
            case 'Máximo':
                tipoGrafico="high";
                break;
            case 'Mínimo':
                tipoGrafico="low";
                break;
            default:
                alert("Nenhuma categoria selecionada");
        }
        numeroDias= document.getElementById('btnDias').value;
        initChart();
    })
    const request = async () => {
        try{
            var URL= `https://economia.awesomeapi.com.br/json/daily/${moedaBuscar}/${numeroDias}`
            const resp= await fetch(URL);
            const respJson=await resp.json();
            return respJson;
        }catch (exception) {
            throw new Error("Não foi possível fazer a requisição");
        }
    }
    const resposta= async()=>{
        try{
            let response= await request();
            if (response && response.length > 0) { 
                return response;
            } else{
                return null;
            }
        }catch(exception){
            return null;
        }
    }
    async function criarGrafico() {
        let respostapronta = await resposta(); // Chama a função e espera pela resposta
        const csvData = await convertToCSV(respostapronta);
        const fileName = `${document.getElementById('botaoCategoria').innerHTML}.csv`;
        await downloadCSV(csvData, fileName);
        if (respostapronta) {
            const valoresTratados = respostapronta.map(element => element[tipoGrafico]); // Extrai os valores de 'low' de cada elemento
            const labels = [];
            for (let i = 0; i < respostapronta.length; i++) {
                // Cria datas baseadas na quantidade de dias e adiciona ao array de labels
                labels.push(new Date(new Date().getTime() - (i * 24 * 60 * 60 * 1000)).toLocaleDateString());
            }
            labels.reverse();
            valoresTratados.reverse();
            return {
                labels: labels,
                datasets: [{
                    label: `Valores de ${document.getElementById('botaoCategoria').innerHTML} nos últimos ${respostapronta.length} dias`,
                    data: valoresTratados,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)', // Cor de preenchimento do gráfico
                    borderColor: 'rgba(255, 99, 132, 1)', // Cor da borda do gráfico
                    borderWidth: 1
                }]
            };
        } else {
            console.error("Resposta inválida ou erro durante a requisição.");
            return null;
        }
    }
    async function initChart() {
        const data = await criarGrafico(); // Espera a criação dos dados do gráfico
        if (data) {
            const options = {
                scales: {
                    x: {
                        grid: {
                          color: 'green',
                          borderColor: 'grey',
                          tickColor: 'grey'
                        }
                    }
            }
        };
            const ctx = document.getElementById('myChart').getContext('2d');
            const myChart = new Chart(ctx, {
                type: 'line', // Tipo de gráfico
                data: data, // Dados do gráfico
                options: options // Opções do gráfico
            });
        }
    }
});



