import { Link } from 'react-router-dom';
import logo from '../images/logo.svg';

function Header({ buttonText, headerLink, onClick, children }) {
	return (
		<header className="header">
			<img className="header__logo" src={logo} alt="Логотип проекта Mesto" />
			<div className='header__info'>
				<p className='header__email'>{children}</p>
				<Link className='header__link' to={headerLink} onClick={onClick}>{buttonText}</Link>
			</div>
		</header>
	)
}

export default Header;