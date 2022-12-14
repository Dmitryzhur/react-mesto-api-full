import { useState, useEffect } from "react";
import { Route, Switch, useHistory } from 'react-router-dom';
import Main from './Main';
import ImagePopup from './ImagePopup';
import CurrentUserContext from '../contexts/CurrentUserContext';
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";
import api from "../utils/Api";
import auth from "../utils/Auth";

function App() {
	const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
	const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
	const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
	// const [isDeletePlacePopupOpen, setIsDeletePlacePopupOpen] = useState(false);
	const [selectedCard, setSelectedCard] = useState({});
	const [currentUser, setCurrentUser] = useState({});
	const [cards, setCardsList] = useState([]);
	// const [isLoading, setLoading] = useState(true);
	const [isAuthorization, setIsAuthorization] = useState(false);
	const [isPopupWithoutFormOpen, setisPopupWithoutFormOpen] = useState(false);
	const [isloggedIn, setLoggedIn] = useState(false);
	const [userData, setUserData] = useState("");
	const history = useHistory();

	useEffect(() => {
		auth.getContent()
			.then((data) => {
				setLoggedIn(true);
				setUserData({
					'email': data.email,
				});
				history.push('/');
			})
			.catch((err) => {
				history.push("/sign-in");
				console.log(err);
			});
	}, [history])

	function handleRegisterUser(data) {
		auth.register(data)
			.then((res) => {
				handlePopupWithoutFormOpen(true);
				setIsAuthorization(true);
				history.push('/sign-in');
			})
			.catch((err) => {
				handlePopupWithoutFormOpen(false);
				setIsAuthorization(false);
				console.log(err);
			})
	}

	function handleLoginUser(data) {
		auth.authorize(data)
			.then((res) => {
				setLoggedIn(true);
				setIsAuthorization(true);
				setUserData({
					'email': data.email,
				});
				history.push('/');
			})
			.catch((err) => {
				handlePopupWithoutFormOpen(false);
				setIsAuthorization(false);
				console.log(err);
			})
	}

	function handlelogOut() {
		auth.logOut()
			.then((res) => {
				setLoggedIn(false);
				setUserData(null);
				history.push('/sign-in');
		})
		.catch((err) => console.log(err));
	}

	function handlePopupWithoutFormOpen(result) {
		setLoggedIn(result);
		setisPopupWithoutFormOpen(true);
	}

	useEffect(() => {
		// setLoading(true);
		Promise.all([api.getUser(), api.getCards()])
			.then(([userData, initialCards]) => {
				setCurrentUser(userData);
				setCardsList(initialCards);
			})
			.catch((err) => { console.log(err) })
		// .finally(() => setLoading(false))

	}, [isloggedIn, history]);

	function handleUpdateUser(data) {
		api.editProfile(data)
			.then((res) => {
				setCurrentUser(res);
				closeAllPopups();
			})
			.catch((err) => {
				console.log(err);
			})
	}

	function handleUpdateAvatar(data) {
		api.editAvatar(data)
			.then((res) => {
				setCurrentUser(res);
				closeAllPopups();
			})
			.catch((err) => {
				console.log(err);
			})
	}

	function handleAddCard(data) {
		api.addCard(data)
			.then((newCard) => {
				setCardsList([newCard, ...cards]);
				closeAllPopups();
			})
			.catch((err) => {
				console.log(err);
			})
	}

	const onCardLike = (card) => {
		// ?????????? ??????????????????, ???????? ???? ?????? ???????? ???? ???????? ????????????????
		const isLiked = card.likes.some(i => i === currentUser._id);

		// ???????????????????? ???????????? ?? API ?? ???????????????? ?????????????????????? ???????????? ????????????????
		api.toggleLike(card._id, isLiked)
			.then((newCard) => {
				setCardsList((state) => state.map((c) => c._id === card._id ? newCard : c));
			})
			.catch((err) => { console.log(err) })
	}

	const onCardDelete = (card) => {
		api.delCard(card._id)
			.then(() => {
				const newArr = cards.filter(item => item._id !== card._id);
				setCardsList(newArr);
			})
			.catch((err) => { console.log(err) })
	}

	// ?????????????????????? ???????????????? ??????????????
	const onEditAvatar = () => {
		setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen);
	}

	const onEditProfile = () => {
		setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
	}

	const onAddPlace = () => {
		setIsAddPlacePopupOpen(!isAddPlacePopupOpen);
	}

	// const onCardDeleteClick = () => {
	// 	setIsDeletePlacePopupOpen(!isDeletePlacePopupOpen);
	// }

	const closeAllPopups = () => {
		setIsEditProfilePopupOpen(false);
		setIsAddPlacePopupOpen(false);
		setIsEditAvatarPopupOpen(false);
		// setIsDeletePlacePopupOpen(false);
		setisPopupWithoutFormOpen(false);
		setSelectedCard({});
	}

	return (
		<CurrentUserContext.Provider value={currentUser} >
			<div className="page">
				<Switch>
					<ProtectedRoute exact
						path="/"
						loggedIn={isloggedIn}
						userData={userData}
						component={Main}
						onEditAvatar={onEditAvatar}
						onEditProfile={onEditProfile}
						onAddPlace={onAddPlace}
						onCardClick={setSelectedCard}
						cards={cards}
						onCardLike={onCardLike}
						onCardDelete={onCardDelete}
						onClick={handlelogOut}
					/>
					<Route path="/sign-in">
						<Login onLoginUser={handleLoginUser} />
					</Route>
					<Route path="/sign-up">
						<Register onRegisterUser={handleRegisterUser} />
					</Route>
				</Switch>

				<InfoTooltip
					isOpen={isPopupWithoutFormOpen}
					onClose={closeAllPopups}
					answer={isloggedIn} 
					isAuthorization={isAuthorization}
					/>

				<EditAvatarPopup
					isOpen={isEditAvatarPopupOpen}
					onClose={closeAllPopups}
					onUpdateAvatar={handleUpdateAvatar} />

				<EditProfilePopup
					isOpen={isEditProfilePopupOpen}
					onClose={closeAllPopups}
					onUpdateUser={handleUpdateUser} />

				<AddPlacePopup
					isOpen={isAddPlacePopupOpen}
					onClose={closeAllPopups}
					onAddCard={handleAddCard} />

				<ImagePopup
					name='view-image'
					card={selectedCard}
					onClose={closeAllPopups} />

				{/* <PopupWithForm
					name="confirm"
					title="???? ???????????????"
					buttonName="????"
					isOpen={isDeletePlacePopupOpen}
					onClose={closeAllPopups}
					onSubmit={onCardDelete} 
					card={selectedCard}
					/> */}
			</div>
		</CurrentUserContext.Provider>
	);
}

export default App;