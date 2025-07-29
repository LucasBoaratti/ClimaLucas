import { useState } from "react";
import axios from "axios";
import css from "./Clima.module.css";

interface WeatherResponse {
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
     const [descricao, setDescricao] = useState("");
     const [hora, setHora] = useState("");
     const [pais, setPais] = useState("");
     const [ventoPorHora, setVentoPorHora] = useState <number | null>(null);
     const [umidade, setUmidade] = useState <number | null>(null);
     const [ultimaAtualizacao, setUltimaAtualizacao] = useState("");
     const [erro, setErro] = useState("");

     async function get_clima() {
          if (!cidade) {
               return;
          }

          try {
               const api_key = "6e59ace25c0a4dfebac162548252907";
               const url = `https://api.weatherapi.com/v1/current.json?key=${api_key}&q=${cidade}&lang=pt`;

               const response = await axios.get<WeatherResponse>(url);

               setTemperatura(response.data.current.temp_c);
               setNomeCidade(response.data.location.name);
               setIcone(response.data.current.condition.icon);
               setDescricao(response.data.current.condition.text);
               setHora(response.data.location.localtime);
               setPais(response.data.location.country);
               setUmidade(response.data.current.humidity);
               setVentoPorHora(response.data.current.wind_kph);
               setUltimaAtualizacao(response.data.current.last_updated);
               setErro("");
          }
          catch {
               setErro("Cidade não encontrada.");
               setTemperatura(null);
               setNomeCidade("");
               setIcone("");
               setDescricao("");
               setHora("");
               setPais("");
               setUmidade(null);
               setVentoPorHora(null);
               setUltimaAtualizacao("");
          }
     }
     
     return (
          <main className={css.conteudoPrincipal}>
               <section className={css.dadosClimaticos}>
                    <h2 className={css.titulo}>ClimaLucas</h2>

                    <input type="text" placeholder="Digite o nome da cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} className={css.input}/>

                    <button onClick={get_clima} className={css.botao}>Buscar</button>

                    {temperatura !== null && (
                         <div className={css.temperaturaIcone}> 
                              <p>{nomeCidade}: {temperatura} °C</p>
                              {icone && <img src={icone} alt="Ícone do tempo."/>}
                    </div>)}

                    {descricao && <p>{descricao}</p>}

                    {hora && <p>{hora}</p>}

                    {pais && <p>{pais}</p>}

                    {umidade && <p>{umidade}%</p>}

                    {ventoPorHora && <p>{ventoPorHora}km/h</p>}

                    {ultimaAtualizacao && <p>{ultimaAtualizacao}</p>}

                    {erro && <p>{erro}</p>}
               </section>
          </main>
     );
}