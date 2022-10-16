class Auth {
	constructor(options) {
		this._baseURL = options.baseUrl;
		this._headers = options.headers;
		this._credentials = options.credentials;
	}

	register(data) {
		return fetch(`${this._baseURL}/signup`, {
			method: 'POST',
			headers: this._headers,
			credentials: this._credentials,
			body: JSON.stringify(data)
		})
			.then(this._checkResponseStatus)
	}

	authorize({ email, password }) {
		return fetch(`${this._baseURL}/signin`, {
			method: 'POST',
			headers: this._headers,
			credentials: this._credentials,
			body: JSON.stringify({ email, password })
		})
			.then(this._checkResponseStatus)
	}

	getContent() {
		return fetch(`${this._baseURL}/users/me`, {
			method: 'GET',
			headers: {
				"Content-Type": "application/json",
			},
			credentials: this._credentials,
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
	baseUrl: 'https://api.dmitryzhur.students.nomoredomains.icu',
	headers: {
		'Content-Type': 'application/json'
	},
	credentials: 'include',
};

const auth = new Auth(AUTH_CONFIG);

export default auth;