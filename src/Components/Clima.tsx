import React, { useState } from "react";
import axios from "axios";
import css from "./Clima.module.css";

interface WeatherResponse { //Criando os caminhos da API, utilizando o interface
     location: {
          name: string; 
          country: string; 
          localtime: string; 
     };

     current: {
          temp_c: number; 
          humidity: number; 
          wind_kph: number; 
          feelslike_c: number; 
          last_updated: string; 

          condition: {
               text: string; 
               icon: string; 
          };
     };
}

interface Clima7dias {
     datetime: string;
     temp: number;
     max_temp: number;
     min_temp: number;
     wind_spd: number;
     rh: number;
     
     weather: {
          description: string;
          icon: string;
     }
}

interface ResponseClima {
     data: Clima7dias[];
}

export function Clima() {
     const [cidade, setCidade] = useState("");
     const [nomeCidade, setNomeCidade] = useState("");
     const [temperatura, setTemperatura] = useState <number | null>(null);
     const [icone, setIcone] = useState("");
     const [sensacaoTermica, setSensacaoTermica] = useState <number | null>(null); 
     const [descricao, setDescricao] = useState("");
     const [horaData, setHoraData] = useState("");
     const [pais, setPais] = useState("");
     const [ventoPorHora, setVentoPorHora] = useState <number | null>(null);
     const [umidade, setUmidade] = useState <number | null>(null);
     const [ultimaAtualizacao, setUltimaAtualizacao] = useState("");
     const [erro, setErro] = useState("");

     const [dataClima, setDataClima] = useState("");
     const [temperaturaClima, setTemperaturaClima] = useState<number | null>(null);
     const [temperaturaMaxima, setTemperaturaMaxima] = useState<number | null>(null);
     const [temperaturaMinima, setTemperaturaMinima] = useState<number | null>(null);
     const [velocidadeVento, setVelocidadeVento] = useState<number | null>(null);
     const [umidadeAr, setUmidadeAr] = useState<number | null>(null);
     const [descricaoClima, setDescricaoClima] = useState("");
     const [iconeClima, setIconeClima] = useState("");
     const [previsoes, setPrevisoes] = useState<Clima7dias[]>([]);
     const [erroClima, setErroClima] = useState("");
     const { bg, text, dadosClima } = tema_fundo(descricao);

     async function get_clima() { //Criando uma função assíncrona para consumir a API via GET
          if (!cidade) { //Verificando se o usuário digitou uma cidade não existente
               return;
          }

          try {
               const api_key = "6e59ace25c0a4dfebac162548252907"; //Chace da API
               const url = `https://api.weatherapi.com/v1/current.json?key=${api_key}&q=${cidade}&lang=pt`; //URL da API

               const response = await axios.get<WeatherResponse>(url); //Adicionando a URL da API para realizar as buscas dos campos

               //Buscando e mostrando os dados pro usuário
               setTemperatura(response.data.current.temp_c);
               setNomeCidade(response.data.location.name);
               setIcone(response.data.current.condition.icon);
               setSensacaoTermica(response.data.current.feelslike_c);
               setDescricao(response.data.current.condition.text);
               setHoraData(response.data.location.localtime);
               setPais(response.data.location.country);
               setUmidade(response.data.current.humidity);
               setVentoPorHora(response.data.current.wind_kph);
               setUltimaAtualizacao(response.data.current.last_updated);
               setErro("");
          }
          catch { //Caso a cidade não seja encontrada
               setErro("Cidade não encontrada.");
               setTemperatura(null);
               setNomeCidade("");
               setIcone("");
               setSensacaoTermica(null);
               setDescricao("");
               setHoraData("");
               setPais("");
               setUmidade(null);
               setVentoPorHora(null);
               setUltimaAtualizacao("");
          }
     }

     async function get_clima_em_sete_dias() {
          const api_key = "fe3c0fab6c4242fdab879f0d7cc14d0f";
          const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${cidade}&key=${api_key}&lang=pt&days=7`;

          try {
               const response = await axios.get<ResponseClima>(url);

               const dias = response.data.data[0];

               setDataClima(dias.datetime);
               setPrevisoes(response.data.data);
               setTemperaturaClima(dias.temp);
               setTemperaturaMaxima(dias.max_temp);
               setTemperaturaMinima(dias.min_temp);
               setVelocidadeVento(dias.wind_spd);
               setUmidadeAr(dias.rh);
               setDescricaoClima(dias.weather.description);
               setIconeClima(dias.weather.icon);
               setErroClima("");
          }
          catch {
               setErroClima("Não foi possível obter o clima em 7 dias.");
               setDataClima("");
               setTemperaturaClima(null);
               setTemperaturaMaxima(null);
               setTemperaturaMinima(null);
               setVelocidadeVento(null);
               setUmidadeAr(null);
               setDescricaoClima("");  
          }
     }

     function formatar_data(date: string): string { //Função formatada para ser exibida no estilo: DD/MM/AAAA
          const [dataAtual, horaAtual] = date.split(" "); 
          const [ano, mes, dia] = dataAtual.split("-").map(Number);
          const [hora, minuto] = horaAtual.split(":").map(Number);

          const data = new Date(ano, mes - 1, dia, hora, minuto);

          const diaFusoHorario = String(data.getDate()).padStart(2, "0");
          const mesFusoHorario = String(data.getMonth() + 1).padStart(2, "0");
          const anoFusoHorario = data.getFullYear();

          const horas = String(data.getHours()).padStart(2, "0");
          const minutos = String(data.getMinutes()).padStart(2, "0");

          return `${diaFusoHorario}/${mesFusoHorario}/${anoFusoHorario} ${horas}:${minutos}`; //Retornando a data e hora formatadas para mostrar ao usuário
     }

     function data_simples(date: string): string {
          const [ano, mes, dia] = date.split("-").map(Number);

          const data = new Date(ano, mes - 1, dia);

          const dias = String(data.getDate()).padStart(2, "0");
          const meses = String(data.getMonth() + 1).padStart(2, "0");
          const anos = data.getFullYear();

          return `${dias}/${meses}/${anos}`;
     }

     function horas(horario: string): string { //Função para formatar as horas no formata HH:MM
          const horaTotal = new Date(horario);

          const hora = String(horaTotal.getHours()).padStart(2, "0");
          const minuto = String(horaTotal.getMinutes()).padStart(2, "0");

          return `${hora}:${minuto}`; //Retornando as horas e os minutos para mostrar pro usuário
     }

     function clique(e: React.KeyboardEvent<HTMLInputElement>) { //Função de clique para quando o usuário digitar o nome da cidade e clicar enter, mesmo dentro do input
          if (e.key === "Enter") { //Verificando se o usuário clicou na tecla enter no teclado
               get_clima();
               get_clima_em_sete_dias();
          }
     }

     function tema_fundo(descricao: string | undefined) {
          if (!descricao) {
               return {
                    bg: "bg-[url('./src/assets/Images/Background.png')]",
                    text: "text-white",
                    dadosClima: "bg-green-900",
               };
          }

          const descricaoClima = descricao.toLowerCase();

          if (descricaoClima.includes("sol") || descricaoClima.includes("ensolarado") || descricaoClima.includes("céu limpo")) {
               return {
                    bg: "bg-gradient-to-br from-[#fff587] to-[#f9d423]",
                    text: "text-gray-900",
                    dadosClima: "bg-purple-800",
               };
          }
          if (descricaoClima.includes("nublado") || descricaoClima.includes("parcialmente nublado") || descricaoClima.includes("céu encoberto") || descricaoClima.includes("encoberto")) {
               return {
                    bg: "bg-gradient-to-br from-[#f0f4f8] to-[#e2e8f0]",
                    text: "text-gray-700",
                    dadosClima: "bg-blue-900",
               };
          }
          if (descricaoClima.includes("chuva") || descricaoClima.includes("garoa") || descricaoClima.includes("tempestade") || descricaoClima.includes("trovoada") || descricaoClima.includes("chuva fraca") || descricaoClima.includes("possibilidade de chuva irregular") || descricaoClima.includes("possibilidade de chuvisco gelado irregular")) {
               return {
                    bg: "bg-gradient-to-br from-[#a0c4ff] to-[#5d9cec]",
                    text: "text-[#eef2f7]",
                    dadosClima: "bg-gray-800",
               };
          }
          if (descricaoClima.includes("neve") || descricaoClima.includes("nevasca") || descricaoClima.includes("neblina") || descricaoClima.includes("possibilidade de neve irregular") || descricaoClima.includes("possibilidade de neve molhada irregular")) {
               return {
                    bg: "bg-gradient-to-br from-[#ffffff] to-[#d8e7f5]",
                    text: "text-[#2f4f8c]",
                    dadosClima: "bg-[#103b66]",
               };
          }

          return {
               bg: "bg-[url('./src/assets/Images/Background.png')]",
               text: "text-white",
               dadosClima: "bg-red-300",
          };
     }
     
     return (
          <main className={`${css.conteudoPrincipal} ${bg} ${text}`}>
               <section className={`${css.dadosClimaticos} ${dadosClima}`}>
                    <div className="hidden">
                         bg-[#252525] bg-purple-800 bg-blue-900 bg-gray-800 bg-[#103b66] bg-gray-100
                    </div>

                    <h1 className={css.titulo}>ClimaLucas</h1>

                    <input 
                         type="text" 
                         placeholder="Digite o nome da cidade" 
                         value={cidade} 
                         onChange={(e) => {
                              const letras = e.target.value;
                              const letrasEspacos = letras.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
                              setCidade(letrasEspacos);
                         }} 
                         onKeyDown={clique} 
                         className={css.input}/>

                    <button 
                         type="button"  
                         onClick={() => {
                              get_clima();
                              get_clima_em_sete_dias();}} 
                         className={css.botao}>
                         Buscar
                    </button>

                    {/* Exibindo a temperatura, o nome da cidade e o ícone do tempo da cidade */}
                    {temperatura !== null && (
                         <div className={css.temperaturaIcone}> 
                              {icone && <img src={icone} alt="Ícone do tempo."/>}
                              <p>{nomeCidade}, {pais}: {temperatura}°C</p>
                              {icone && <img src={icone} alt="Ícone do tempo."/>}
                    </div>)}

                    {/* Exibindo a sensação térmica */}
                    {sensacaoTermica && 
                         <p className={css.sensacaoTermica}>Sensação térmica: {sensacaoTermica}°C</p>
                    }

                    {/* Exibindo a descrição do clima */}
                    {descricao && 
                         <p className={css.descricao}>Descrição: {descricao}</p>
                    }

                    {/* Exibindo a data e a hora */}
                    {horaData && 
                         <p className={css.dataHora}>Data e hora atual: {formatar_data(horaData)}</p>
                    }

                    {/* Exibindo a umidade */}
                    {umidade && 
                         <p className={css.umidade}>Umidade: {umidade}%</p>
                    }

                    {/* Exibindo a velocidade do vento em kilômetros */}
                    {ventoPorHora && 
                         <p className={css.velocidadeVento}>Velocidade do vento: {ventoPorHora}km/h</p>
                    }

                    {/* Exibindo a ultima atualização feita para o clima */}
                    {ultimaAtualizacao && 
                         <p className={css.atualizacao}>Última atualização: {horas(ultimaAtualizacao)}</p>
                    }

                    {/* Caso o usuário escreva o nome da cidade errado ou inexistente, é exibo o erro na tela */}
                    {erro && 
                         <p className={css.erro}>{erro}</p>
                    }

                    <section className={css.previsoes}>
                         {previsoes.length > 0 && !erroClima ? (
                              <>
                                   <h2>Previsão do tempo de 7 dias em {nomeCidade}</h2>
                                   <section className={css.previsoes7dias}>                                 
                                        {previsoes.map((dia, index) => (
                                             <div key={index} className={css.dias}>
                                                  <p>Dia: {data_simples(dia.datetime)}</p>
                                                  <img src={`https://www.weatherbit.io/static/img/icons/${dia.weather.icon}.png`} alt="Ícone do clima."/>
                                                  <p>Descrição: {dia.weather.description}</p>
                                                  <p>Temperatura: {dia.temp}°C</p>
                                                  <p>Temperatura máxima: {dia.max_temp}°C</p>
                                                  <p>Temperatura mínima: {dia.min_temp}°C</p>
                                                  <p>Velocidade do vento: {dia.wind_spd}km/h</p>
                                                  <p>Umidade: {dia.rh}%</p>
                                             </div>
                                        ))}
                                   </section>
                              </>
                         ) : null}
                    </section>
               </section>
          </main>
     );
}