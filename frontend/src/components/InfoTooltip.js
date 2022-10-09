import PopupWithoutForm from './PopupWithoutForm';
import failIcon from '../images/fail.svg';
import successIcon from '../images/success.svg';

function InfoTooltip({ answer, isOpen, onClose }) {
	return (
		<PopupWithoutForm
			name="result-registration"
			title={
				answer
					? "Вы успешно зарегистрировались!"
					: "Что-то пошло не так! Попробуйте ещё раз."
			}
			isOpen={isOpen}
			onClose={onClose}
		>
			<img src={answer
				? successIcon
				: failIcon}
				alt={answer
					? "Успех"
					: "Ошибка"}
				className="popup__icon" />
		</PopupWithoutForm>
	)
};

export default InfoTooltip;