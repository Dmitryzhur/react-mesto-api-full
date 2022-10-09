import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function Register({ onRegisterUser }) {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	function handleChangeEmail(e) {
		setEmail(e.target.value)
	}

	function handleChangePassword(e) {
		setPassword(e.target.value)
	}

	function handleSubmit(e) {
		e.preventDefault();
		onRegisterUser({
			email,
			password
		});
	}

	return (
		<>
			<Header
				buttonText={'Войти'}
				headerLink={'/sign-in'}
			/>
			<section className="auth">
				<h2 className="auth__heading">Регистрация</h2>
				<form className="auth__form" onSubmit={handleSubmit}>
					<input
						className="auth__input"
						type="email"
						id="input-email"
						name="email"
						placeholder="E-mail"
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
						value={password}
					/>
					<button
						className="auth__button"
						type="submit"
					>
						Зарегистрироваться
					</button>
				</form>
				<p className="auth__text">
					Уже зарегистрированы?
					<Link to="/sign-in" className="auth__link"> Войти</Link>
				</p>
			</section>
			<Footer />
		</>
	)
};

export default Register;