// to create a schema we export an object

export default {
  name: "user", //a name
  title: "User", //the title that will be showen
  type: "document",
  fields: [
    //to take input from the user
    {
      //first input field field has a name, a title that will be showen and a type on input field
      name: "userName",
      title: "UserName",
      type: "string",
    },
    {
      name: "image",
      title: "Image",
      type: "string",
    },
  ],
};
