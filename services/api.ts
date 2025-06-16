import axios, { AxiosError } from 'axios'
import { parseCookies } from 'nookies'
import { AuthTokenError } from './errors/AuthTokenError'

import { signOut } from '../contexts/AuthContext';

export function setupAPIClient(ctx = undefined) {
  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL:'http://localhost:3333',
    headers: {
      Authorization: `Bearer ${cookies['@sujeitopizza.token']}`
    }
  })

  api.interceptors.response.use(response => {
    return response;
  }, (error: AxiosError) => {
    if (error.response.status === 401) {
      // qualquer erro 401 (não autorizado) devemos deslogar o usuário
      if (typeof window === 'undefined') {
        // Estamos no lado do servidor, então você não deve chamar singOut() aqui
        return Promise.reject(new AuthTokenError());
      } else {
        // Estamos no lado do cliente, então é seguro chamar singOut()
        signOut()
      }
    }
  return Promise.reject(error);
  })

  return api;
}
