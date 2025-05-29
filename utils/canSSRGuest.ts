import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";

//funcção paginas q so podem ser visitadas por visitantes

export function canSSRGuest<P>(fn:GetServerSideProps<P>){
  return async (ctx:GetServerSidePropsContext):Promise<GetServerSidePropsResult<P>> =>{
const cookies= parseCookies(ctx);
    if(cookies['@sujeitopizza.token']){
      return{
        redirect:{
          destination:'/produt',
          permanent:false,
        }
      }
    }
    return await fn(ctx)

  }
}