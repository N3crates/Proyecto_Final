export function getErrorMessage(error, fallback = 'Ocurrió un error') {
    return(
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        fallback
    )
}