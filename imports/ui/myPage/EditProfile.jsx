import React from "react";
import { useTracker } from "meteor/react-meteor-data";

const EditProfile = () => {
  const user = useTracker(() => Meteor.user());

  return (
    <>
      <h2>프로필 편집</h2>
      {user?.profile?.profilePicture && (
        <img
          src={user.profile.profilePicture}
          style={{ width: "300px", height: "300px", borderRadius: "50%" }}
        />
      )}
    </>
  );
};

export default EditProfile;
