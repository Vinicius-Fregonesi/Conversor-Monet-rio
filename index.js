const listaMoedas = document.querySelectorAll('.itemMoney');
let moedaConverter;
let invertido=false;
// Itera sobre cada item da lista e adiciona um evento de clique
listaMoedas.forEach(item => {
    item.addEventListener('click', () => {
        // Ação a ser realizada quando um item for clicado
        document.getElementById('botaoMoeda').innerText = item.innerText;
        moedaConverter = item.innerText; // Define a moeda para a variável moedaConverter
        resposta();
        document.getElementById('lblMoeda').innerHTML="Reais:";
        switch(moedaConverter){
          case 'USD-BRL':
            document.getElementById('lblReal').innerHTML="Dolares:";
            break;
          case 'EUR-BRL':
              document.getElementById('lblReal').innerHTML="Euros:";
              break;
          case 'BTC-BRL':
                document.getElementById('lblReal').innerHTML="BitCoins:";
                break;
            
        }
    });
});


let moedaEstrangeira;

const resposta = async () => {
    // Define a URL da API com base na moeda selecionada
    var baseUrl = `https://economia.awesomeapi.com.br/last/${moedaConverter}`;

    try {
        const res = await fetch(baseUrl);
        const resposta_json = await res.json();
        console.log(resposta_json);
        moedaConverter=moedaConverter.replace('-','');
        const precoDolarEmReais = resposta_json[moedaConverter]['ask'];
        document.getElementById('iptMoeda').value = parseFloat(precoDolarEmReais).toFixed(2);
        moedaEstrangeira = precoDolarEmReais;
        document.getElementById('iptReal').value=1;
    } catch (error) {
        console.error("Erro em requisição:", error);
    }
}

let real = document.getElementById('iptReal');
real.addEventListener('change', (e) => {
    document.getElementById('iptMoeda').value = parseFloat(moedaEstrangeira * document.getElementById('iptReal').value).toFixed(2);
});

document.getElementById('btnInverter').addEventListener('click',(e)=>{
    invertido= !(invertido);
    document.getElementById('iptReal').value= parseFloat(moedaEstrangeira).toFixed(2);
    document.getElementById('iptMoeda').value/=parseFloat(moedaEstrangeira).toFixed(2);
    document.getElementById('lblMoeda').innerHTML=document.getElementById('lblReal').innerHTML;
    document.getElementById('lblReal').innerHTML="Reais"; 
    real.addEventListener('change', (e) => {
    document.getElementById('iptMoeda').value = parseFloat(document.getElementById('iptReal').value/moedaEstrangeira).toFixed(2);
});
if(invertido==false){
    location.reload();
}
})
