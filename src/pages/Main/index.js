import React, { useState, useCallback } from 'react';
import { Container, Form, SubmitButton } from './styles';
import { FaGithub, FaPlus, FaSpinner } from 'react-icons/fa';
import api from '../../services/api';

export default function Main() {
  const [newRepo, setNewRepo] = useState('');
  const [repositorios, setRepositorios] = useState([]);
  const [loading, setLoading] = useState(false);

  // useCallback é uma função que retorna uma função
  const handleSubmit = useCallback(
    e => {
      e.preventDefault();

      // fazer a chamada a api e requisitar os dados
      async function submit() {
        setLoading(true);
        try {
          const response = await api.get(`repos/${newRepo}`);

          const data = {
            name: response.data.full_name
          };
          console.log(data);
          setRepositorios([...repositorios, data]);
          setNewRepo('');
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
      submit();
    },
    [newRepo, repositorios]
  );

  function handleInputChange(e) {
    setNewRepo(e.target.value);
  }

  return (
    <Container>
      <h1>
        <FaGithub size={25} /> Meus repositorios
      </h1>

      <Form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Adicionar repositorios"
          value={newRepo}
          onChange={handleInputChange}
        />

        <SubmitButton loading={loading ? 1 : 0}>
          {loading ? (
            <FaSpinner color="#FFF" size={14} />
          ) : (
            <FaPlus color="#FFF" size={14} />
          )}
        </SubmitButton>
      </Form>
    </Container>
  );
}
