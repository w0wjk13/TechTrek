import React, { useState, useRef } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Files } from "/imports/api/collections";

const EditProfile = () => {
  const user = useTracker(() => Meteor.user());
  const [selectFile, setSelectFile] = useState(null); //선택한 파일
  //서버와 통신 없이 브라우저에서 사진을 미리보기 위해 필요한 url
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  //현재 프로필 사진, 선택된 새 사진의 미리보기를 표시할 수 있도록 설정
  const fileChange = (e) => {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      const file = e.currentTarget.files[0];
      setSelectFile(file); //나중에 업로드할 수 있도록 파일 정보 저장
      setPreviewUrl(URL.createObjectURL(file)); //사용자에게 즉시 사진 보여줄 수 있도록 url 생성
      console.log(URL.createObjectURL(file));
    }
  };

  const imageUpload = () => {
    fileInputRef.current.click();
  };

  const save = () => {
    const upload = Files.insert(
      {
        file: selectFile,
        chunkSize: "dynamic", //패키지가 자동으로 최적의 크기로 나누어 파일 업로드
      },
      //파일 업로드 즉시 시작 불가. 업로드 프로세스 수동으로 제어.
      //fileUpload 인스턴스 반환 => upload.on, upload.start
      false
    );

    upload.on("start", function () {
      console.log("업로드 시작");
    });

    upload.on("end", function (error, fileObj) {
      if (error) {
        console.error("업로드 중 오류 발생: ", error);
      } else {
        Meteor.users.update(Meteor.userId(), {
          //fileObj.url 다른 사용자들이 접근할 수 있는 url 생성
          $set: { "profile.profilePicture": fileObj.url },
        });
      }
    });

    upload.start();
  };

  const imageRemove = () => {
    Meteor.users.update(Meteor.userId(), {
      $set: { "profile.profilePicture": "" },
    });
    setPreviewUrl(null);
    setSelectFile(null);
  };

  return (
    <>
      <h2>프로필 편집</h2>
      <div
        style={{
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          overflow: "hidden",
          backgroudColor: "#f0f0f0",
        }}
      >
        <img
          src={
            previewUrl ||
            user.profile.profilePicture ||
            "https://example.com/profile.jpg"
          }
          style={{
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      </div>

      <input
        type="file"
        onChange={fileChange}
        accept="image/png, image/jpeg, image/jpg"
        style={{ display: "none" }}
        ref={fileInputRef}
      />

      <button onClick={imageUpload}>사진 업로드</button>

      <button
        onClick={imageRemove}
        disabled={!user?.profile?.profilePicture && !previewUrl}
      >
        사진 제거
      </button>
      <hr />
      <button onClick={save}>저장</button>
    </>
  );
};

export default EditProfile;
