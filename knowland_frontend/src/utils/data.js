//we are using GROQ sanity query language

export const categories = [
  {
    name: "cars",
    image:
      "https://exclusivecarmodels.com/331-home_default/lamborghini-aventador-lp-780-4-ultimae-roadster-looksmart-ls532b-pasifae-violet.jpg",
  },
  {
    name: "gaming",
    image:
      "https://media.direct.playstation.com/is/image/psdglobal/dualsense-ps5-controller-midnight-black-accessory-front?$Background_Small$",
  },
  {
    name: "art",
    image:
      "https://wallup.net/wp-content/uploads/2016/03/09/340036-Deadpool-digital_art-white_background-artwork-superhero.jpg",
  },
  {
    name: "fitness",
    image:
      "https://media.istockphoto.com/photos/young-man-in-sportswear-running-picture-id1167084433?k=20&m=1167084433&s=612x612&w=0&h=7HM6zmhrb2Y9cEM3byMIuL_J9yjuYF6h1Wj8EuO4qvA=",
  },
  {
    name: "wallpaper",
    image:
      "https://hdwallpaperim.com/wp-content/uploads/2017/08/25/463034-men-simple_background-digital_art-graffiti-clouds-minimalism-white_background-748x421.jpg",
  },
  {
    name: "movie",
    image:
      "https://cdn.domestika.org/c_fill,dpr_auto,f_auto,q_auto,w_820/v1561282148/content-items/003/074/829/Venom_movie_fan_art_2-original.jpg?1561282148",
  },
  {
    name: "photo",
    image:
      "https://media.macphun.com/img/uploads/customer/blog/721/15523970125c87b2d4934946.66669090.jpg?q=85&w=1680",
  },
  {
    name: "food",
    image:
      "https://thumbs.dreamstime.com/b/fresh-tasty-pizza-white-background-clipping-path-included-85746388.jpg",
  },
  {
    name: "nature",
    image:
      "https://media.cntraveller.com/photos/611bf0b8f6bd8f17556db5e4/1:1/w_2000,h_2000,c_limit/gettyimages-1146431497.jpg",
  },
  {
    name: "travel",
    image:
      "https://ae.visamiddleeast.com/dam/VCOM/global/travel-with-visa/images/visa-travel-carousel-02-640x640.jpg",
  },
  {
    name: "quote",
    image:
      "https://thumbs.dreamstime.com/b/you-beautiful-positive-saying-handwritten-quote-white-background-80185978.jpg",
  },
  {
    name: "cats",
    image:
      "https://media.istockphoto.com/photos/kitten-looking-up-picture-id1281700863?b=1&k=20&m=1281700863&s=170667a&w=0&h=-ikJUy0bE3hxaVARLuiE3bo4ovced0XJUL3UtVVHXA0=",
  },
  {
    name: "dogs",
    image:
      "https://thumbs.dreamstime.com/b/little-golden-retriever-dog-standing-white-background-little-golden-retriever-dog-standing-white-background-looking-190302464.jpg",
  },
  {
    name: "others",
    image:
      "https://preview.redd.it/7ur3khxslrl41.jpg?auto=webp&s=261d0a4c2d5f840b355d7aaecb3d0a440402c82e",
  },
];

export const feedQuery = `*[_type == "pin"] | order(_createdAt desc) {

    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    save[]{
      _key,
      postedBy-> {
        _id,
        userName,
        image
      },
    },
  }`;

export const pinDetailQuery = (pinId) => {
  const query = `*[_type == "pin" && _id == '${pinId}']{
    image{
      asset->{
        url
      }
    },
    _id,
    title, 
    about,
    category,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
   save[]{
      postedBy->{
        _id,
        userName,
        image
      },
    },
    comments[]{
      comment,
      _key,
      postedBy->{
        _id,
        userName,
        image
      },
    }
  }`;
  return query;
};

//getting every pin with that word in its title or description or category
export const pinDetailAdvancedMorePinsQuery = (word, id) => {
  const query = `*[_type == "pin" && _id != '${id}' && 
  (title match '${word}*' ||
   about match '${word}*'||
    category match '${word}*')]
  {
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    save[]{
      _key,
      postedBy->{
        _id,
        userName,
        image
      },
    },
  }`;
  return query;
};

//this

export const pinDetailMorePinQuery = (pin) => {
  // const query = `*[_type == "pin" && category == '${pin.category}' && _id != '${pin._id}' ]
  const query = `*[_type == "pin" && _id != '${pin._id}' && 
  (title match '${pin.category}*' ||
   about match '${pin.category}*'||
    category match '${pin.category}*')]
  {
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    save[]{
      _key,
      postedBy->{
        _id,
        userName,
        image
      },
    },
  }`;
  return query;
};

export const userQuery = (userId) => {
  //this is a Sanity spesfic query
  //try to get me a doc where type is user and where id is userid
  const query = `*[_type == "user" && _id == '${userId}']`;
  return query;
};

//get image asset url from docs, _id, destination, postedBy id, username and image,
// an array of saves _key, PostedBy _id, userName, and iamge
//where type is pin and title or category or about match searchterm , and the * after the searchterm so that the matching is done before fisinshing writing

export const searchQuery = (searchTerm) => {
  const query = `*[_type == "pin" && title match '${searchTerm}*' || category match '${searchTerm}*' || about match '${searchTerm}*']{
        image{
          asset->{
            url
          }
        },
            _id,
            destination,
            postedBy->{
              _id,
              userName,
              image
            },
            save[]{
              _key,
              postedBy->{
                _id,
                userName,
                image
              },
            },
          }`;
  return query;
};

export const userCreatedPinsQuery = (userId) => {
  const query = `*[ _type == 'pin' && userId == '${userId}'] | order(_createdAt desc){
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    save[]{
      postedBy->{
        _id,
        userName,
        image
      },
    },
  }`;
  return query;
};

export const userSavedPinsQuery = (userId) => {
  const query = `*[_type == 'pin' && '${userId}' in save[].userId ] | order(_createdAt desc) {
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    save[]{
      postedBy->{
        _id,
        userName,
        image
      },
    },
  }`;
  return query;
};
