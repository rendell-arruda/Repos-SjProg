import React from 'react';
import { Container, Form, SubmitButton } from './styles';
import { FaGithub, FaPlus } from 'react-icons/fa';

export default function Main() {
  return (
    <Container>
      <h1>
        <FaGithub size={25} /> Meus repositorios
      </h1>

      <Form onSubmit={() => {}}>
        <input type="text" placeholder="Adicionar repositorios" />

        <SubmitButton>
          <FaPlus color="#FFF" size={14} />
        </SubmitButton>
      </Form>
    </Container>
  );
}
