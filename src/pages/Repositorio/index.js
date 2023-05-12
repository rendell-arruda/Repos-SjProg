import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Owner,
  Loading,
  BackButton,
  IssuesList,
  PageActions,
  FilterList
} from './styles';
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
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState([
    { state: 'all', label: 'Todas', active: true },
    { state: 'open', label: 'Abertas', active: false },
    { state: 'closed', label: 'Fechadas', active: false }
  ]);
  const [filterIndex, setFilterIndex] = useState(0);

  useEffect(() => {
    async function load() {
      const nomeRepo = decodeURIComponent(repositorio);
      //fazer as requisições em paralelo e aguardar as duas respostas
      const [repositorioData, issuesData] = await Promise.all([
        api.get(`/repos/${nomeRepo}`),
        api.get(`/repos/${nomeRepo}/issues`, {
          //passar os parametros da requisição e paginar os resultados
          params: {
            state: filters.find(f => f.active).state,
            per_page: 5
          }
        })
      ]);

      //atualizar os estados
      setStateRepositorio(repositorioData.data);
      setIssues(issuesData.data);
      console.log(issuesData.data);
      setLoading(false);
    }
    load();
  }, [repositorio]);

  useEffect(() => {
    async function loadIssues() {
      const nomeRepo = decodeURIComponent(repositorio);
      const response = await api.get(`/repos/${nomeRepo}/issues`, {
        params: {
          state: filters[filterIndex].state,
          page,
          per_page: 5
        }
      });
      setIssues(response.data);
    }
    loadIssues();
  }, [filterIndex, filters, page, repositorio]);

  function handlePage(action) {
    setPage(action === 'back' ? page - 1 : page + 1);
  }

  if (loading) {
    return <Loading>Carregando...</Loading>;
  }

  function handleFilter(index) {
    setFilterIndex(index);
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

      <FilterList active={filterIndex}>
        {filters.map((filter, index) => (
          <button
            type="button"
            key={filter.label}
            onClick={() => handleFilter(index)}
          >
            {filter.label}
          </button>
        ))}
      </FilterList>
      <IssuesList>
        {issues.map(issue => (
          <li key={String(issue.id)}>
            <img src={issue.user.avatar_url} alt={issue.user.login} />
            <div>
              <strong>
                <a href={issue.html_url}>{issue.title}</a>

                {issue.labels.map(label => (
                  <span key={String(label.id)}>{label.name}</span>
                ))}
              </strong>
              <p>{issue.user.login}</p>
            </div>
          </li>
        ))}
      </IssuesList>

      <PageActions>
        <button
          type="button"
          onClick={() => handlePage('back')}
          disabled={page < 2}
        >
          Voltar
        </button>
        <button type="button" onClick={() => handlePage('next')}>
          Próxima
        </button>
      </PageActions>
    </Container>
  );
}
