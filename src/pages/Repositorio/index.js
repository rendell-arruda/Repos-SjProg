import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from './styles';

import api from '../../services/api';

// {decodeURIComponent(repositorio)}

export default function Repositorio({ match }) {
  const { repositorio } = useParams();
  const [stateRepositorio, setStateRepositorio] = useState({});
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
  return (
    <Container>
      <h1></h1>
    </Container>
  );
}
