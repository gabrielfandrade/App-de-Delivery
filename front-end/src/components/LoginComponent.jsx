import React, { useState, useEffect, useMemo } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { validateLogin } from '../validates/validateLogin';
import { requestLogin, setToken } from '../helpers/APIRequests';
import { localUser, setLocalUser } from '../helpers/localStorage';
import '../css/login.css';

const deliveryImage = require('../images/delivery.jpg');

function LoginComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [btnLogin, setBtnLogin] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  const [failedTryLogin, setFailedTryLogin] = useState(false);

  // Source: https://trybecourse.slack.com/archives/C02NJF661EF/p1647051142193709
  const routes = useMemo(
    () => ({
      customer: '/customer/products',
      seller: '/seller/orders',
      administrator: '/admin/manage',
    }),
    [],
  );

  useEffect(() => {
    const login = validateLogin(email, password);
    setBtnLogin(!login);
  }, [email, password]);

  const handleLogin = async () => {
    try {
      const result = await requestLogin('/login', { email, password });
      const { token } = result;

      setToken(token);

      setLocalUser(result);

      setIsLogged(true);
    } catch (error) {
      setFailedTryLogin(true);
      setIsLogged(false);
    }
  };

  if (isLogged) {
    const { role } = localUser();

    return <Navigate to={ routes[role] } replace />;
  }

  return (
    <div className="login">
      <img
        src={ deliveryImage }
        alt="delivery"
        className="delivery-image"
      />
      <h2>Delivery App</h2>
      <div className="login-form">
        <input
          type="text"
          data-testid="common_login__input-email"
          placeholder="email@tryber.com.br"
          value={ email }
          onChange={ ({ target: { value } }) => setEmail(value) }
        />
        <input
          type="password"
          data-testid="common_login__input-password"
          placeholder="*****"
          value={ password }
          onChange={ ({ target: { value } }) => setPassword(value) }
        />
        <button
          type="button"
          className="btn-login"
          data-testid="common_login__button-login"
          disabled={ btnLogin }
          onClick={ handleLogin }
        >
          LOGIN
        </button>
        <button
          type="button"
          data-testid="common_login__button-register"
          className="btn-register"
        >
          <Link to="/register">Ainda n??o tenho conta.</Link>
        </button>

        {failedTryLogin ? (
          <p
            data-testid="common_login__element-invalid-email"
            className="user-not-found"
          >
            Usu??rio n??o cadastrado.
          </p>
        ) : null}
      </div>
    </div>
  );
}
// test
export default LoginComponent;
