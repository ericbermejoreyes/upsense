import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import { Checkbox } from '@paljs/ui/Checkbox';
import React, {useState} from 'react';
import { Link } from 'gatsby';

import Auth, { Group } from '../../components/Auth';
import Socials from '../../components/Auth/Socials';
import SEO from '../../components/SEO';
import {handleLogin} from "../../services/auth";

export default function Login() {

    const [credentials, setCredentials] = useState({username: '', password: ''});

  const onCheckbox = () => {
    // v will be true or false
  };

  const onSubmit = e => {
      e.preventDefault();

      handleLogin(credentials);
  };

  return (
    <Auth title="Sign in" subTitle="Enter your upsense account">
      <SEO title="Sign in" />
      <form onSubmit={onSubmit}>
        <InputGroup fullWidth>
          <input type="text" placeholder="Username" onChange={e => setCredentials({...credentials, username: e.target.value})} value = {credentials.username}/>
        </InputGroup>
        <InputGroup fullWidth>
          <input type="password" placeholder="Password" onChange={e => setCredentials({...credentials, password: e.target.value})} value = {credentials.password}/>
        </InputGroup>
        <Group>
          <Checkbox onChange={onCheckbox}>Remember me</Checkbox>
          <Link to="/auth/request-password">Forgot Password?</Link>
        </Group>
        <Button status="Success" type="submit" shape="SemiRound" fullWidth>
          Login
        </Button>
      </form>
      {/*<Socials />*/}
      <p>
        Don&apos;t have account? <Link to="/auth/register">Register</Link>
      </p>
    </Auth>
  );
}
