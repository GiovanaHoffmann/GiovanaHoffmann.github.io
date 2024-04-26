import React, { useReducer } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const initialState = {
  categoria: '',
  year: '',
  resposta: '',
};

// Reducer para atualizar o estado com base em ações
const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_CAMPO':
      // Atualiza um campo específico do estado com um novo valor
      return { ...state, [action.payload.campo]: action.payload.valor };
    case 'SET_RESPOSTA':
      // Define a resposta da API no estado
      return { ...state, resposta: action.payload };
    default:
      return state;
  }
};

const Formulario = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  // Função para lidar com o envio do formulário
  const handleSubmit = async (values) => {
    try {
      const { categoria, year } = values;
      const url = `https://api.nobelprize.org/2.1/nobelPrize/${categoria}/${year}`;
      const response = await fetch(url);
      const data = await response.json();
      const prize = data[0];

      let html = `
        <h3>Category: ${prize.category.en}</h3>
        <h3>Year: ${prize.awardYear}</h3>
      `;

      prize.laureates.forEach((laureate) => {
        html += `
          <h3>Winner: ${laureate.fullName.en}</h3>
          <p>Motivation: ${laureate.motivation.en}</p>
        `;
      });

      dispatch({ type: 'SET_RESPOSTA', payload: html });
    } catch (error) {
      console.error('Request error!', error);
    }
  };

  return (
    <div className="container">
      {/* Componente Formik para gerenciar o formulário */}
      <Formik
        initialValues={initialState}
        validate={(values) => {
          const errors = {};
          if (!values.categoria || !values.year) {
            errors.camposObrigatorios = 'Please fill all the fields.';
          }
          if (isNaN(values.year)) {
            errors.anoInvalido = 'Year must be a number.';
          }
          return errors;
        }}
        // Função a ser chamada ao enviar o formulário
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="pesquisa">
              <Field type="text" name="year" placeholder="Type the year" />
              <ErrorMessage name="year" component="div" className="error" />
              <Field as="select" name="categoria">
                <option value="" disabled>Select the category</option>
                <option value="che">Chemistry</option>
                <option value="eco">Economic Science</option>
                <option value="lit">Literature</option>
                <option value="pea">Peace</option>
                <option value="phy">Physics</option>
                <option value="med">Medicine</option>
              </Field>
              <ErrorMessage name="categoria" component="div" className="error" />
            </div>
            <button type="submit" disabled={isSubmitting}>
              Search
            </button>
            {/* Exibir a resposta formatada se disponível (se state.resposta tiver um valor)*/}
            {/*"dangerouslySetInnerHTML" permite inserir HTML diretamente no DOM*/}
            {state.resposta && (
              <div className="resposta" dangerouslySetInnerHTML={{ __html: state.resposta }} />
            )}
            {/* Exibir mensagem de erro se a resposta estiver vazia ou contiver 'error' */}
            {(state.resposta === '' || state.resposta.includes('erro')) && (
              <div className="error">{state.resposta}</div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Formulario;
