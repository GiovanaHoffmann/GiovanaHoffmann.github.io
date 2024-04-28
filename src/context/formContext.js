import React, { createContext, useReducer, useContext } from 'react';

const FormContext = createContext();

//hook personalizado para acessar o contexto do formulário
export const useFormContext = () => useContext(FormContext);

const initialState = {
  categoria: '',
  year: '',
  resposta: '',
};

//reducer para atualizar o estado do formulário com base nas ações
const reducer = (state, action) => {
  switch (action.type) {
    //atualiza um campo específico do estado com o valor fornecido
    case 'SET_CAMPO':
      return { ...state, [action.payload.campo]: action.payload.valor };
    //define a resposta da API no estado
    case 'SET_RESPOSTA':
      return { ...state, resposta: action.payload };
    default:
      return state;
  }
};

//provedor de contexto para encapsular o estado e o dispatch do formulário
export const FormProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    //fornece o estado e a função de dispatch para todos os componentes filhos
    <FormContext.Provider value={{ state, dispatch }}>
      {children}
    </FormContext.Provider>
  );
};
