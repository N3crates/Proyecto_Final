<template>
    <div class="min-h-screen flex items-center justify-center bg-base-200">
        <div class="card w-96 bg-base-100 shadow-xl">
            <div class="card-body">
                <h1 class="text-3xl font-bold text-center mb-6">
                    DEMEN ERP
                </h1>
                <div
                v-if = "errorMenssage"
                class="alert alert-error mb-4"
                >
                    {{ errorMenssage }}
                </div>                
                <form @submit.prevent="handleLogin">
                    <div class="mb-4">
                        <label class="label">Usuario</label>
                        <input 
                        type="text" 
                        placeholder="Ingresa tu usuario" 
                        class="input input-bordered w-full"
                        />
                    </div>
                    <div class="mb-6">
                        <label class="label">Password</label>
                        <input 
                        type="text" 
                        placeholder="Ingresa tu password" 
                        class="input input-bordered w-full"
                        />
                    </div>
                    <button class="btn btn-primary w-full">Iniciar Sesión</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import { loginRequest } from '../../services/authService'

    const username = ref('')
    const password = ref('')
    const errorMenssage = ref('')
    const loading = ref(false)



    const handleLogin = () => {
        errorMenssage.value = ''

        if(!username.value || !password.value) {
            errorMenssage.value = 'Todos los campos son obligatorios'
            return
        }

        try {
            
        } catch (error) {
            errorMenssage.value = 'Credenciales incorrectas'
            console.error(error)
        }finally {
            loading.value = false
        }
    }
</script>