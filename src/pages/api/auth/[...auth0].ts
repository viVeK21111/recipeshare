

import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';
import auth0 from '@/lib/auth0';

export default handleAuth({
  login: handleLogin({
    returnTo: '/recipes'
  })
});
