import { useState } from 'react';
import Header from './Header';

function Login({ onLoginUser }) {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	function handleChangeEmail(event) {
		setEmail(event.target.value)
	}

	function handleChangePassword(event) {
		setPassword(event.target.value)
	}

	function handleSubmit(event) {
		event.preventDefault();
		onLoginUser({
			email,
			password
		});

		setEmail('');
		setPassword('');
	}

	return (
		<>
			<Header
				buttonText={'Регистрация'}
				headerLink={'/sign-up'}
			/>
			<section className="auth">
				<h2 className="auth__heading">Вход</h2>
				<form className="auth__form" onSubmit={handleSubmit}>
					<input
						className="auth__input"
						type="email"
						id="input-email"
						name="email"
						placeholder="E-mail"
						required
						onChange={handleChangeEmail}
						value={email}
					/>
					<input
						className="auth__input"
						type="password"
						id="input-password"
						name="password"
						placeholder="Пароль"
						required
						onChange={handleChangePassword}
						value={password} />

					<button
						className="auth__button"
						type="submit"
					>
						Войти
					</button>
				</form>
			</section>
		</>
	)
};

export default Login;