import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Owner, Loading, BackButton } from './styles';
import { FaArrowLeft } from 'react-icons/fa';

import api from '../../services/api';

// {decodeURIComponent(repositorio)}

export default function Repositorio({ match }) {
  const { repositorio } = useParams();
  //so vai ter um repositoiro por vez
  const [stateRepositorio, setStateRepositorio] = useState({});
  //vai ter uma lista de issues
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const nomeRepo = decodeURIComponent(repositorio);
      //fazer as requisições em paralelo e aguardar as duas respostas
      const [repositorioData, issuesData] = await Promise.all([
        api.get(`/repos/${nomeRepo}`),
        api.get(`/repos/${nomeRepo}/issues`, {
          //passar os parametros da requisição e paginar os resultados
          params: {
            state: 'open',
            per_page: 5
          }
        })
      ]);

      //atualizar os estados
      setStateRepositorio(repositorioData.data);
      setIssues(issuesData.data);
      setLoading(false);
    }
    load();
  }, [repositorio]);

  if (loading) {
    return <Loading>Carregando...</Loading>;
  }
  return (
    <Container>
      <BackButton to="/">
        <FaArrowLeft size={25} color="#000" />
      </BackButton>
      <Owner>
        <img
          src={stateRepositorio.owner.avatar_url}
          alt={stateRepositorio.owner.login}
        />
        <h1>{stateRepositorio.name}</h1>
        <p>{stateRepositorio.description}</p>
      </Owner>
    </Container>
  );
}
