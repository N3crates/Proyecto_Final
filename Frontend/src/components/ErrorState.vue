<template>
    <div class="alert alert-error">
        <span>
            {{ message }}
        </span>
    </div>
</template>

<script setup>
    defineProps({
        message:{
            type: String,
            default: 'Ocurrio un error'
        }
})
</script>