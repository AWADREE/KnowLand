import React, { useState } from "react";
import { client } from "../client";
import { v4 as uuidv4 } from "uuid"; //for creating unique keys

const Comment = ({ comment, user, pinDetail }) => {
  const [likingComment, seTlikingComment] = useState(false);

  const alreadyLiked = !!comment?.save?.filter(
    (item) => item.postedBy._id === user._id
  )?.length;

  const likeComment = (id) => {
    if (!alreadyLiked) {
      seTlikingComment(true);
      const commentToLike = [`comment[_key == "${comment._key}"]`].like;

      client
        .patch(id)
        .setIfMissing({
          save: commentToLike,
        })
        .insert("after", `${commentToLike}[-1]`, [
          {
            _key: uuidv4(),
            userId: user._id,
            postedBy: {
              _type: comment?.postedBy,
              _ref: user._id,
            },
          },
        ])
        .commit()
        .then(() => {
          console.log("comment liked");
          seTlikingComment(false);
          window.location.reload();
        });
    }
  };

  return (
    <div className="">
      <div className="flex gap-2 mt-5 items-center bg-white rounded-lg">
        <img
          src={comment.postedBy.image}
          alt="user-profile"
          className="w-10 h-10 rounded-full cursor-pointer"
        />
        <div className="flex flex-col">
          <p className="font-bold">{comment.postedBy.userName}</p>
          <p>{comment.comment}</p>
        </div>
      </div>
      {/* <div className="flex justify-around">
        <div className="flex">
          <p>like</p>
          <p className="ml-3">reply</p>
        </div>
        <div></div>
        <div></div>
      </div> */}
    </div>
  );
};

export default Comment;
