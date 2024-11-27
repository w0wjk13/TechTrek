// imports/api/studyform.js
import { Meteor } from 'meteor/meteor';
import { Study, Application } from '/imports/api/collections'; // Study와 Application 컬렉션을 가져옵니다.

Meteor.methods({
  // 현재 로그인한 유저가 생성한 스터디 가져오기
  'study.getMyStudies': function () {
    // 로그인하지 않은 경우
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', '로그인한 사용자만 접근 가능합니다.');
    }

    // 현재 로그인한 사용자가 생성한 스터디를 찾기
    const myStudies = Study.find({ userId: this.userId }).fetch();

    if (myStudies.length === 0) {
      throw new Meteor.Error('no-studies', '생성한 스터디가 없습니다.');
    }

    // 작성자 닉네임과 신청자 수를 포함한 스터디 목록 반환
    const studiesWithCreator = myStudies.map(study => {
      const creator = Meteor.users.findOne(study.userId); // userId에 해당하는 작성자 정보 가져오기
      study.creatorName = creator ? creator.profile.nickname : '알 수 없음'; // 작성자 닉네임 설정

      // 신청자 수 계산 (작성자 제외)
      const applications = Application.find({ studyId: study._id }).fetch();
      const applicantCount = applications.reduce((count, app) => {
        // 신청자 중 작성자를 제외한 수를 카운트
        const isApplicant = app.userIds.filter(userId => userId !== study.userId).length;
        return count + isApplicant;
      }, 0);
      study.applicantCount = applicantCount;

      return study;
    });

    return studiesWithCreator;  // 작성자 닉네임과 신청자 수를 포함한 스터디 목록 반환
  }
});
