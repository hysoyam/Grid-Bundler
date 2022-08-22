const forms = document.querySelectorAll('form')

for (const form of forms) {
  const formInputs = form.querySelectorAll('.input')
  for (const input of formInputs) {
    input.addEventListener('input', () => {
      checkInput(input)
    })
  }
}

function checkInput(input) {

  if (!input.value.length) {
    input.parentElement.classList.add('error')
    updateErrorText(input, 'Вы ничего не ввели')
    return
  }

  if (input.type === "email" && !input.value.includes('@')) {
    input.parentElement.classList.add('error')
    updateErrorText(input, 'Неверный формат почты')
    return
  }
  input.parentElement.classList.remove('error')

}

function updateErrorText(input, text = 'Недопустимый формат') {

  const message = input.parentElement.querySelector('.input-wrapper__message')
  message.innerText = text;
}

const addressClose = document.querySelector('.contacts__address__close-btn')

addressClose.addEventListener('click', (e) => {
  e.preventDefault()

  if (document.querySelector('.contacts__address').classList.toggle('contacts__address_hidden')) {
    addressClose.querySelector('use').href.baseVal = './images/sprite.svg#up-arrow'
    document.querySelector('.contacts__address-phone').setAttribute('tabindex', '-1')
  } else {
    addressClose.querySelector('use').href.baseVal = './images/sprite.svg#exit'
    document.querySelector('.contacts__address-phone').removeAttribute('tabindex')
  }
})


document.querySelector('.contacts__address-phone').addEventListener('focusin', (e) => {
  if (document.querySelector('.contacts__address').classList.contains('contacts__address_hidden')) {
  addressClose.click()
  }
})

const menuBtn = document.querySelector('.header__menu-btn')

menuBtn.addEventListener('click', (e) => {
  e.preventDefault()

  if (document.querySelector('.contacts__address').classList.toggle('contacts__address_hidden')) {
    menuBtn.querySelector('use').href.baseVal = './images/sprite.svg#exit'
  } else {
    menuBtn.querySelector('use').href.baseVal = './images/sprite.svg#menu-i'
  }

  document.querySelector('.header__menu').classList.toggle('header__menu_active')
})

const search = document.querySelector('.header__seacrh-btn')

search.addEventListener('click', (e) => {
  e.preventDefault()
  document.querySelector('.header__seacrh').classList.toggle('active')

})

document.querySelector('.header__seacrh-input').addEventListener('focusin', (e) => {

  document.querySelector('.header__seacrh').classList.add('active',
    !document.querySelector('.header__seacrh').classList.contains('active'))
})

document.querySelector('.header__seacrh-input').addEventListener('focusout', (e) => {

  document.querySelector('.header__seacrh').classList.remove('active',
    document.querySelector('.header__seacrh').classList.contains('active'))
})
