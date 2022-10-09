class Auth {
	constructor(options) {
		this._baseURL = options.baseUrl;
		this._headers = options.headers;
	}

	register(data) {
		return fetch(`${this._baseURL}/signup`, {
			method: 'POST',
			headers: this._headers,
			body: JSON.stringify(data)
		})
			.then(this._checkResponseStatus)
	}

	authorize({ email, password }) {
		return fetch(`${this._baseURL}/signin`, {
			method: 'POST',
			headers: this._headers,
			body: JSON.stringify({ email, password })
		})
			.then(this._checkResponseStatus)
	}

	getContent(jwt) {
		return fetch(`${this._baseURL}/users/me`, {
			method: 'GET',
			headers: {
				"Authorization": `Bearer ${jwt}`,
				"Content-Type": "application/json"
			}
		})
			.then(this._checkResponseStatus)
	}

	_checkResponseStatus(res) {
		if (res.ok) {
			return res.json();
		}
		return Promise.reject(`Ошибка: ${res.status}`);
	}

}

const AUTH_CONFIG = {
	baseUrl: 'https://auth.nomoreparties.co',
	headers: {
		'Content-Type': 'application/json'
	}
};

const auth = new Auth(AUTH_CONFIG);

export default auth;