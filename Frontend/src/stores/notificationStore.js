import { defineStore } from 'pinia'

export const useNotificationStore =
  defineStore('notifications', {
    state: () => ({
      notifications: []
    }),
    actions: {
      add(message, type = 'success') {
        const id = Date.now()
        this.notifications.push({
          id,
          message,
          type
        })
        setTimeout(() => {
          this.remove(id)
        }, 3000)
      },
      remove(id) {
        this.notifications =
          this.notifications.filter(
            notification =>
              notification.id !== id
          )
      }
    }
  })