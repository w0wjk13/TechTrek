import { Meteor } from 'meteor/meteor';
import { Study, Application } from '/imports/api/collections';

Meteor.methods({
  // Get studies created by the logged-in user
  'study.getMyStudies': function () {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', '로그인한 사용자만 접근 가능합니다.');
    }

   // 로그인한 사용자의 nickname을 사용하여 userId를 찾기
   const user = Meteor.users.findOne(this.userId); // 현재 로그인한 사용자
   if (!user || !user.profile || !user.profile.nickname) {
     throw new Meteor.Error('no-nickname', '사용자 닉네임이 없습니다.');
   }

   const nickname = user.profile.nickname;

   // nickname을 기준으로 해당 사용자가 생성한 스터디를 찾기
   const myStudies = Study.find({ userId: nickname }).fetch();

   if (myStudies.length === 0) {
     throw new Meteor.Error('no-studies', '생성한 스터디가 없습니다.');
   }

   // 작성자 닉네임과 신청자 수를 포함한 스터디 목록 반환
   const studiesWithCreator = myStudies.map(study => {
     // 작성자 닉네임 설정
     const creator = Meteor.users.findOne({ 'profile.nickname': study.userId }); // nickname 기준으로 사용자 찾기
     study.creatorName = creator ? creator.profile.nickname : '알 수 없음'; // 작성자 닉네임 설정

     // 신청자 수 계산 (작성자 제외)
     const applications = Application.find({ studyId: study._id }).fetch();
     const applicantCount = applications.reduce((count, app) => {
       // 신청자 중 작성자를 제외한 수를 카운트
       const isApplicant = app.userIds.filter(userId => userId !== study.userId).length;
       return count + isApplicant;
     }, 0);
     study.applicantCount = applicantCount;

     // 스터디의 진행 상태(progress) 가져오기
     const application = Application.findOne({ studyId: study._id });
     study.progress = application ? application.progress : '예정'; // 신청서가 없으면 기본값 '예정'
     study.startDate = application ? application.startDate : new Date();
     return study;
   });

   return studiesWithCreator; 
  },

  // Get studies the current user has applied for
  'study.getAppliedStudies': function () {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', '로그인한 사용자만 접근 가능합니다.');
    }

    const appliedStudies = Application.find({ userIds: this.userId }).fetch();
    if (appliedStudies.length === 0) {
      return [];
    }

    const studyIds = appliedStudies.map(app => app.studyId);
    const studies = Study.find({ _id: { $in: studyIds } }).fetch();

    const studiesWithCreator = studies.map(study => {
      const creator = Meteor.users.findOne(study.userId);
      study.creatorName = creator ? creator.profile.nickname : '알 수 없음';

      const applications = Application.find({ studyId: study._id }).fetch();
      study.applicantCount = applications.length;

      const application = applications.find(app => app.userIds.includes(this.userId));
      study.progress = application ? application.progress : '예정';
      study.startDate = application ? application.startDate : new Date();

      return study;
    });

    return studiesWithCreator;
  },
});
