// imports/api/studyform.js
import { Meteor } from 'meteor/meteor';
import { Study } from '/imports/api/collections'; // Study 컬렉션을 가져옵니다.
import { MeteorUsers } from 'meteor/meteor'; // Meteor.users를 사용하려면 가져오기 필요

Meteor.methods({
  // 현재 로그인한 유저가 생성한 스터디 가져오기
  'study.getMyStudies': function () {
    // 로그인하지 않은 경우
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', '로그인한 사용자만 접근 가능합니다.');
    }

    // 현재 로그인한 사용자가 생성한 스터디를 찾기
    const myStudies = Study.find({ userId: this.userId }).fetch(); // 로그인한 유저가 생성한 스터디 목록을 찾음

    if (myStudies.length === 0) {
      throw new Meteor.Error('no-studies', '생성한 스터디가 없습니다.');
    }

    // 스터디 목록에 작성자 정보를 추가하기
    const studiesWithCreator = myStudies.map(study => {
      // 스터디 작성자 정보 가져오기 (userId와 일치하는 Meteor.user 찾기)
      const creator = Meteor.users.findOne(study.userId); // userId에 해당하는 작성자 정보 가져오기

      // 작성자가 없다면 기본 값 '알 수 없음' 처리
      study.creatorName = creator ? creator.profile.name : '알 수 없음';
      
      return study;
    });

    return studiesWithCreator;  // 작성자 정보를 포함한 스터디 목록 반환
  }
});
