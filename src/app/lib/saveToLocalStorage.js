export const saveToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};
