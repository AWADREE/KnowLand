// we are reaching into the localstore , getting an item where the key name is user,
//and checking if its key value is not undefined, if it is not, parse the data into a js object,
//otherwise clear the local storage cuz there is probebly somthing that went wrong
//and assiging the value we get to a new const called userUnfo

export const fetchUser = () => {
  const userInfo =
    localStorage.getItem("user") !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : localStorage.clear();

  return userInfo;
};
