export function getErrorMessage(error, fallback = 'Ocurrió un error') {
    const validationErrors = error.response?.data?.errors
    if(validationErrors){
        return Object.values(validationErrors).join(', ')
    }
    return(
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        fallback
    )
}