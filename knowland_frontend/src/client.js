import sanityClient from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

//linking this project to a spsfic sanity project
export const client = sanityClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID, //this points at the sanity project we are linking to
  dataset: "production",
  apiVersion: "2021-11-16",
  useCdn: true,
  token: process.env.REACT_APP_SANITY_PROJECT_TOKEN, //this token verfies the permissions we have over the project
});

//when working with images this logic is needed
const builder = imageUrlBuilder(client);
export const urlFor = (source) => builder.image(source);
