// imports/api/studyform.js
import { Meteor } from 'meteor/meteor';
import { Study, Application } from '/imports/api/collections'; // Study 컬렉션 경로에 맞게 수정


Meteor.methods({
  // 스터디 생성 메서드
  'study.create': function (studyData) {
    // 현재 로그인된 사용자 정보 가져오기
    const user = Meteor.users.findOne(this.userId); // 로그인한 사용자 정보
    if (!user) {
      throw new Meteor.Error('user-not-found', '사용자를 찾을 수 없습니다.');
    }

    // 사용자 닉네임 가져오기
    const userNickname = user.profile?.nickname;
    if (!userNickname) {
      throw new Meteor.Error('nickname-not-found', '사용자 닉네임이 없습니다.');
    }

    // 사용자가 이미 스터디를 생성한 경우를 확인
    const existingStudy = Study.findOne({ userId: userNickname });

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
    if (studyData.onOffline !== '온라인') {
    if (!studyData.address || typeof studyData.address.city !== 'string' || studyData.address.city.trim() === '') {
      throw new Meteor.Error('invalid-address-city', '지역(도시)을 입력해주세요.');
    }
    if (typeof studyData.address.gubun !== 'string' || studyData.address.gubun.trim() === '') {
      throw new Meteor.Error('invalid-address-gubun', '지역(구)을 입력해주세요.');
    }
  }
    if (!Array.isArray(studyData.techStack) || studyData.techStack.length === 0) {
      throw new Meteor.Error('invalid-techstack', '기술 스택을 하나 이상 선택해주세요.');
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
   
   
  
    // 스터디 생성
    const studyId = Study.insert({
      title: studyData.title,
      content: studyData.content,
      address: studyData.onOffline === '온라인' ? {} : studyData.address,
      techStack: studyData.techStack,
      studyCount: studyData.studyCount,
      studyClose: studyData.studyClose,
      roles: studyData.roles,
      onOffline: studyData.onOffline,
      rating: studyData.rating,
      views: 0,
      status: '모집중',
      userId: userNickname, // 현재 로그인된 사용자 ID
      createdAt: new Date(),
    });

    

    if (!studyId) {
      throw new Meteor.Error('study-creation-failed', '스터디 생성에 실패했습니다.');
    }

    // 스터디가 성공적으로 생성되면 Application도 자동으로 생성
    Application.insert({
      studyId,
      userIds: [userNickname],  // 신청자 배열에 현재 유저 추가
      states: ['수락'],  // 신청 상태 배열
      progress: '예정',  // 진행 상태
      createdAt: new Date(),
      startDate: '미정',
      endDate: '미정',
    });

    return studyId; // 생성된 스터디 ID 반환
  },
});
