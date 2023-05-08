import React, { useState, useCallback } from 'react';
import { Container, Form, SubmitButton } from './styles';
import { FaGithub, FaPlus } from 'react-icons/fa';
import api from '../../services/api';

export default function Main() {
  const [newRepo, setNewRepo] = useState('');
  const [repositorios, setRepositorios] = useState([]);

  const handleSubmit = useCallback(
    e => {
      e.preventDefault();

      async function submit() {
        const response = await api.get(`repos/${newRepo}`);

        const data = {
          name: response.data.full_name
        };

        setRepositorios([...repositorios, data]);
        setNewRepo('');
        console.log(data);
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

        <SubmitButton>
          <FaPlus color="#FFF" size={14} />
        </SubmitButton>
      </Form>
    </Container>
  );
}
