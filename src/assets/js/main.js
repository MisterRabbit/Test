const phoneMask = {

	init: () => {
		const elements = document.querySelectorAll('.js__form_mask')
		elements.forEach(phoneMask.setUpListeners)
	},

	setUpListeners: (input) => {
		input.addEventListener('input', (e) => phoneMask.mask(input, e), false)
		input.addEventListener('focus', (e) => phoneMask.mask(input, e), false)
		input.addEventListener('blur', (e) => phoneMask.mask(input, e), false)
		input.addEventListener('click', (e) => phoneMask.mask(input, e), false)
		input.addEventListener('keydown', (e) => phoneMask.mask(input, e), false)
	},

	mask: (input, event) => {
		phoneMask.setCursorPosition(input)

		const matrix = '8 ( ___ ) ___-__-__'
		const def = matrix.replace(/\D/g, '') // Default
		let	i = 0
		let	value = input.value.replace(/\D/g, '') // User value

		if (def.length >= value.length) {
			value = def
		}
		input.value = matrix.replace(/./g, (a) => {
			if (/[_\d]/.test(a) && i < value.length) {
				return value.charAt(i++)
			} else if (i >= value.length) {
				return ''
			} else {
				return a
			}
		})
		if (event.type === 'blur' && input.value.length === 1) input.value = ''
	},

	setCursorPosition: (input) => {
		const currentPosition = input.value.slice(0, input.selectionStart).length

		if (currentPosition < 1) input.setSelectionRange(1, 1) // Hide the first digit for selection
	}
}

const validation = {

	init: () => {
		const inputs = document.querySelectorAll('.form_control')

		inputs.forEach(input => {
			validation.setUpListeners(input)
			validation.patterns(input) // In case we have values for inputs in cookies, validate inputs for enabling the submit button
		})
	},

	setUpListeners: (input) => {
		input.addEventListener('blur', (e) => validation.patterns(input, e))
		input.addEventListener('input', (e) => validation.patterns(input, e))
		input.addEventListener('focus', (e) => validation.patterns(input, e))
	},

	patterns: (input, e) => {
		const inputName = input.name
		let pattern

		switch (inputName) {
		case 'phone':
			pattern = /\8\s[(]\s[0-9]{3}\s[)]\s\d{3}[-]\d{2}[-]\d{2}/g

			validation.checkError(input, e, pattern)
			break

		case 'password':
			pattern = /^[\S]{5,}$/

			validation.checkError(input, e, pattern)
			break

		default:
			break
		}
	},

	checkError: (input, e, pattern) => {
		const hasChecked = input.classList.contains('form_control__is-valid')
		const parentHasError = input.parentNode.classList.contains('form_item__has-error')
		const hasError = input.classList.contains('form_control__has-error')

		if (pattern.test(input.value)) {
			validation.removeError(input, hasError)
			validation.showChecked(input, hasChecked)
			validation.checkSubmit()
		} else {
			validation.removeChecked(input, hasChecked)
			validation.showError(input, e, parentHasError)
			validation.checkSubmit()
		}
	},

	showChecked: (input, hasChecked) => {
		if (hasChecked) {
			return
		} else if (input.name === 'phone') {
			input.parentNode.classList.add('form_item__is-valid')
		}
		input.classList.add('form_control__is-valid')
	},

	removeChecked: (input, hasChecked) => {
		if (!hasChecked) {
			return
		} else if (input.name === 'phone') {
			input.parentNode.classList.remove('form_item__is-valid')
		}
		input.classList.remove('form_control__is-valid')
	},

	showError: (input, e, parentHasError) => {
		if (parentHasError) {
			return
		} else if (e && e.type === 'blur') {
			input.parentNode.classList.add('form_item__has-error')
		}
		input.classList.add('form_control__has-error')
	},

	removeError: (input, hasError) => {
		if (!hasError) return
		input.parentNode.classList.remove('form_item__has-error')
		input.classList.remove('form_control__has-error')
	},

	checkSubmit: (isSending) => {
		const buttonSubmit = document.querySelector('.form_submit')
		const inputs = document.querySelectorAll('.form_control')
		const validInputs = document.querySelectorAll('.form_control__is-valid')

		if (isSending || validInputs.length !== inputs.length) {
			buttonSubmit.setAttribute('disabled', 'disabled')
		} else {
			buttonSubmit.removeAttribute('disabled')
		}
	}
}

const rememberUser = {

	init: () => {
		const form = document.querySelector('form')

		rememberUser.setUpListeners(form)
		rememberUser.checkCookies()
	},

	setUpListeners: (form) => {
		form.addEventListener('submit', (e) => rememberUser.checkCookies(e))
	},

	checkCookies: (e) => {
		const userPhone = document.getElementById('login_phone')
		const userPassword = document.getElementById('login_password')
		const checkbox = document.getElementById('login_memory').checked
		const submitWithRemember = e && checkbox
		const existCookies = document.cookie !== ''

		if (submitWithRemember) {
			rememberUser.clearCookies('_uPhone')
			rememberUser.clearCookies('_uPass')
			rememberUser.setCookies('_uPhone', userPhone)
			rememberUser.setCookies('_uPass', userPassword)
		} else if (existCookies) {
			rememberUser.getCookies('_uPhone', userPhone)
			rememberUser.getCookies('_uPass', userPassword)
		}
	},

	clearCookies: (name) => {
		const date = new Date()

		date.setTime(date.getTime() - 1)
		document.cookie = name += '=; expires=' + date.toGMTString()
	},

	setCookies: (name, userData) => {
		document.cookie = `${name}=${userData.value}`
	},

	getCookies: (name, userData) => {
		const res = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)')

		if (res) userData.value = res[2]
	}
}

const handler = {

	init: () => {
		const form = document.querySelector('form')

		handler.setUpListeners(form)
	},

	setUpListeners: (form) => {
		form.addEventListener('submit', (e) => handler.submit(form, e))
	},

	submit: (form, e) => {
		e.preventDefault()

		const xhr = new XMLHttpRequest()
		const formData = new FormData(form)
		const messages = {
			loading: '...',
			success: 'Успешная авторизация',
			notFound: 'Ресурс не найден',
			failure: 'Что-то пошло не так...',
			timeout: 'Превышено время ожидания ответа'
		}
		const statusMessage = handler.beforeSubmit()

		statusMessage.textContent = messages.loading

		xhr.onreadystatechange = () => {
			clearTimeout(timeout)
			if (xhr.readyState === 4 && xhr.status === 200) {
				statusMessage.textContent = messages.success
			} else if (xhr.status === 404) {
				statusMessage.textContent = messages.notFound
			}
		}

		xhr.open('POST', '/php/handler.php')
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
		xhr.send(formData)

		const timeout = setTimeout(() => {
			xhr.abort()
			statusMessage.textContent = messages.failure
		}, 10000)
	},

	beforeSubmit: () => {
		const isSending = true
		const popup = document.querySelector('.popup')
		const statusContainer = document.createElement('div') // Create container for status messages

		validation.checkSubmit(isSending) // hide submit button
		document.querySelector('.popup_content').classList.add('popup_content__sending') // hide whole form

		statusContainer.className = 'popup_status'
		statusContainer.innerHTML = '<p class="popup_message"></p>'
		popup.appendChild(statusContainer)
		return document.querySelector('.popup_message')
	}
}

document.addEventListener('DOMContentLoaded', (e) => {
	svg4everybody()
	phoneMask.init()
	rememberUser.init()
	validation.init()
	handler.init()
})
