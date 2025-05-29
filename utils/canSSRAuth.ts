import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies, destroyCookie } from "nookies";
import { AuthTokenError } from "../services/errors/AuthTokenError";

//função para paginas que so users logados teem acesso

export function canSSRAuth<P>(fn: GetServerSideProps<P>){
  return async (ctx: GetServerSidePropsContext):Promise<GetServerSidePropsResult<P>> =>{
    const cookies = parseCookies(ctx);
    const token = cookies['@sujeitopizza.token'];
    if(!token){
      return{
        redirect:{
          destination:'/',
          permanent:false,
        }
      }
    }
    try {
      return await fn(ctx);
      
    } catch (error) {
      if(error instanceof AuthTokenError){
        destroyCookie(ctx, '@sujeitopizza.token');
        return {
          redirect:{
            destination:'/',
            permanent:false
          }
        }
      }
    }

  }
}