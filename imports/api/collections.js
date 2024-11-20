import { Mongo } from "meteor/mongo";
import { FilesCollection } from "meteor/ostrio:files";

// export const LinksCollection = new Mongo.Collection('links');
export const Study = new Mongo.Collection("studys");
export const StudyUsers = new Mongo.Collection("studyUsers");
export const StudyNotifications = new Mongo.Collection("studyNotifications");
export const StandBy = new Mongo.Collection("standbys");

export const Files = new FilesCollection({
  //FilesCollection 파일 업로드 기능을 제공하는 컬렉션
  collectionName: "files",
  allowClientCode: false, //클라이언트에서 파일 삭제 비활성화
  onBeforeUpload(file) {
    if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
      //파일 유효성 검사
      return true; //업로드 허용
    }
    return "10MB 이하의 이미지 파일(png, jpg, jpeg)만 업로드 가능합니다.";
  },
});
