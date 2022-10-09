function PopupWithoutForm({ title, name, children, isOpen, onClose }) {
	return (
		<div className={`popup popup_type_${name} ${isOpen ? 'popup_opened' : ''}`}>
			<div className="popup__container popup__container_withoutform">
				<button type="button" className="popup__close-button button" id="close-button" onClick={onClose}></button>
				{children}
				<h2 className="popup__heading popup__heading_withoutform">{title}</h2>
			</div>
		</div>
	)
}

export default PopupWithoutForm;