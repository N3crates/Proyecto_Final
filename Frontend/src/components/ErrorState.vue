<template>
    <alert class="alert-error">
        <span>
            {{ message }}
        </span>
    </alert>
</template>

<script setup>
    defineProps({
        message:{
            type: string,
            default: 'Ocurrio un error'
        }
    })
</script>