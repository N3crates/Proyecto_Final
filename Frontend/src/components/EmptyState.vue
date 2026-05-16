<template>
    <div class="flex flex-col items-center justify-center py-12 text-center opacity-70">
        <h3 class="text-lg font-semibold">
            {{ title }}
        </h3>
        <p class="text-sm">
            {{ description }}
        </p>
    </div>
</template>

<script setup>
    defineProps({
        title:{
            type: string,
            default: 'Sin datos'
        },
        description:{
            type: string,
            default: 'No hay información disponible'
        }
    })
</script>