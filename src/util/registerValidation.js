export const registerValidation = (name, p1, p2) => {
  const validation = {
    nameError: false,
    passwordError: false,
    nameMessage: '',
    passwordMessage: '',
  }

  if (name.length < 1) {
    validation.nameError = true
    validation.nameMessage = 'Name is required'
  }

  if (name.length < 3 && name.length > 0) {
    validation.nameError = true
    validation.nameMessage = 'Name is too short'
  }

  if (p1.length < 1) {
    validation.passwordError = true
    validation.passwordMessage = 'Password is required'
  } else if (p1.length < 6) {
    validation.passwordError = true
    validation.passwordMessage = 'Password too short'
  }

  if (p1 !== p2) {
    validation.passwordError = true
    validation.passwordMessage = 'Passwords do not match'
  }

  return validation
}
