import { db } from '../../config/firebase.js'

const USERS_COLLECTION = 'users'
const ROLES_COLLECTION = 'roles'

export class AuthRepository {
  async findByUsuario(usuario) {
    const snapshot = await db .collection(USERS_COLLECTION).where('usuario', '==', usuario).limit(1).get()

    if (snapshot.empty) {
      return null
    }

    const doc = snapshot.docs[0]

    const user = {
      id: doc.id,
      ...doc.data()
    }

    if (user.roleId) {
      const roleDoc = await db .collection(ROLES_COLLECTION).doc(user.roleId).get()

      if (roleDoc.exists) {
        const roleData = roleDoc.data()
        user.role = roleData
        user.permissions = roleData.permissions || []
      }
    }
    return user
  }

  async findById(id) {
    const doc = await db .collection(USERS_COLLECTION).doc(id).get()

    if (!doc.exists) {
      return null
    }

    const user = {
      id: doc.id,
      ...doc.data()
    }

    if (user.roleId) {
      const roleDoc = await db .collection(ROLES_COLLECTION).doc(user.roleId).get()

      if (roleDoc.exists) {
        const roleData = roleDoc.data()
        user.role = roleData
        user.permissions = roleData.permissions || []
      }
    }
    return user
  }
}

export const authRepository =
  new AuthRepository()