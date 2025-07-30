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

     function horas(horario: string): string { //Função para formatar as horas no formata HH:MM
          const horaTotal = new Date(horario);

          const hora = String(horaTotal.getHours()).padStart(2, "0");
          const minuto = String(horaTotal.getMinutes()).padStart(2, "0");

          return `${hora}:${minuto}`; //Retornando as horas e os minutos para mostrar pro usuário
     }

     function clique(e: React.KeyboardEvent<HTMLInputElement>) { //Função de clique para quando o usuário digitar o nome da cidade e clicar enter, mesmo dentro do input
          if (e.key === "Enter") { //Verificando se o usuário clicou na tecla enter no teclado
               get_clima();
          }
     }
     
     return (
          <main className={css.conteudoPrincipal}>
               <section className={css.dadosClimaticos}>
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

                    <button type="button" onClick={get_clima} className={css.botao}>Buscar</button>

                    {/* Exibindo a temperatura, o nome da cidade e o ícone do tempo da cidade */}
                    {temperatura !== null && (
                         <div className={css.temperaturaIcone}> 
                              {icone && <img src={icone} alt="Ícone do tempo."/>}
                              <p>{nomeCidade}, {pais}: {temperatura} °C</p>
                              {icone && <img src={icone} alt="Ícone do tempo."/>}
                    </div>)}

                    {/* Exibindo a sensação térmica */}
                    {sensacaoTermica && 
                         <p className={css.sensacaoTermica}>Sensação térmica: {sensacaoTermica} °C</p>
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
               </section>
          </main>
     );
}