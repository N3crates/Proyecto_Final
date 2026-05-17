import { defineStore } from 'pinia'

const VALID_TYPES = [
  'success', 'error', 'warning', 'info'
]

export const useNotificationStore =
  defineStore('notifications', {
    state: () => ({
      notifications: []
    }),
    actions: {
      add(message, type = 'success', duration = 3000) {
        if(!VALID_TYPES.includes(type)){
          type = 'info'
        }
        const id = crypto.randomUUID()
        this.notifications.push({
          id,
          message,
          type
        })
        setTimeout(() => {
          this.remove(id)
        }, duration)
      },
      remove(id) {
        this.notifications = this.notifications.filter(
        notification => notification.id !== id
      )
    },
    clear(){
      this.notifications = []
    }
  }
})