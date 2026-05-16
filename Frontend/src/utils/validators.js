export function required(value, fieldName) {
    if(value === undefined || value === null || value === ''){
        return `${fieldName} es obligatorio`
    }
    return null
}

export function validEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
    if(!emailRegex.test(email)){
        return 'Correo electronico invalido'
    }
    return null
}

export function minLength(value, min, fieldName){
    if(value.length < min){
        return `${fieldName} debe tener al menos ${min} caracteres`
    }
    return null
}