/*
 * @Author: your name
 * @Date: 2020-07-06 15:31:25
 * @LastEditTime: 2020-07-06 15:33:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \webpack4-vue2\src\utils\user.js
 */ 
export function getUserName() {
    return sessionStorage.getItem("user-name");
}

export function setUserName(data) {
    return sessionStorage.setItem("user-name", data);
}

export function removeUserName() {
    return sessionStorage.removeItem("user-name");
}

export function getUserAvatars() {
    return sessionStorage.getItem("avatars");
}

export function setUserAvatars(data) {
    return sessionStorage.setItem("avatars", data);
}

export function removeUserAvatars() {
    return sessionStorage.removeItem("avatars");
}
