// imports/api/studyform.js
import { Meteor } from 'meteor/meteor';
import { Study } from '/imports/api/collections'; // Study 컬렉션 경로에 맞게 수정


Meteor.methods({
  // 스터디 생성 메서드
  'study.create': function (studyData) {
    // 사용자가 이미 스터디를 생성한 경우를 확인
    const existingStudy = Study.findOne({ userId: this.userId });

    if (existingStudy) {
      throw new Meteor.Error('study-exists', '이미 스터디를 생성한 사용자입니다.');
    }
    // 직접 유효성 검사
    if (typeof studyData.title !== 'string' || studyData.title.trim() === '') {
      throw new Meteor.Error('invalid-title', '제목을 입력해주세요.');
    }
    if (typeof studyData.content !== 'string' || studyData.content.trim() === '') {
      throw new Meteor.Error('invalid-content', '내용을 입력해주세요.');
    }
    if (!studyData.address || typeof studyData.address.city !== 'string' || studyData.address.city.trim() === '') {
      throw new Meteor.Error('invalid-address-city', '지역(도시)을 입력해주세요.');
    }
    if (typeof studyData.address.gubun !== 'string' || studyData.address.gubun.trim() === '') {
      throw new Meteor.Error('invalid-address-gubun', '지역(구)을 입력해주세요.');
    }
    if (!Array.isArray(studyData.techStack) || studyData.techStack.length === 0) {
      throw new Meteor.Error('invalid-techstack', '기술 스택을 하나 이상 선택해주세요.');
    }
    if (typeof studyData.studyCount !== 'number' || studyData.studyCount < 2 || studyData.studyCount > 10) {
      throw new Meteor.Error('invalid-studyCount', '모집 인원은 2명에서 10명 사이여야 합니다.');
    }
    if (!(studyData.studyClose instanceof Date) || isNaN(studyData.studyClose.getTime())) {
      throw new Meteor.Error('invalid-studyClose', '모집 마감일을 정확히 입력해주세요.');
    }
    if (!studyData.roles || studyData.roles.length === 0) {
      throw new Meteor.Error('invalid-roles', '요구하는 역할을 선택해주세요.');
    }
    if (!['온라인', '오프라인', '온/오프라인'].includes(studyData.onOffline)) {
      throw new Meteor.Error('invalid-onOffline', '진행 방식을 선택해주세요.');
    }
    if (!studyData.score || typeof studyData.score !== 'object' || Object.values(studyData.score).some(s => s === '')) {
      throw new Meteor.Error('invalid-score', '모든 점수를 입력해주세요.');
    }
    const scoreValues = Object.values(studyData.score);
if (scoreValues.filter(s => s >= 0 && s <= 5).length !== scoreValues.length) {
  throw new Meteor.Error('invalid-score', '점수는 0부터 5 사이의 값만 입력할 수 있습니다.');
}
  
    // 스터디 생성
    const studyId = Study.insert({
      title: studyData.title,
      content: studyData.content,
      address: studyData.address,
      techStack: studyData.techStack,
      studyCount: studyData.studyCount,
      studyClose: studyData.studyClose,
      roles: studyData.roles,
      onOffline: studyData.onOffline,
      score: studyData.score,
      views: 0,
      status: '모집중',
      userId: this.userId, // 현재 로그인된 사용자 ID
      createdAt: new Date(),
    });

    return studyId; // 생성된 스터디 ID를 반환
  }
});
