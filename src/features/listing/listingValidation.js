export const validateCreateForm = ({
  name,
  bathrooms,
  bedrooms,
  description,
  regularPrice,
  images,
}) => {
  const formErrors = {}

  //Title checks
  if (name.length < 1) {
    formErrors.title = 'A title is required'
  }

  //Bedroom Check
  if (bedrooms < 1) {
    formErrors.bedrooms = 'Required'
  }

  // Bathroom check
  if (bathrooms < 1) {
    formErrors.bathrooms = 'Required'
  }

  // Description Check
  if (description.length < 20) {
    formErrors.description = 'Min 20 characters required'
  }
  if (description.length < 1) {
    formErrors.description = 'A description is required'
  }

  // Price check
  if (regularPrice < 1) {
    formErrors.regularPrice = 'A price is required'
  }

  // image check
  if (images.length > 6) {
    formErrors.images = 'Max 6 images'
  }
  return formErrors
}
