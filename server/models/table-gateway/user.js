const Table = require('chinchay').Table; // eslint-disabled-this-line no-unused-vars
const bcrypt = require('bcrypt-nodejs');

class User extends Table {
  constructor() {
    const table_name = 'user';
    super(table_name);
  }
  generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  }

  // checking if password is valid
  validPassword(user, password) {
    // invalid arguments
    if (!user || !user.password) {
      return false;
    }
    return bcrypt.compareSync(password, user.password);
  }

  changePassword(id, currentPassword, newPassword, isAdmin, adminId) {
    if (!isAdmin) {
      return new Promise((resolve, reject) => {
        super.findById(id).then((user) => {
          const isValid = this.validPassword(user, currentPassword);
          if (!isValid) {
            return reject('Contraseña incorrecta');
          }
          const encryptedPass = this.generateHash(newPassword);
          return resolve(super.update(user.id, {
            password: encryptedPass,
            password_changed: true,
          }));
        }).catch((err) => {
          reject(err);
        });
      });
    }
    return new Promise((resolve, reject) => {
      super.findById(adminId).then((user) => {
        const isValid = this.validPassword(user, currentPassword);
        if (!isValid) {
          return reject('Contraseña incorrecta');
        }
        const encryptedPass = this.generateHash(newPassword);
        return resolve(super.update(id, {
          password: encryptedPass,
          password_changed: true,

        }));
      }).catch((err) => {
        reject(err);
      });
    });
  }

  usernameTaken(username) {
    return new Promise((resolve, reject) => {
      super.find({
        username,
      }).then((results) => {
        if (results.length > 0) {
          return resolve(true);
        }
        resolve(false);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  // parseAccess(entryArray, user_id) {
  //   // entryArray is not an array
  //   if (!(Array.isArray(entryArray) || entryArray instanceof Array)) {
  //     return false;
  //   }
  //   const returnArray = [];
  //   for (let i = 0; i < entryArray.length; i++) {
  //     const entry = entryArray[i];
  //     if (entry && entry.to && entry.in && entry.accessType && user_id) {
  //       returnArray.push({
  //         access_id: entry.to,
  //         user_id,
  //         table_name: entry.in,
  //         access_type: entry.accessType,
  //       });
  //     }
  //   }
  //   return returnArray;
  // }
  //
  // saveAccess(accessArray) {
  //   const promises = [];
  //   for (let i = 0; i < accessArray.length; i++) {
  //     promises.push(Access.save(accessArray[i]));
  //   }
  //   return Promise.all(promises);
  // }
  // getAccessIndex(array, access) {
  //   for (let i = 0; i < array.length; i++) {
  //     if (array[i].in === access.in && array[i].to === access.to) {
  //       return i;
  //     }
  //   }
  //   return -1;
  // }
  //
  // getNewAccess(before, after, user_id) {
  //   const promises = [];
  //   for (let i = 0; i < after.length; i++) {
  //     if (this.getAccessIndex(before, after[i]) === -1) {
  //       after[i].user_id = user_id;
  //       promises.push(Access.save(after[i]));
  //     }
  //   }
  //   return Promise.all(promises);
  // }
  //
  // getDeleteAccess(before, after) {
  //   const promises = [];
  //   for (let i = 0; i < before.length; i++) {
  //     if (this.getAccessIndex(after, before[i]) === -1) {
  //       promises.push(Access.delete(before[i].id));
  //     }
  //   }
  //   return Promise.all(promises);
  // }
  //
  // getEditAccess(before, after) {
  //   const promises = [];
  //   for (let i = 0; i < before.length; i++) {
  //     const index = this.getAccessIndex(after, before[i]);
  //     if (index >= 0) {
  //       const changed = before[i].accessType !== after[index].accessType;
  //       if (changed) {
  //         after[index].user_id = before[i].user_id;
  //         promises.push(Access.update(before[i].id, after[index]));
  //       }
  //     }
  //   }
  //   return Promise.all(promises);
  // }
  //
  // editAccess(user, finalAccess) {
  //   return new Promise((resolve, reject) => {
  //     // user has id param
  //     if (!user || !user.id) {
  //       reject('User param not defined correctly');
  //     }
  //     if (!Array.isArray(finalAccess)) {
  //       reject('Access param not defined correctly');
  //     }
  //     Access.find({
  //       user_id: user.id,
  //     }).then((initialAccess) => {
  //       const createAccess = this.getNewAccess(initialAccess, finalAccess, user.id);
  //       const deleteAccess = this.getDeleteAccess(initialAccess, finalAccess);
  //       const editAccess = this.getEditAccess(initialAccess, finalAccess);
  //       const returnablePromises = Promise.all([createAccess, editAccess, deleteAccess]);
  //
  //       returnablePromises.then(() => {
  //         resolve(Access.find({
  //           user_id: user.id,
  //         }));
  //       }).catch((err) => {
  //         reject(err);
  //       });
  //     }).catch((err) => {
  //       reject(err);
  //     });
  //   });
  // }
  //

  save(originalEntry) {
    // if it is not defined (or false) set it to false
    if (!originalEntry.is_active) {
      originalEntry.is_active = false;
    }
    // set email verified to false by default
    // originalEntry.email_verified = false;

    // encrypt password
    originalEntry.password = this.generateHash(originalEntry.password);

    // const access_params = originalEntry.access;
    // delete originalEntry.access;

    return new Promise((resolve, reject) => {
      super.save(originalEntry).then((savedUser) => {
        // const access = this.parseAccess(access_params, savedUser.id);
        resolve(savedUser);
        // if (access) {
        //   this.saveAccess(access).then(() => {
        //     resolve(savedUser);
        //   }).catch((err) => {
        //     reject(err);
        //   });
        // } else {
        //   resolve(savedUser);
        // }
      }).catch((err) => {
        reject(err);
      });
    });
  }

  // Dont allow to change password
  update(id, originalAttributes) {
    delete originalAttributes.password;
    return super.update(id, originalAttributes);
  }

  isAdmin(id) {
    return new Promise((resolve, reject) => {
      super.findById(id).then((user) => {
        // in case user.is_admin is null
        if (!user.is_admin) {
          user.is_admin = false;
        }
        resolve(user.is_admin);
      }).catch((err) => {
        reject(err);
      });
    });
  }
}


const instance = new User();


module.exports = instance;
