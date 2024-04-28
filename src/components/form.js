import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { FormProvider, useFormContext } from '../context/formContext';

const Form = () => {
  const { state, dispatch } = useFormContext();

  const formik = useFormik({
    initialValues: {
      categoria: '',
      year: '',
    },
    onSubmit: (values) => {
      dispatch({ type: 'SET_CAMPO', payload: { campo: 'categoria', valor: values.categoria } });
      dispatch({ type: 'SET_CAMPO', payload: { campo: 'year', valor: values.year } });
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const { categoria, year } = state;
      if (categoria && year) {
        try {
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
          console.error('Erro na requisição!', error);
          dispatch({ type: 'SET_RESPOSTA', payload: 'Erro na requisição!' });
        }
      }
    };

    fetchData();
  }, [state.categoria, state.year, dispatch]); 

  return (
    <div className="container">
      <form onSubmit={formik.handleSubmit}>
        <div className="pesquisa">
          <input
            type="text"
            id="year"
            name="year"
            placeholder="Type the year"
            onChange={formik.handleChange}
            value={formik.values.year}
          />
          <select
            id="categoria"
            name="categoria"
            onChange={formik.handleChange}
            value={formik.values.categoria}
          >
            <option value="">Select the category</option>
            <option value="che">Chemistry</option>
            <option value="eco">Economic Science</option>
            <option value="lit">Literature</option>
            <option value="pea">Peace</option>
            <option value="phy">Physics</option>
            <option value="med">Medicine</option>
          </select>
        </div>
        <button type="submit">Search</button>
      </form>
      {state.resposta && (
        <div className="resposta" dangerouslySetInnerHTML={{ __html: state.resposta }} />
      )}
    </div>
  );
};

const FormWrapper = () => (
  <FormProvider>
    <Form />
  </FormProvider>
);

export default FormWrapper;
