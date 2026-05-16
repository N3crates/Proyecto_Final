<template>
  <div
    class="toast toast-top toast-end z-[9999]">
    <div
      v-for="notification in notifications"
      :key="notification.id"
      class="alert"
      :class="{

        'alert-success':
          notification.type === 'success',

        'alert-error':
          notification.type === 'error',

        'alert-warning':
          notification.type === 'warning',

        'alert-info':
          notification.type === 'info'
      }"
    >

      <span>
        {{ notification.message }}
      </span>

    </div>

  </div>
</template>

<script setup>

import { storeToRefs } from 'pinia'
import { useNotificationStore } from '../stores/notificationStore'

const notificationStore =
  useNotificationStore()

const { notifications } =
  storeToRefs(notificationStore)

</script>