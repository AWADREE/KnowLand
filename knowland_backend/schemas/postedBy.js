//the posted by will be a referance to a user

export default {
  name: "postedBy",
  title: "PostedBy",
  type: "reference", //when the type is a referance it is followed by the to property
  to: [{ type: "user" }], //to an object where the type is = to user
};
