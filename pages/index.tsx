import { FormEvent, useContext, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from '../styles/Home.module.scss';
import logoImg from '../public/Logo.png';
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/Button";
import { AuthContext } from "../contexts/AuthContext";
import {toast} from 'react-toastify'
import { canSSRGuest } from '../utils/canSSRGuest';

export default function Home() {
  const {signIn}= useContext(AuthContext)
  const [credential, setCredential]= useState('');
  const [password, setPassword]= useState('');
  const [loading, setLoading]= useState(false);
  async function handleLogin(event:FormEvent){
    event.preventDefault();
    if(credential=== '' || password === ''){
      toast.warning("Preencha Todos os Campos");
      return;
    }
    setLoading(true);
    
    let data={
      credential,
      password
    }
   await signIn(data)

   setLoading(false);
  }
  return (
  <>
  <Head>
    <title>
      RDB - Faça Login
    </title>
  </Head>
   <div className={styles.containerCenter}>
  <Image src={logoImg} className={styles.logo} alt="RDB Transportes" />
  
  <div className={styles.login}>
    <h1>Login</h1>
   <form  onSubmit={handleLogin}>
    
    <Input
      style={{padding:'8px'}}
      placeholder="Digite o seu nome do usuário"
      type="text"
      value={credential}
      onChange={(e)=>setCredential(e.target.value)}
    />
    <Input
      style={{padding:'8px'}}
      placeholder="Digite a Senha"
      type="password"
      value={password}
      onChange={(e)=>setPassword(e.target.value)}
    />
   
    <Button 
    type="submit"
    loading={loading}>
      enviar
    </Button>
   </form>

  </div>
 

  </div>
  </> 
  )
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
return {
  props:{}
}

})
