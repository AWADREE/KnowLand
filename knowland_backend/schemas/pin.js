export default {
  name: "pin",
  title: "Pin",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "about",
      title: "About",
      type: "string",
    },
    {
      name: "destination",
      title: "Destination",
      type: "url",
    },
    {
      name: "category",
      title: "Category",
      type: "string",
    },
    {
      name: "image",
      title: "Image",
      type: "image",

      options: {
        //hotspot enables the selecting of which areas of an image should be croped and which areas shouldnt,
        //check the sanity.io docs for more info
        hotspot: true,
      },
    },
    {
      name: "userId",
      title: "UserID",
      type: "string",
    },
    {
      name: "postedBy",
      title: "PostedBy",
      type: "postedBy", //referance to another doc when the type isnt an obiuse type like string or array
    },
    {
      name: "save",
      title: "Save",
      type: "array", //when the type is an array the of property comes after to specify the contents of the array
      of: [{ type: "save" }], //an array of objects where the type is = save
    },
    {
      name: "comments",
      title: "Comments",
      type: "array",
      of: [{ type: "comment" }], //an array of objects where the type is = to comment
    },
  ],
};
